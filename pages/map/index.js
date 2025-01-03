import { Badge, Box, Button, Divider, Grid, IconButton, Link, Popover, Tooltip } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import { landmarks } from "../../utils/TibiaMaps";
import { useRouter } from "next/router";
import TibiaMap from '../../components/tibiamap';
import Image from "next/image";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ClearIcon from '@mui/icons-material/Clear';
import creatures from '../../database/creatures.json';
import npcs from '../../database/npcs.json';
import quests from '../../database/quests.json';
import { columnModel as landmarksColumns } from "../../components/landmarks/Table";
import { columnModel as creaturesColumns } from "../../components/creatures/Table";
import { columnModel as npcsColumns } from "../../components/npcs/Table";
import { columnModel as questsColumns } from "../../components/quests/Table";
import { round } from "lodash";
import i18n from "../../api/i18n";
import { useTranslation } from "react-i18next";
import { random } from "../../utils/Math";

/**
 * @TODO :
 * - show summary pop-up when clicking on a marker
 *   - creature: link on name, amount, interval, coordinates
 *   - npc: link on name, coordinates
 *   - chest: link on ID, rewards (with links), coordinates
 * - show landmark names on the map (how to handle overlapping or too many nearby?)
 * - move components to separate files
 * - support query params to show one or all markers for each category
 * - add button to show markers for the locked doors and their required keys
 * - add button to show markers for holes (up and down)
 * - toggle to street view mode
 * - responsive for mobile
 * 
 */

const VETERAN_START_COORDINATES = landmarks[landmarks.length - 1].coordinates;
const markerTypes = {
  landmarks: {
    id: 'landmarks',
    iconSrc: '/images/icons/map.png',
    data: landmarks.map(landmark => ({
      ...landmark,
      coordinates: landmark.coordinates,
    })),
    getColumns: ({ onLocationClick, } = {}) => [
      landmarksColumns.name,
      {
        ...landmarksColumns.coordinates,
        renderCell: (params) => <CoordinatesLink onLocationClick={onLocationClick} coordinates={params.row.coordinates} />,
      }
    ],
    getMarkers: (rows) => rows.map(row => ({
      id: row.id,
      coordinates: row.coordinates,
      label: i18n.t(`landmarks.marker.tooltip`, { coordinates: row.coordinates.join(','), name: row.name }),
      icon: {
        color: 'yellow',
        id: row.id,

        /** @TODO show as text only */
        // type: 'svg',
        // url: `<svg width='120' height='20'><text x="0" y="0" dominant-baseline="hanging" style="font: 12px serif;" >${row.name}</text></svg>`,
      }
    })),
  },
  creatures: {
    id: 'creatures',
    iconSrc: '/images/icons/fire-devil.png',
    data: creatures.filter(creature => creature.spawns.length > 0 && creature.outfit.id > 0),
    getColumns: ({ onLocationClick, } = {}) => [
      creaturesColumns.sprite,
      creaturesColumns.name,
      {
        ...creaturesColumns.spawns,
        renderCell: (params) => (
          <Link onClick={() => onLocationClick(params.row.spawns[random(0, params.row.spawns.length - 1)].coordinates)}>
            {i18n.t('creatures.table.columns.spawns.value', { amount: params.value, placesCount: params.row.spawns.length })}
          </Link>
        )
      },
    ],
    getMarkers: (rows, { router } = {}) => {
      const markers = [];
      rows.forEach(row => {
        row.spawns.forEach(spawn => {
          markers.push({
            id: row.id,
            coordinates: spawn.coordinates,
            label: i18n.t(`creatures.marker.tooltip`, { coordinates: spawn.coordinates.join(','), name: row.name, amount: spawn.amount, minutes: round(spawn.interval / 60, 1) }),
            icon: {
              url: `/images/sprites/creatures/${row.id}-0.png`,
            },
            // ...(router ? { onClick: () => router.push(`/creatures/${row.id}`) } : null),
            onClick: () => window.open(`/creatures/${row.id}`, '_blank', 'noopener,noreferrer'),
          })
        });
      });
      return markers;
    },
  },
  npcs: {
    id: 'npcs',
    iconSrc: '/images/icons/citizen.png',
    data: npcs,
    getColumns: ({ onLocationClick, } = {}) => [
      npcsColumns.sprite,
      npcsColumns.name,
      {
        ...npcsColumns.coordinates,
        renderCell: (params) => <CoordinatesLink onLocationClick={onLocationClick} coordinates={params.row.location.coordinates} />,
      },
    ],
    getMarkers: (rows) => rows.map(row => ({
      id: row.id,
      coordinates: row.location.coordinates,
      label: i18n.t(`npcs.marker.tooltip`, { coordinates: row.location.coordinates.join(','), name: row.name }),
      icon: {
        url: '/images/icons/citizen.png',
      }
    })),
  },
  quests: {
    id: 'quests',
    iconSrc: '/images/icons/chest.png',
    data: quests,
    getColumns: ({ onLocationClick, } = {}) => [
      questsColumns.id,
      questsColumns.rewards,
      {
        ...questsColumns.coordinates,
        renderCell: (params) => <CoordinatesLink onLocationClick={onLocationClick} coordinates={params.row.coordinates} />,
      },
    ],
    getMarkers: (rows) => rows.map(row => ({
      id: row.id,
      coordinates: row.coordinates,
      label: i18n.t(`quests.marker.tooltip`, { coordinates: row.coordinates.join(','), id: row.id, rewardsCount: row.rewards.items.length }),
      icon: {
        url: '/images/icons/chest.png',
      }
    })),
  },
};

