import { Button, CircularProgress, Grid, Modal, TextField, Paper } from '@material-ui/core';
import PageTemplate from '@components/admin/PageTemplate'
import SellerTable from '@components/admin/SellerUserTable'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ButtonWrapper from '@components/ui/MuiButtonWrapper'

const MassUpload = ({ useStore, firebase }) => {
    const [loaded, setLoaded] = React.useState(false)
    let state = useStore(state => state)

    // Firebase stuff
    const userRef = firebase.firestore().collection('seller_users')
    const [seller_users] = useCollectionData(userRef, { idField: 'id' })
    //const seller_users = null

    // Check if Page info is loaded
    React.useEffect(() => { if (state.mapsLoaded) setLoaded(true) }, [state])

    // Create User  
    const createUser = (e) => {
        e.preventDefault()
        console.log("Hello")
        let email = "codebytesfl@gmail.com"
        let password = "123456"

        // Create the user first, then get the ID and create an entry in the users 
        // Collection in firestore
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {

                // Get UID
                firebase.firestore().collection('seller_users').doc(firebase.auth().currentUser.uid).set({
                    username: 'Name',
                    email: email,
                    level: 1,
                    balance: 30000
                })
                    .catch(error => {
                        console.log("something went wrong with adding firestore susers: ", error)
                    })

            })
            .catch(error => {
                console.log("something went wrong with creating user: ", error)
            })
    }

    return (
        <PageTemplate head={"Sellers"} pageName={"Sellers"} useStore={useStore} firebase={firebase}>
            {!loaded && <CircularProgress color="secondary" />}
            <section style={{ display: loaded ? 'block' : 'none' }}>
                <Grid container spacing={3}>
                    {/* <div>
                        <h1>Create User</h1>
                        <form onSubmit={createUser}>
                            <button type="subimt">Submit</button>
                        </form>

                    </div> */}
                    <Grid item xs={6}>
                        <UserMetrics data={seller_users} />
                    </Grid>

                    <Grid item xs={6}>
                        <AddUser firebase={firebase} />
                    </Grid>

                    <Grid item xs={12}>
                        <UserTable data={seller_users} firebase={firebase} />
                    </Grid>
                </Grid>
            </section>
        </PageTemplate >)
}

// =============================================================================
// ADD USER
// =============================================================================
const AddUser = ({ firebase }) => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [level, setLevel] = React.useState('')
    const [balance, setBalance] = React.useState('')

    // submission states
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [success, setSuccess] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(email)

        // Create the user first, then get the ID and create an entry in the users 
        // Collection in firestore
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {

                // Get UID
                firebase.firestore().collection('seller_users').doc(firebase.auth().currentUser.uid).set({
                    username: username,
                    email: email,
                    level: level,
                    balance: balance
                })
                    .then(() => {
                        alert("Successful")
                        setSuccess(true)
                        setLoading(false)
                    })
                    .catch(error => {
                        console.log("something went wrong with adding firestore susers: ", error)
                        setError(true)
                        setErrorMessage(error)
                        setLoading(false)
                    })

            })
            .catch(error => {
                console.log("something went wrong with creating user: ", error)
                setError(true)
                setErrorMessage(error)
                setLoading(false)
            })
    }


    return (
        <Paper style={{ padding: '1em' }}>
            <h1 style={{ marginBottom: '1em' }}>Add Users</h1>
            {
                error &&
                <div>
                    <h2>Error Occurred:</h2>
                    <p>{errorMessage}</p>
                </div>
            }

            {
                (!loading && !error) &&
                <form className="vertical-form" style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
                    <TextField label="Email" size="small" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} required />
                    <TextField label="Password" size="small" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} required />
                    <TextField label="Username" size="small" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} required />
                    <TextField type="number" label="User Level" size="small" variant="outlined" value={level} onChange={e => setLevel(e.target.value)} required />
                    <TextField type="number" label="User Balance" size="small" variant="outlined" value={balance} onChange={e => setBalance(e.target.value)} required />

                    <ButtonWrapper className="btn-primary" type="submit">Submit</ButtonWrapper>
                </form>
            }

        </Paper>
    )
}

