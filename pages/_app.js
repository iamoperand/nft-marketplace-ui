import "styles/globals.css"
import Head from "next/head"
import { MoralisProvider } from "react-moralis"

import Header from "components/header"
import env from "constants/env"

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider appId={env.moralis.appId} serverUrl={env.moralis.serverUrl}>
                <Header />
                <Component {...pageProps} />
            </MoralisProvider>
        </div>
    )
}

export default MyApp
