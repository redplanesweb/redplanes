// =============================================================================
// IMPORTS
// =============================================================================
import firebase from '@components/firebase'
import Head from 'next/head';
import create from 'zustand'
import Providers from '@components/ui/Provider'
import { GlobalStyles } from '../src/global'
import '../src/framework.css'


// =============================================================================
// GLOBAL STATES
// =============================================================================
const useStore = create(set => ({
    regionMap: {},
    centerMap: {},
    providerMap: {},
    ageMap: {},
    planType: {},
    mapsLoaded: false,
    seller: {},
    setData: (data) => set(state => ({
        ...state,
        regionMap: data.region,
        centerMap: data.center,
        providerMap: data.provider,
        ageMap: data.age,
        planType: data.planType,
        mapsLoaded: data.success
    })),
    setSeller: (data) => set(state => ({ ...state, seller: data })),
    setState: (data) => set(state => ({ ...state, pageProps: data }))
}))



// =============================================================================
// EXPORT
// =============================================================================
const MyApp = ({ Component, pageProps }) => {
    let store = useStore(state => state)



    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        store.setState(pageProps)
    }, []);

    console.log(store)

    return (
        <React.Fragment>
            <Head>
                <title>My page</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <Providers>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <GlobalStyles />
                <Component store={store} useStore={useStore} firebase={firebase} />
            </Providers>

        </React.Fragment>
    )

}

export default MyApp