// =============================================================================
// METRICS
// =============================================================================
const UserMetrics = ({ data }) => {
    return (
        <Paper style={{ padding: '1em' }}>
            <h1 style={{ marginBottom: '1em' }}>User Metrics</h1>
            {
                data &&
                <div>
                    <p>Total Users: {data.length}</p>
                </div>
            }
        </Paper>
    )
}

// =============================================================================
// TABLE
// =============================================================================
const UserTable = ({ data, firebase }) => {

    const [rows, setRows] = React.useState([])


    React.useEffect(() => {
        if (!data) return
        let test = data.map((entry, index) => {
            return { ...entry, actions: <Action data={entry} index={index} firebase={firebase} /> }
        })

        setRows(test)
    }, [data])




    return (
        <Paper style={{ padding: '1em' }}>
            <h1 style={{ marginBottom: '1em' }}>User List</h1>

            {data && <SellerTable rows={rows} />}
        </Paper>
    )
}

const Action = ({ data, index, firebase }) => {
    console.log(data)

    // Modal State
    const [open, setOpen] = React.useState(false)

    // Input States
    const [email, setEmail] = React.useState(data.email)
    const [username, setUsername] = React.useState(data.username)
    const [level, setLevel] = React.useState(data.level)
    const [balance, setBalance] = React.useState(data.balance)

    // Submission States
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [done, setDone] = React.useState(false)

    // =========================================================================
    // FUNCTIONS
    // =========================================================================
    let handleClick = () => {
        setOpen(true)
    }

    let handleClose = () => { setOpen(false); setDone(false) }


    // Edit functions
    const editUser = () => {
        setLoading(true)

        firebase.firestore().collection("seller_users").doc(data.id).set({
            balance: balance,
            email: email,
            level: level,
            username: username
        })
            .then(() => {
                console.log('success')
                setSuccess(true)
                setLoading(false)
                setDone(true)
            })
            .catch(error => {
                console.log("error")
                setError(true)
                setLoading(false)
                setErrorMessage(error)
                setDone(true)
            })
    }

    const disableUser = () => { }
    const deleteUser = () => { }

    // =========================================================================
    // STYLES
    // =========================================================================
    const styles = {
        input: {
            margin: '1em 0',
            width: '300px'
        },
        button: {
            margin: ".5em 0"
        }
    }

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                {
                    open &&
                    <Paper style={{ padding: '2em', display: 'flex', flexDirection: 'row' }}>
                        {
                            error &&
                            <div>
                                <h1>Error</h1>
                                <p>{errorMessage}</p>
                            </div>
                        }

                        {
                            success &&
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h1 style={{ textAlign: 'center', color: 'green', fontSize: "1.5rem" }}>Success!</h1>
                                <Button className="btn-primary" onClick={handleClose}>Close</Button>
                            </div>
                        }

                        {
                            !done &&
                            <div>
                                <div style={{ fontWeight: 'bold', display: 'flex', flexDirection: 'column', padding: '0 1em' }}>

                                    <h1>Edit User</h1>


                                    <TextField type="text" label="Username" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} />

                                    <TextField type="number" label="Level" variant="outlined" value={level} onChange={e => setLevel(e.target.value)} style={styles.input} />

                                    <TextField type="number" label="Balance" variant="outlined" value={balance} onChange={e => setBalance(e.target.value)} style={styles.input} />

                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h1>Actions</h1>
                                    <Button style={styles.button} className="btn-primary" type="submit" onClick={editUser}>Apply Changes</Button>
                                    {/* <Button style={styles.button} className="btn-primary" type="submit" onClick={disableUser}>Disable User</Button>
                            <Button style={styles.button} className="btn-secondary" type="submit" onClick={deleteUser}>Delete User</Button> */}
                                </div>
                            </div>
                        }


                    </Paper>
                }

            </Modal>
            <Button className="btn-primary" onClick={handleClick}>Edit</Button>
        </>
    )
}

export default MassUpload