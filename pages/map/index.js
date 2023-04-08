import StandardPage from "../../components/StandardPage";
import TibiaMap from "../../components/tibiamap";

/**
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Map({

} = {}) {

  return (
    <StandardPage title='Map'>
      <div
        style={{
          height: '30rem',
        }}
      >
        <TibiaMap />
      </div>
    </StandardPage>
  );
}