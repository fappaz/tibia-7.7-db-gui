import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, Card, ButtonGroup } from "@mui/material";
import { ImageOverlay, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


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

const MAP_WIDTH = 2560;
const MAP_HEIGHT = 2048;

const imageBounds = [
  [0, 0], // Top-left coordinates in pixels
  // [MAP_WIDTH, MAP_HEIGHT], // Bottom-right coordinates in pixels
  [MAP_HEIGHT, MAP_WIDTH], // Bottom-right coordinates in pixels
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
 * - fix map position when clicking on marker then moving around - most urgent!
 * - support coordinates from url params
 * - support custom marker icons (might face issues, see https://github.com/PaulLeCam/react-leaflet/issues/563 and https://stackoverflow.com/questions/73331688/how-to-use-svg-component-in-react-leaflet)
 * - improve UI of multiple floors
 * - show name of towns?
 * - add shortcut to towns
 * - generate map from version 7.7
 * - use css module instead of inline css
 * - jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map({
  center = [MAP_WIDTH / 2, MAP_HEIGHT / 2, 7],
  markers = [],
  zoom = -2,
} = {}) {
  
  const [map, setMap] = useState();
  const [position, setPosition] = useState(center);
  const activeFloor = position[2];

  const onMove = useCallback(() => {
    /**
     * The issue with the map not updating its position when dragging is likely happening here.
     * 
     * */
    // setPosition(position => {
    //   const currentCenter = map.getCenter();
    //   const newCenter = [currentCenter.lat, currentCenter.lng, position[2]];
    //   console.log(`@TODO moving map to: `, JSON.stringify(newCenter));
    //   return newCenter;
    // });
  }, [map]);

  useEffect(() => {
    if (!map) return;
    console.log(`@TODO ### position being updated to: `, position);
    // const coordinates = pixelsToCoordinates(position, [MAP_WIDTH, MAP_HEIGHT]);
    // map.setView(coordinates, map.getZoom(), { animate: true });
    map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);
  
  useEffect(() => {
    if (!map) return;
    map.on('movestart', onMove);
    return () => {
      map.off('movestart', onMove);
    }
  }, [map, onMove]);
  
  useEffect(() => {
    console.log(`@TODO ### external change requested: `, center);
    setPosition(position => center);
  }, [center]);

  const handleFloorChange = (increment) => {
    let newFloor = activeFloor + increment;
    if (newFloor < floors[0].value) newFloor = floors[0].value;
    if (newFloor > floors[floors.length - 1].value) newFloor = floors[floors.length - 1].value;

    setPosition(position => [position[0], position[1], newFloor]);
  };

  return (
    <div id='map-root' style={{ display: 'flex', width: '100%', height: '100%' }}>
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
        <ImageOverlay
          url={`/images/map/13.10/floor-${activeFloor.toString().padStart(2, '0')}-map.png`}
          bounds={imageBounds}
        />
        {
          markers.filter(marker => marker.coordinates.slice(2, 3)[0] === activeFloor).map((marker, index) => (
            <Marker key={index} position={pixelsToCoordinates(marker.coordinates, [MAP_WIDTH, MAP_HEIGHT])} icon={defaultIcon}>
              <Popup>
                {marker.label}
              </Popup>
            </Marker>
          ))
        }
        <div className='leaflet-bottom leaflet-left' style={{ padding: '2px 4px 0px 4px', backgroundColor: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>
          {position.join(', ')}
        </div>
      </MapContainer>

      <ButtonGroup variant='outlined' orientation='vertical'>
        <Button onClick={() => handleFloorChange(-1)} disabled={activeFloor <= 0}>+</Button>
        <Button disabled>{floors[activeFloor].label}</Button>
        <Button onClick={() => handleFloorChange(1)} disabled={activeFloor >= floors.length - 1}>-</Button>
      </ButtonGroup>

    </div>
  );
}

function pixelsToCoordinates([x, y], [width, height]) {
  return [height - y, x];
};