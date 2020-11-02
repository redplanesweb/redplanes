import Router from 'next/router'

const Provider = ({ firebase, children, state }) => {

    // console.log(state.seller)

    return (
        <h1>
            {
                state?.seller?.loggedIn ?
                    children :
                    <div>
                        <p style={{ color: 'white' }}>Not Logged In.</p>
                    </div>
            }
        </h1>
    )
}


export default Provider