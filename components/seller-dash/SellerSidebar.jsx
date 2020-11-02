// =============================================================================
// IMPORTS
// =============================================================================
import {
    Button,
    Paper,
    Container,
    Grid,
    Slider,
    TextField,
    Select,
    Checkbox,
    FormGroup,
    FormControlLabel,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';

const menuConfig = [
    { name: "Home", url: "/seller/home" },
    { name: "Purchased", url: "/seller/purchased" },
]

// =============================================================================
// RENDER
// =============================================================================
const Sidebar = ({ menuOpen }) => {
    return (
        <List component="nav" aria-label="secondary mailbox folders" style={{ display: menuOpen ? 'block' : 'none' }}>
            {
                menuConfig.map(entry => {
                    return (
                        <ListItemLink href={entry.url}>
                            <ListItemText primary={entry.name} />
                        </ListItemLink>
                    )
                })
            }
        </List>
    )
}


const ListItemLink = (props) => {
    return <ListItem button component="a" {...props} />;
}


export default Sidebar