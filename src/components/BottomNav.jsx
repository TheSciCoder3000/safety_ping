import * as React from 'react';
import Box from '@mui/material/Box';
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router';

const BottomNav = () => {
    const [value, setValue] = React.useState(0);
    const navigate= useNavigate();
    return (
        <div>
            <Box sx={{width: '100%', 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                backgroundColor: 'white',
                zIndex: 1000}}>
                <BottomNavigation 
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        navigate(`/${newValue}`)
                    }}
                >
                    <BottomNavigationAction labels="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction labels="GPS" icon={<PinDropIcon />} />
                    <BottomNavigationAction labels="Profile" icon={<AccountBoxIcon />} />
                </BottomNavigation>
            </Box>
        </div>
    )
}

export default BottomNav
