/** See: https://github.com/Leaflet/Leaflet/issues/6552#issuecomment-711028109 */
import dynamic from 'next/dynamic'
const Automap = dynamic(() => import('./Automap'), { ssr: false });

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map(props) {

  return (
    <Automap {...props}/>
  );
}