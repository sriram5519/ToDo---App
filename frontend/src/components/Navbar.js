import React, { useContext, useState } from 'react';

import { AuthContext } from '../context';

//components
import AddTask from './AddTask';

//MUI
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';

//MUI Icons
import { ExitToApp, Add } from '@material-ui/icons';

const useStyles = makeStyles( (theme) => ({
    buttons: {
        display: 'flex',
        flexGrow: 1,
        width: '50vh',
    },

    addButton: {
        position: 'relative',
        left: '40%',
    },

    loginButton: {
        position: 'relative',
        left: '90%',
    }
}));

const NavBar = (props) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const  { user: { authenticated }, setUser } = useContext(AuthContext);

    const addTask = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleLogout = () => {
        setUser({
            user_name: "",
            user_id: "",
            authenticated: false
        });
        window.localStorage.removeItem('access_token');
    }
    
    return (
        <AppBar>
            <Toolbar className='nav-container'>
                <Typography variant='h4' color='inherit'>
                    <strong>
                        Task Board
                    </strong>
                </Typography>
                {
                    authenticated && (
                        <div className={classes.buttons}>
                            <Tooltip title="Add Task">
                                <IconButton color='inherit' className={classes.addButton} onClick={addTask}>
                                    <Add fontSize="large" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Logout">
                                <IconButton  color='inherit' className={classes.loginButton} onClick={handleLogout}>
                                    <ExitToApp fontSize='large' />
                                </IconButton>
                            </Tooltip>
                        </div>  
                    ) 
                }
            </Toolbar>
            <AddTask open={open} handleClose={handleClose} />
        </AppBar>
    );
}

export default NavBar;