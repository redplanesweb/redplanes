// =============================================================================
// IMPORTS
// =============================================================================
import {
    Button,
} from '@material-ui/core';
import netlifyAuth from '../../netlifyAuthentication.js'
import DashAppBar from '@components/seller-dash/SellerAppBar'
import Sidebar from '@components/seller-dash/SellerSidebar'
import Head from 'next/head'

// =============================================================================
// PRIVATE ROUTE WRAPPER
// =============================================================================
const Page = ({ pageName, children, head, useStore, firebase }) => {
    let [user, setUser] = React.useState(null)

    // Global State Zustand
    let state = useStore(state => state)

    return (

        <React.Fragment>
            <Head>
                <title>{head}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <AdminLayout content={children} pageName={pageName} firebase={firebase} state={state} />

        </React.Fragment>

    )
}

// =============================================================================
// RENDER
// =============================================================================
const AdminLayout = ({ content, pageName, firebase, state }) => {
    const [menuOpen, setMenuOpen] = React.useState(true)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleLogout = () => {
        logout()
        setAnchorEl(null)
    }

    return (
        <main style={{ height: '100vh', overflow: 'hidden' }}>
            <DashAppBar firebase={firebase} setMenuOpen={setMenuOpen} menuOpen={menuOpen} page={pageName} state={state} />


            <main className="dashboard-main-container dm-panel-two-background" style={{ height: 'calc(100vh - 60px)', gridTemplateColumns: menuOpen ? '275px 1fr' : '0px 1fr' }}>
                <aside className="dashboard-sidebar">
                    <Sidebar menuOpen={menuOpen} />
                </aside>

                <section className="dashboard-right-content dm-body-background" style={{ overflowY: 'scroll' }}>
                    {content}
                </section>
            </main>
        </main>
    )
}

export default Page