import { Box } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import { landmarks, largeCoordinatesToAutomapCoordinates } from "../../utils/TibiaMaps";
import LocationMap from "../../components/LocationMap";

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map({

} = {}) {

  const markers = landmarks.sort((a,b) => a.name.localeCompare(b.name)).map(landmark => ({
    coordinates: largeCoordinatesToAutomapCoordinates(landmark.largeCoordinates),
    label: landmark.name,
  }));

  return (
    <StandardPage title='Map'>
      <Box style={{ height: '32rem' }}>
        <LocationMap
          // markers={markers}
          quickAccess={{
            items: markers
          }}
          /** The last marker is the "VeteranStart" in Thais temple */
          defaultMarker={markers[markers.length - 1]}
        />
      </Box>
    </StandardPage>
  );
}