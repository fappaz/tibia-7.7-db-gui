/** See: https://github.com/Leaflet/Leaflet/issues/6552#issuecomment-711028109 */
import dynamic from 'next/dynamic'
import { AUTOMAP_HEIGHT, AUTOMAP_WIDTH } from '../../utils/TibiaMaps';
const Automap = dynamic(() => import('./Automap'), { ssr: false });


/** @TODO (future) for some reason the map is not moving correctly when I don't pass a position, even though it already has default parameters for that */
const defaultMapPosition = [AUTOMAP_WIDTH / 2, AUTOMAP_HEIGHT / 2, 7];

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map(props) {

  return (
    // <Automap center={defaultMapPosition} {...props}/>
    <Automap {...props}/>
  );
}