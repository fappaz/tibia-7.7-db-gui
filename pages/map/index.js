import { Badge, Box, Button, Divider, Grid, IconButton, Link, Popover, Tooltip } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import { landmarks } from "../../utils/TibiaMaps";
import { useRouter } from "next/router";
import TibiaMap from '../../components/tibiamap';
import Image from "next/image";
import PageLink from "next/link";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ClearIcon from '@mui/icons-material/Clear';
import database from '../../database/database.json';
import CellItems from "../../components/table/CellItems";
import { round } from "lodash";

/**
 * @TODO :
 * - show summary pop-up when clicking on a marker
 *   - creature: link on name, amount, interval, coordinates
 *   - npc: link on name, coordinates
 *   - chest: link on ID, rewards (with links), coordinates
 * - show landmark names on the map
 * - move components to separate files
 * 
 */

const VETERAN_START_COORDINATES = landmarks[landmarks.length - 1].coordinates;
const markerTypes = {
  landmarks: {
    id: 'landmarks',
    title: 'Landmarks',
    iconSrc: '/images/icons/map.png',
    data: landmarks.map(landmark => ({
      ...landmark,
      coordinates: landmark.coordinates,
    })),
    getColumns: ({ onLocationClick, } = {}) => [
      {
        field: 'name', headerName: 'Landmark', flex: 1,
      },
      {
        field: 'location', headerName: 'Location', flex: 1, valueGetter: params => params.row.coordinates.join(','),
        renderCell: (params) => (
          <Link onClick={() => onLocationClick(params.row.coordinates)}>
            {params.value}
          </Link>
        )
      },
    ],
    getMarkers: (rows) => rows.map(row => ({
      id: row.id,
      coordinates: row.coordinates,
      label: `${row.name} - ${row.coordinates.join(',')}`,
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
    title: 'Creatures',
    iconSrc: '/images/icons/fire-devil.png',
    data: database.creatures.filter(creature => creature.spawns.length > 0 && creature.outfit.id > 0),
    getColumns: ({ onLocationClick, } = {}) => [
      {
        field: 'id', headerName: 'Sprite', width: 70,
        renderCell: (params) => <Image src={`/images/sprites/${params.row.outfit.id}-0.png`} alt={params.row.name} width={32} height={32} />
      },
      {
        field: 'name', headerName: 'Name', flex: 1,
        renderCell: (params) => (
          <Link
            component={PageLink}
            href={`/creatures/${params.row.id}`}
          >
            {params.value}
          </Link>
        )
      },
      {
        field: 'spawns', headerName: 'Spawns', flex: 1, valueGetter: params => params.row.spawns.reduce((total, spawn) => total + spawn.amount, 0),
        renderCell: (params) => (
          <Link onClick={() => onLocationClick(params.row.spawns[0].coordinates)}>
            {`${params.value} found in ${params.row.spawns.length} places`}
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
            label: `${spawn.amount}x ${row.name} every ${round(spawn.interval / 60, 1)} minutes - ${spawn.coordinates.join(',')}`,
            icon: {
              url: `/images/sprites/${row.outfit.id}-0.png`,
            },
            ...(router ? { onClick: () => router.push(`/creatures/${row.id}`) } : null),
          })
        });
      });
      return markers;
    },
  },
  npcs: {
    id: 'npcs',
    title: 'NPCs',
    iconSrc: '/images/icons/citizen.png',
    data: database.npcs,
    getColumns: ({ onLocationClick, } = {}) => [
      { field: 'name', headerName: 'Name' },
      {
        field: 'location', headerName: 'Location', flex: 1, valueGetter: params => params.row.location.coordinates.join(','),
        renderCell: (params) => (
          <Link onClick={() => onLocationClick(params.row.location.coordinates)}>
            {params.value}
          </Link>
        )
      },
    ],
    getMarkers: (rows) => rows.map(row => ({
      id: row.id,
      coordinates: row.location.coordinates,
      label: `NPC ${row.name} - ${row.location.coordinates.join(',')}`,
      icon: {
        url: '/images/icons/citizen.png',
      }
    })),
  },
  quests: {
    id: 'quests',
    title: 'Quests',
    iconSrc: '/images/icons/chest.png',
    data: database.quests,
    getColumns: ({ onLocationClick, } = {}) => [
      { field: 'id', headerName: 'ID', width: 70 },
      {
        field: "rewards", headerName: "Rewards", flex: 1,
        renderCell: (params) => {
          const rewards = params.row.rewards.items.map(item => ({
            label: item.name,
            link: { path: `/item/${item.id}`, newTab: true },
          }));
          return <CellItems items={rewards} />;
        }
      },
      {
        field: 'location', headerName: 'Location', flex: 1, valueGetter: params => params.row.coordinates.join(','),
        renderCell: (params) => (
          <CoordinatesLink onLocationClick={onLocationClick} coordinates={params.row.coordinates} />
        )
      },
    ],
    getMarkers: (rows) => rows.map(row => ({
      id: row.id,
      coordinates: row.coordinates,
      label: `${row.rewards.items.length} rewards - ${row.coordinates.join(',')}`,
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
    const newMarkerTypeSelection = Object.entries(markerTypes).map(([markerTypeId, markerType]) => ({
      id: markerTypeId,
      markers: markerType.getMarkers(markerType.data, { router }),
      selectedIds: markerType.data.map(row => row.id),
    }));
    setMarkerTypeSelection(newMarkerTypeSelection);
  };

  return (
    <StandardPage title='Map'>
      
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

      <Box style={{ height: '32rem' }}>
        <Grid container spacing={2} mb={1}>
          {
            Object.entries(markerTypes).map(([id, markerType]) => {
              const selectedIds = (markerTypeSelection.find(markerTypeSelection => markerTypeSelection.id === id)?.selectedIds || []);
              return (
                <Grid item key={`button-${id}`}>
                  <MarkerButton
                    tooltip={`Showing ${selectedIds.length} ${markerType.title}`}
                    count={selectedIds.length}
                    iconSrc={markerType.iconSrc}
                    onClick={(e) => {
                      setActiveMarkerType(markerType);
                      setPopoverAnchorElement(e.currentTarget);
                    }}
                  />
                </Grid>
              )
            })
          }

          <Grid item ml={1}><Divider orientation="vertical" /></Grid>

          <Grid item>
            <Tooltip title={'Show all markers'}>
              <IconButton onClick={() => selectAllFromMarkerTypes(markerTypes)}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item>
            <Tooltip title={'Hide all markers'}>
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
} = {}) {

  return (
    <Tooltip title={tooltip}>
      <Badge badgeContent={count} color='primary'>
        <Button variant="outlined" onClick={onClick}>
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
    // add a cursor of pointer to the link
    <Link onClick={() => onLocationClick(coordinates)} style={{ 
      cursor: 'pointer',
     }}>
      {coordinates.join(', ')}
    </Link>
  );
}