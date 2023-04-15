import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Tibia database</title>
        {/**
          @TODO fix this
          Do not add stylesheets using next/head (see <link rel="stylesheet"> tag with href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"). Use Document instead. 
          See more info here: https://nextjs.org/docs/messages/no-stylesheets-in-head-component
        */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossorigin="" />
      </Head>

      <main>
      </main>

    </div>
  )
}
