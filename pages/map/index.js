import { Box } from "@mui/material";
import StandardPage from "../../components/StandardPage";
import { landmarks, largeCoordinatesToAutomapCoordinates } from "../../utils/TibiaMaps";
import LocationMap from "../../components/LocationMap";
import { useRouter } from "next/router";

const landmarkMarkers = landmarks.sort((a,b) => a.name.localeCompare(b.name)).map(landmark => ({
  coordinates: largeCoordinatesToAutomapCoordinates(landmark.largeCoordinates),
  label: landmark.name,
}));

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map({

} = {}) {
  
  const router = useRouter();
  const { at } = router.query;

  /** The last marker is the "VeteranStart" in Thais temple */
  const coordinates = at ? at.split(',').map(Number) : landmarkMarkers[landmarkMarkers.length - 1].coordinates;

  return (
    <StandardPage title='Map'>
      <Box style={{ height: '32rem' }}>
        <LocationMap
          quickAccess={{
            items: landmarkMarkers
          }}
          coordinates={coordinates}
        />
      </Box>
    </StandardPage>
  );
}