import React, { useState } from 'react';

//graphql
import { useMutation } from '@apollo/react-hooks';
import { ADD_TASK, GET_USER_TASKS, UPDATE_TASK } from '../graphql/queries';

//mui
import { TextField, DialogTitle, DialogContent, DialogActions, Dialog, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles( (theme) => ({
    errorText: {
        color: theme.palette.alert.main,
    }
}))

const AddTask = (props) => {
    const classes = useStyles();

    const { isUpdate } = props;

    const [state, setState] = useState({});

    const [addTask, { error }] = useMutation(ADD_TASK, {
        onError: (err) => {
            console.log(error);
        },
        onCompleted: () => {
            props.handleClose();
        },
        refetchQueries: [{
            query: GET_USER_TASKS
        }]
    });

    const [updateTask ] = useMutation(UPDATE_TASK, {
        update: props.updateCache,
        onCompleted: () => {
            props.handleClose();
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const handleAddTask = () => {
        console.log(state);

        addTask({variables:{
            ...state
        }});
    }

    const handleUpdateTask = () => {
        let updateData = {
            task_id: props.task.task_id,
            title: props.task_title,
            description: props.task.description,
            status: props.task.status,
            ...state,
        };

        delete updateData.__typename;

        updateTask({
            variables: {
                task: {
                    ...updateData
                }
            }
        });
    }

    return (
        <Dialog open={props.open} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography color='primary'>
                    { isUpdate ? "Update Task" : "Add Task" }
                </Typography>
            </DialogTitle>
            <DialogContent>
                <TextField variant='outlined' color='primary' onChange={handleChange} name="task_title" fullWidth label="Title"
                    placeholder="Enter Title" defaultValue={isUpdate ? props.task.task_title : null}
                /><br/><br/>
                <TextField variant='outlined' color='primary' onChange={handleChange} name="description" multiline rows={3} fullWidth 
                    label="Description" placeholder="Enter Task Description" defaultValue={isUpdate ? props.task.description : null}
                />
                {
                    error && (
                        <Typography variant='subtitle1' className={classes.errorText}>
                            {error.graphQLErrors[0].message}
                        </Typography>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' color='primary' onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant='contained' color='primary' onClick={isUpdate ? handleUpdateTask : handleAddTask}>
                    {isUpdate ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTask;