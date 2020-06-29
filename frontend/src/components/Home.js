import React, { useContext } from 'react';

//context
import { AuthContext } from '../context';

//graphql
import { useQuery } from '@apollo/react-hooks';

//queries
import { GET_USER_TASKS } from '../graphql/queries';

//components
import Task from './Task';

//mui
import { Paper, CircularProgress, Grid, Typography, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles( (theme) => ({
    READY: {
        color: '#B60717',
        marginRight: 5
    },
    ON_PROGRESS: {
        color: '#F1DC05',
        marginRight: 5,
    },
    COMPLETED: {
        color: '#05AA0D',
        marginRight: 5
    },

    head: {
        display: 'flex'
    },

    root: {
        margin: 10,
        marginTop: 80,
    },

    taskList: {
        padding: 20,
        height: '85vh',
        boxShadow: '2px 2px 2px 2px rgba(0, 0, 0, 0.5)',
        overflowY: 'auto'
    },

    task: {
        display: 'flex',
        marginTop: 15,
        flexWrap: 'wrap'
    }
}));

const Home = (props) => {
    const classes = useStyles();

    const { user } = useContext(AuthContext);

    const { loading, data } = useQuery(GET_USER_TASKS);

    if(!user.authenticated){
        window.location.pathname = '/login';
    }

    return (
        <div className={classes.root}>
            {
                loading ? (
                    <CircularProgress size={50} color='primary' />
                ) : (
                    <div>
                        <Grid container spacing={3}>
                            {
                                ["READY", "ON PROGRESS", "COMPLETED"].map( (status, index) => {
                                    return (
                                        <Grid item xs={4} key={index}>
                                            <Paper className={classes.taskList}>
                                                <div className={classes.head}>
                                                    <Typography variant='h6' className={status === 'ON PROGRESS' ? classes.ON_PROGRESS : classes[status]}>
                                                        {status}
                                                    </Typography>
                                                    <Chip color='primary' variant='outlined'
                                                        label={data.getUser.tasks ? data.getUser.tasks.filter( (t) => t.status === status).length : "0"}
                                                    />
                                                </div>
                                                
                                                <div className={classes.task}>
                                                    {
                                                        data.getUser.tasks.filter( (t) => t.status === status).map( (t, index) => {
                                                            return (
                                                                <Task key={index} task={t} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </Paper>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </div>
                )
            }
        </div>
    )
}

export default Home;