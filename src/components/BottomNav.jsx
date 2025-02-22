import * as React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router';

const BottomNav = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    return (
        <>
            <BottomNavigation
                sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#f1faee',
                    zIndex: 1000,
                }}
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    const paths = ["Home", "Map", "Account"]
                    navigate(`/${paths[newValue]}`)
                }}
            >
                <BottomNavigationAction labels="Home" icon={<HomeIcon />} />
                <BottomNavigationAction labels="GPS" icon={<PinDropIcon />} />
                <BottomNavigationAction labels="Profile" icon={<AccountBoxIcon />} />
            </BottomNavigation>
        </>
    )
}

export default BottomNav
