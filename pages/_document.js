import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content="EXTREME WEATHER - Live Tracker" />
        <meta property="og:description" content="Track the 20 most extreme places on Earth in real-time. Hottest, coldest, windiest locations updated every 30 minutes." />
        <meta property="og:image" content="https://your-vercel-url.vercel.app/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EXTREME WEATHER Tracker" />
        <meta name="twitter:description" content="Live tracking of Earth's most extreme weather locations" />
        <meta name="twitter:image" content="https://your-vercel-url.vercel.app/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}