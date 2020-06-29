import React, { useState, useContext, useEffect } from 'react';

import { AuthContext } from '../context';
//route
import { Link } from 'react-router-dom';

//graphql
import { useMutation } from '@apollo/react-hooks';

//queries
import { LOGIN_USER } from '../graphql/queries';

//mui
import { Paper, Button, TextField, Typography, CircularProgress } from '@material-ui/core';

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
        color:theme.palette.alert.main,
    }
}));

const Login = (props) => {
    const classes = useStyles();

    const [loginUser, { data, loading }] = useMutation(LOGIN_USER, {
        onError: (err) => {
            setError(err.message.split(':')[1]);
        }
    });
    const { setUser } = useContext(AuthContext);

    const [state, setState] = useState();
    const [error, setError] = useState("");

    useEffect( () => {
        if(data){
            setUser({
                user_name: data.loginUser.user.user_name,
                user_id: data.loginUser.user.user_id,
                authenticated: true,
            });
    
            window.localStorage.setItem('access_token', data.loginUser.access_token);
            window.location.pathname = '/';
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
        loginUser({
            variables: {
                user_name: state.user_name,
                password: state.password
            },
        });
    }

    return (
        <Paper className={classes.root}>
            <div className={classes.title}>
                <Typography variant='h3' color='primary'>
                    Login
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
                    Login
                    {
                        loading && (
                            <CircularProgress size={30} color='primary' />
                        )
                    }
                </Button>
            </div>
            <br/><br/>
            <Typography variant='body1'>
                If you have not registered, Click <Link to='/register'>here</Link> to register
            </Typography>
        </Paper>
    )
}

export default Login;