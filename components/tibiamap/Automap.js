import { useState, useEffect, useCallback } from 'react';
import { Button, ButtonGroup, Grid, ThemeProvider, createTheme } from "@mui/material";
import { ImageOverlay, MapContainer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MIN_X, MIN_Y, MAX_X, MAX_Y, pixelsToLatLng, latLngToPixels, landmarks } from '../../utils/TibiaMaps';
import PixiOverlay from './PixiOverlay';
import Control from 'react-leaflet-custom-control';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const imageBounds = [
  [MIN_Y, MIN_X], // Top-left coordinates
  [MAX_Y, MAX_X], // Bottom-right coordinates
];

const defaultFloorIndex = 7;
const floors = new Array(16).fill(0).map((value, index) => {
  const delta = defaultFloorIndex - index;
  const sign = delta > 0 ? '+' : '';
  return { value: index, label: `${sign}${delta}` };
});

export const defaultCenter = landmarks[landmarks.length - 1].coordinates;

/** Theme for the controls inside the map */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
  },
});

/**
 * @TODO (future)
 * - improve UI of multiple floors
 * - generate map from version 7.7
 * - show name of towns?
 * - use css module instead of inline css
 * - jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map({
  center = defaultCenter,
  markers = [],
  zoom = 0,
  minZoom= -2,
  maxZoom= 4,
} = {}) {

  const [map, setMap] = useState();
  const [position, setPosition] = useState(() => pixelsToLatLng(center));
  const activeFloor = position[2];

  const onMove = useCallback(() => {
    setPosition(position => {
      const currentCenter = map.getCenter();
      const newCenter = [currentCenter.lat.toFixed(0), currentCenter.lng.toFixed(0), position[2]];
      return newCenter;
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
    }
  }, [map, onMove]);

  useEffect(function onPositionChanged() {
    if (!map) return;
    map.setView(position, map.getZoom(), { animate: false });
  }, [map, position]);

  useEffect(function onCenterChanged() {
    const position = pixelsToLatLng(center);
    setPosition(currentState => position);
  }, [center]);

  const handleFloorChange = (increment) => {
    let newFloor = activeFloor + increment;
    if (newFloor < floors[0].value) newFloor = floors[0].value;
    if (newFloor > floors[floors.length - 1].value) newFloor = floors[floors.length - 1].value;

    setPosition(position => [position[0], position[1], newFloor]);
  };

  const handleZoomChange = (increment) => {
    const newZoom = map.getZoom() + increment;
    if (newZoom < minZoom) return;
    if (newZoom > maxZoom) return;
    map.setZoom(newZoom);
  };

  return (
    <>
      <div style={{ position: `relative`, width: `100%`, height: `100%`, }}>

        <div id='map-root' style={{ display: 'flex', position: `absolute`, width: '100%', height: '100%' }}>
          <MapContainer
            center={center.slice(0, 2)}
            zoom={zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            crs={L.CRS.Simple}
            style={{
              height: "100%",
              width: "100%",
              imageRendering: "-moz-crisp-edges",
              imageRendering: "-webkit-optimize-contrast",
              imageRendering: "pixelated",
            }}
            ref={setMap}
            preferCanvas
            zoomControl={false}
            attributionControl={false} /** Sorry */
          >

            <div style={{ position: `relative`, width: `100%`, height: `100%`, }}>
              <ImageOverlay
                url={`/images/map/13.10/floor-${activeFloor.toString().padStart(2, '0')}-map.png`}
                bounds={imageBounds}
                zIndex={-1} // z index is negative so PixiOverlay can be rendered on top
                opacity={activeFloor === defaultFloorIndex ? 0.85 : 0.65}
              />
              <PixiOverlay
                markers={
                  markers.filter(marker => marker.coordinates.slice(2, 3)[0] === activeFloor).map(marker => {
                    const { icon, coordinates, label, ...overlayData } = marker;
                    return {
                      id: marker.id || coordinates.join(','),
                      position: pixelsToLatLng(coordinates),
                      ...(icon ? {
                        icon: {
                          id: icon.id || icon.color || icon.url,
                          image: icon.url,
                          color: icon.color,
                          type: icon.type || (icon.url ? 'png' : 'svg'),
                        },
                      } : {
                        icon: { color: 'yellow', type: 'svg' },
                      }),
                      tooltip: label,
                      // popup: '<div>All good!</div>',
                      // popup: renderToString(<div>All good!</div>),
                      // onClick: () => alert("marker clicked"),
                      ...overlayData,
                    };
                  })
                }
              />
              <div style={{ position: `absolute`, left: `50%`, top: 0, bottom: 0, width: `1px`, borderLeft: `1px dashed yellow`, zIndex: 400 }} ></div>
              <div style={{ position: `absolute`, top: `50%`, left: 0, right: 0, height: `1px`, borderTop: `1px dashed yellow`, zIndex: 400 }} ></div>
            </div>

            <Control position='topright'>
              <div
                ref={(ref) => {
                  if (!ref) return;
                  L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
                }}
              >
                <ThemeProvider theme={theme}>
                  <Grid container direction='column' spacing={2}>
                    <Grid item>
                      <ButtonGroup
                        variant='contained'
                        orientation='vertical'
                        size='small'
                      >
                        <Button onClick={() => handleFloorChange(-1)} disabled={activeFloor <= 0}><ArrowDropUpIcon /></Button>
                        <Button
                          onClick={(e) => {
                            setPosition(pixelsToLatLng(center));
                          }}
                          onAuxClick={(e) => {
                            if (e.button !== 1) return; // middle click
                            setPosition(pixelsToLatLng(defaultCenter));
                          }}
                        >
                          {floors[activeFloor].label}
                        </Button>
                        <Button onClick={() => handleFloorChange(1)} disabled={activeFloor >= floors.length - 1}><ArrowDropDownIcon /></Button>
                      </ButtonGroup>
                    </Grid>

                    <Grid item>
                      <ButtonGroup
                        variant='contained'
                        orientation='vertical'
                        size='small'
                      >
                        <Button onClick={() => handleZoomChange(1)} disabled={map && map.getZoom() >= maxZoom}><ZoomInIcon /></Button>
                        <Button onClick={() => handleZoomChange(-1)} disabled={map && map.getZoom() <= minZoom}><ZoomOutIcon /></Button>
                      </ButtonGroup>
                    </Grid>
                  </Grid>
                </ThemeProvider>
              </div>
            </Control>

            <div className='leaflet-bottom leaflet-right' style={{ padding: '2px 4px 0px 4px', backgroundColor: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>
              {latLngToPixels(position).join(', ')}
            </div>
          </MapContainer>

        </div>

      </div>

    </>
  );
}