const defaultMarkerTypeSelection = [
  {
    id: markerTypes.landmarks.id,
    markers: markerTypes.landmarks.getMarkers(markerTypes.landmarks.data),
    selectedIds: markerTypes.landmarks.data.map(landmark => landmark.id),
  },
];

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map({

} = {}) {

  const router = useRouter();
  const { t } = useTranslation();
  const { at } = router.query;
  const [coordinates, setCoordinates] = useState(VETERAN_START_COORDINATES);
  const [activeMarkerType, setActiveMarkerType] = useState();
  const [popoverAnchorElement, setPopoverAnchorElement] = useState(null);
  const [markerTypeSelection, setMarkerTypeSelection] = useState(defaultMarkerTypeSelection);
  const markers = markerTypeSelection.reduce((markers, markerTypeSelection) => markers.concat(markerTypeSelection.markers), []);

  useEffect(function onMount() {
    if (!at) return;
    setCoordinates(at.split(',').map(Number));
  }, [at]);

  const handleLocationChange = (location) => {
    router.push(`/map?at=${location.join(',')}`, undefined, { shallow: true });
  };

  const onRowSelectionModelChange = (markerTypeId, selectedIds) => {
    setMarkerTypeSelection(markerTypeSelection => {
      const newMarkerTypeSelection = [...markerTypeSelection];
      const markerGroupIndex = newMarkerTypeSelection.findIndex(markerType => markerType.id === markerTypeId);
      const markerType = markerTypes[markerTypeId];
      const selectedData = markerType.data.filter(row => selectedIds.includes(row.id));
      const markers = markerType.getMarkers(selectedData, { router });
      const selection = { id: markerTypeId, markers, selectedIds };

      if (markerGroupIndex < 0) {
        newMarkerTypeSelection.push(selection);
      } else {
        newMarkerTypeSelection[markerGroupIndex] = selection;
      }

      return newMarkerTypeSelection;
    });
  };

  const selectAllFromMarkerTypes = (markerTypes = {}) => {
    setMarkerTypeSelection(markerTypeSelection => {

      if (Object.keys(markerTypes).length === 0) return [];

      // @TODO (medium) show all markers should show all instead of toggling them

      let newMarkerTypeSelection = [...markerTypeSelection];
      Object.entries(markerTypes).forEach(([markerTypeId, markerType]) => {
        const markers = markerType.getMarkers(markerType.data, { router });
        const markerIds = markerType.data.map(row => row.id);
        const currentlySelectedIds = markerTypeSelection.find(selectedMarkerType => selectedMarkerType.id === markerTypeId)?.selectedIds || [];

        if (currentlySelectedIds.length === markerIds.length) {
          newMarkerTypeSelection = newMarkerTypeSelection.filter(selectedMarkerType => selectedMarkerType.id !== markerTypeId);
        } else {
          newMarkerTypeSelection = newMarkerTypeSelection.filter(selectedMarkerType => selectedMarkerType.id !== markerTypeId);
          newMarkerTypeSelection.push({ id: markerTypeId, markers, selectedIds: markerIds });
        }

      });

      return newMarkerTypeSelection;
    });
  };

  return (
    <StandardPage title={t('pages.map.title')}>

      <Popover
        id='popover-1'
        open={!!popoverAnchorElement}
        anchorEl={popoverAnchorElement}
        onClose={() => setPopoverAnchorElement(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {
          !!activeMarkerType && (
            <MarkersTable
              data={activeMarkerType.data}
              columns={activeMarkerType.getColumns({ onLocationClick: handleLocationChange })}
              rowSelectionModel={markerTypeSelection.find(markerType => markerType.id === activeMarkerType.id)?.selectedIds || []}
              onRowSelectionModelChange={(rowSelectionModel) => onRowSelectionModelChange(activeMarkerType.id, rowSelectionModel)}
            />
          )
        }
      </Popover>

      <Box style={{ height: '90%' }}>
        <Grid container spacing={2} mb={1}>
          {
            Object.entries(markerTypes).map(([id, markerType]) => {
              const selectedIds = (markerTypeSelection.find(markerTypeSelection => markerTypeSelection.id === id)?.selectedIds || []);
              return (
                <Grid item key={`button-${id}`}>
                  <MarkerButton
                    tooltip={t('pages.map.markerTypeTooltip', { count: selectedIds.length, type: t(`${id}.name`) })}
                    count={selectedIds.length}
                    iconSrc={markerType.iconSrc}
                    onClick={(e) => {
                      setActiveMarkerType(markerType);
                      setPopoverAnchorElement(e.currentTarget);
                    }}
                    onAuxClick={(e) => {
                      if (e.button !== 1) return; // middle click
                      selectAllFromMarkerTypes({ [id]: markerType });
                    }}
                  />
                </Grid>
              )
            })
          }

          <Grid item ml={1}><Divider orientation="vertical" /></Grid>

          <Grid item>
            <Tooltip title={t('pages.map.actions.showAll')}>
              <IconButton onClick={() => selectAllFromMarkerTypes(markerTypes)}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title={t('pages.map.actions.hideAll')}>
              <IconButton onClick={() => selectAllFromMarkerTypes({})}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <TibiaMap center={coordinates} markers={markers} />
      </Box>
    </StandardPage>
  );
}

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function MarkerButton({
  tooltip,
  count,
  iconSrc,
  onClick,
  ...buttonProps
} = {}) {

  return (
    <Tooltip title={tooltip}>
      <Badge badgeContent={count} color='primary' max={999}>
        <Button variant="outlined" onClick={onClick} {...buttonProps}>
          <Image src={iconSrc} width={32} height={32} alt={tooltip} />
        </Button>
      </Badge>
    </Tooltip>
  );
}


/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function MarkersTable({
  data = [],
  columns = [],
  tableProps,
  rowSelectionModel,
  onRowSelectionModelChange,
} = {}) {

  return (
    <Box sx={{ width: '100%', height: '64vh' }}>
      <DataGrid
        rows={data}

        columns={columns}

        slots={{
          toolbar: GridToolbarQuickFilter
        }}

        disableVirtualization

        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={onRowSelectionModelChange}
        rowSelectionModel={rowSelectionModel}

        initialState={{
          sorting: {
            sortModel: [{ field: 'name', sort: 'asc' }],
          },
        }}

        getRowHeight={() => 'auto'}

        {...tableProps}
      />
    </Box>
  );

}


/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
function CoordinatesLink({
  coordinates = [],
  onLocationClick,
} = {}) {

  return (
    <Link
      onClick={() => onLocationClick(coordinates)}
      style={{
        cursor: 'pointer',
      }}
    >
      {coordinates.join(', ')}
    </Link>
  );
}