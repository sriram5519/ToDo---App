import React, { useState, useEffect } from 'react';

//route
import { Link } from 'react-router-dom';

//graphql
import { useMutation } from '@apollo/react-hooks';

//queries
import { ADD_USER } from '../graphql/queries';

//mui
import { Paper, Button, TextField, Typography, Dialog, DialogActions, DialogContent, CircularProgress } from '@material-ui/core';

//mui/styles
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles( (theme) => ({
    root: {
        position: 'relative',
        padding: 30,
        width: '30%',
        left: '30%',
        marginTop: 200,
    },

    form: {
        margin: 20,
    },

    text: {
        marginTop: 30,
        width: '95%'
    },

    button: {
        position: 'relative',
        left: '40%'
    },
    title: {
        textAlign: 'center'
    },
    errorText: {
        color: theme.palette.alert.main
    }
}));

const Register = (props) => {
    const classes = useStyles();

    const [registerUser, { data, error, loading }] = useMutation(ADD_USER);

    const [state, setState] = useState();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(data && data.addUser.status === 'SUCCESS'){
            setOpen(true);
        }
    }, [data]);

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = () => {
        console.log(state);
        registerUser({
            variables: {
                user_name: state.user_name,
                password: state.password
            }
        });
    }

    const handleRedirect = () => {
        window.location.pathname = '/login';
    }

    return (
        <div>
            <Paper className={classes.root}>
                <div className={classes.title}>
                    <Typography variant='h3' color='primary'>
                        Register
                    </Typography>
                </div>
                <div className={classes.form}>
                    <TextField variant='outlined' color='primary' label='Username' placeholder="Enter Username" onChange={handleChange} name="user_name" 
                        className={classes.text}
                    /><br/>
                    <TextField variant='outlined' color='primary' label='Password' type='password' placeholder="Enter Password" onChange={handleChange} 
                        name='password' className={classes.text}
                    /><br/><br/>
                    {
                        error && (
                            <Typography variant='subtitle1' className={classes.errorText}>
                                {error}
                            </Typography>
                        )
                    }
                    <Button variant='contained' color='primary' onClick={handleSubmit} className={classes.button} disabled={loading}>
                        Register
                        {
                            loading && (
                                <CircularProgress size={30} color='primary' />
                            )
                        }
                    </Button>
                </div>
                <br/><br/>
                <Typography variant='body1'>
                    If you have registered already, Click <Link to='/login'>here</Link> to login
                </Typography>
            </Paper>
            <Dialog open={open}>
                <DialogContent>
                    You have registered successfully
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={handleRedirect}>
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Register;