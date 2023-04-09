import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, Card, ButtonGroup } from "@mui/material";
import { ImageOverlay, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AUTOMAP_HEIGHT, AUTOMAP_WIDTH, pixelsToLatLng, latLngToPixels } from '../../utils/TibiaMaps';


// Create a Leaflet icon object using the default icon images
const defaultIcon = new L.icon({
  iconUrl: '/images/icons/marker-icon.png',
  shadowUrl: '/images/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const imageBounds = [
  [0, 0], // Top-left coordinates in pixels
  [AUTOMAP_HEIGHT, AUTOMAP_WIDTH], // Bottom-right coordinates in pixels
];

const floors = [
  {
    value: 0,
    label: '+7',
  },
  {
    value: 1,
    label: '+6',
  },
  {
    value: 2,
    label: '+5',
  },
  {
    value: 3,
    label: '+4',
  },
  {
    value: 4,
    label: '+3',
  },
  {
    value: 5,
    label: '+2',
  },
  {
    value: 6,
    label: '+1',
  },
  {
    value: 7,
    label: '0',
  },
  {
    value: 8,
    label: '-1',
  },
  {
    value: 9,
    label: '-2',
  },
  {
    value: 10,
    label: '-3',
  },
  {
    value: 11,
    label: '-4',
  },
  {
    value: 12,
    label: '-5',
  },
  {
    value: 13,
    label: '-6',
  },
  {
    value: 14,
    label: '-7',
  },
  {
    value: 15,
    label: '-8',
  },
];

/**
 * @TODO
 * - fix default center issue
 * - support coordinates from url params
 * - support custom marker icons (might face issues, see https://github.com/PaulLeCam/react-leaflet/issues/563 and https://stackoverflow.com/questions/73331688/how-to-use-svg-component-in-react-leaflet)
 * - improve UI of multiple floors
 * - show name of towns?
 * - generate map from version 7.7
 * - use css module instead of inline css
 * - jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map({
  center = [AUTOMAP_WIDTH / 2, AUTOMAP_HEIGHT / 2, 7],
  markers = [],
  zoom = 0,
} = {}) {

  const [map, setMap] = useState();
  const [position, setPosition] = useState(() => pixelsToLatLng(center, [AUTOMAP_WIDTH, AUTOMAP_HEIGHT]));
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

  useEffect(() => {
    if (!map) return;
    map.setView(position, map.getZoom(), { animate: false });
  }, [map, position]);

  useEffect(() => {
    const position = pixelsToLatLng(center, [AUTOMAP_WIDTH, AUTOMAP_HEIGHT]);
    setPosition(currentState => position);
  }, [center]);

  const handleFloorChange = (increment) => {
    let newFloor = activeFloor + increment;
    if (newFloor < floors[0].value) newFloor = floors[0].value;
    if (newFloor > floors[floors.length - 1].value) newFloor = floors[floors.length - 1].value;

    setPosition(position => [position[0], position[1], newFloor]);
  };

  return (
    <>
      <div style={{ position: `relative`, width: `100%`, height: `100%`, }}>

        <div id='map-root' style={{ display: 'flex', position: `absolute`, width: '100%', height: '100%' }}>
          <MapContainer
            center={center.slice(0, 2)}
            zoom={zoom}
            minZoom={-2}
            maxZoom={4}
            crs={L.CRS.Simple}
            style={{
              height: "100%",
              width: "100%",
              imageRendering: "-moz-crisp-edges",
              imageRendering: "-webkit-optimize-contrast",
              imageRendering: "pixelated",
            }}
            ref={setMap}
          >

            <div style={{ position: `relative`, width: `100%`, height: `100%`, }}>
              <ImageOverlay
                url={`/images/map/13.10/floor-${activeFloor.toString().padStart(2, '0')}-map.png`}
                bounds={imageBounds}
              />
              {
                markers.filter(marker => marker.coordinates.slice(2, 3)[0] === activeFloor).map((marker, index) => (
                  <Marker key={index} position={pixelsToLatLng(marker.coordinates, [AUTOMAP_WIDTH, AUTOMAP_HEIGHT])} icon={defaultIcon}>
                    <Popup>
                      {marker.label}
                    </Popup>
                  </Marker>
                ))
              }

              <div style={{ position: `absolute`, left: `50%`, top: 0, bottom: 0, width: `1px`, borderLeft: `1px dashed yellow`, zIndex: 400 }} ></div>
              <div style={{ position: `absolute`, top: `50%`, left: 0, right: 0, height: `1px`, borderTop: `1px dashed yellow`, zIndex: 400 }} ></div>
            </div>

            <div className='leaflet-bottom leaflet-left' style={{ padding: '2px 4px 0px 4px', backgroundColor: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>
              {latLngToPixels(position, [AUTOMAP_WIDTH, AUTOMAP_HEIGHT]).join(', ')}
            </div>
          </MapContainer>

          <ButtonGroup variant='outlined' orientation='vertical'>
            <Button onClick={() => handleFloorChange(-1)} disabled={activeFloor <= 0}>+</Button>
            <Button disabled>{floors[activeFloor].label}</Button>
            <Button onClick={() => handleFloorChange(1)} disabled={activeFloor >= floors.length - 1}>-</Button>
          </ButtonGroup>

        </div>

      </div>

    </>
  );
}