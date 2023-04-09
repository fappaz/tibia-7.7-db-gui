import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import TibiaMap from './tibiamap';
import { useState, useEffect } from "react";

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function LocationMap({
  markers = [],
  mapProps = {},
  quickAccess = {
    items: [],
    title: 'Quick access',
  },
  coordinates,
} = {}) {

  const [_coordinates, setCoordinates] = useState(coordinates);

  useEffect(() => {
    setCoordinates(coordinates);
  }, [coordinates]);

  return (
    <Box display='flex' sx={{ width: '100%', height: '100%' }}>
      <QuickAccess markers={quickAccess.items} onSelect={setCoordinates} coordinates={_coordinates} title={quickAccess.title} />
      <Box p={1} flexGrow={1}>
        <TibiaMap center={_coordinates} markers={markers} {...mapProps} />
      </Box>
    </Box>
  );
}


/**
 * @TODO move to its own file?
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export function QuickAccess({
  markers = [],
  coordinates = [],
  onSelect,
  title,
} = {}) {

  return (
    <div style={{ overflow: 'auto' }}>
      {!!title && <Typography variant='caption'>{title}</Typography>}
      <List>
        <Divider />
        {
          markers.map((marker, index) => (
            <div key={index}>
              <ListItem disablePadding>
                <ListItemButton selected={JSON.stringify(coordinates) === JSON.stringify(marker.coordinates)} onClick={() => onSelect(marker.coordinates)}>
                  <ListItemText primary={marker?.label} secondary={`${index + 1}. ${marker.coordinates.join(',')}`} />
                </ListItemButton>
              </ListItem>

              <Divider />
            </div>
          ))
        }
      </List>
    </div>
  );
}