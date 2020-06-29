import React, { useState, useRef } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//graphql
import { useMutation, useQuery } from '@apollo/react-hooks';
import { UPDATE_TASK, GET_USER_TASKS, DELETE_TASK, UPLOAD_FILE, READ_FILE } from '../graphql/queries';

//components
import AddTask from './AddTask';

//mui
import { Card, CardHeader, CardContent, Typography, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

//mui/icons
import { Edit, Delete, CheckCircle, Image } from '@material-ui/icons';

const useStyles = makeStyles( (theme) => ({
    readyCard: {
        backgroundColor: '#FBE5DE',
        color: '#101010',
        width: '25vh',
        paddingTop: 4,
        height: '25vh',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: "#F53E03",
        margin: 4,
    },  

    progressCard: {
        backgroundColor: '#F7FD9B',
        color: '#101010',
        width: '25vh',
        paddingTop: 4,
        height: '25vh',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: "#FDF904",
        margin: 4,
    },

    completeCard: {
        backgroundColor: '#8FFC92',
        color: '#101010',
        width: '25vh',
        paddingTop: 4,
        height: '25vh',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: "#05A209",
        margin: 4,
    },

    header: {
        position: 'relative',
        height: '10%', 
    },

    content: {
        position: 'relative',
        height: '45%',
    },

    delete: {
        color: theme.palette.alert.main,
    }
}))

const Task = (props) => {
    const classes = useStyles();

    const { task } = props;

    const [open, setOpen] = useState(false);

    const file = useRef();

    const updateCache = (cache, { data }) => {
        const cache_data = cache.readQuery({query: GET_USER_TASKS});

        let updatedData = [];
        cache_data.getUser.tasks.forEach( (d, index) => {
            if(d.task_id === data.updateTask.task_id){
                delete data.__typename;
                updatedData = [...updatedData, data]
            }
            updatedData = [...updatedData, d]
        });

        cache.writeQuery({
            query: GET_USER_TASKS,
            data: { 
                getUser: {
                    tasks: updatedData,
                }
            }
        });
    }

    const [updateTask] = useMutation(UPDATE_TASK, {
        update: updateCache,
    });

    const [deleteTask] = useMutation(DELETE_TASK, {
        refetchQueries: [{
            query: GET_USER_TASKS
        }]
    });

    const [uploadFile] = useMutation(UPLOAD_FILE, {
        onError: (err) => {
            console.log(err);
        },
        refetchQueries: [
            {
                query: READ_FILE,
                variables: {
                    filename: task.task_id
                }
            }
        ]
    });

    const { data }  = useQuery(READ_FILE, {
        variables: {
            filename: task.task_id
        }
    });

    dayjs.extend(relativeTime);

    const handleDelete = () => {
        deleteTask({
            variables: {
                task_id: task.task_id
            }
        });
    }

    const handleUpdate = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleUpdateTask = () => {
        let data = {
            task_title: task.task_title,
            status: task.status,
            description: task.description,
            task_id: task.task_id
        }
        
        const updateStatus = task.status === 'READY' ? "ON PROGRESS" : "COMPLETED";
        updateTask({
            variables: {
                task: {
                    ...data,
                    status: updateStatus
                }
            }
        })
    }

    const handleFile = (e) => {
        file.current.click();
    }
    
    const handleUpload = (e) => {
        uploadFile({
            variables: {
                file: e.target.files[0],
                filename: task.task_id
            }
        });
    }

    const getStyle = (status) => {
        switch(status){
            case 'READY':
                return classes.readyCard;

            case 'ON PROGRESS':
                return classes.progressCard;

            case 'COMPLETED':
                return classes.completeCard;
            
            default:
                return null;
        }
    }

    const controls = [
        {
            icon: <Delete className={classes.delete} />,
            name: 'Delete Task',
            method: handleDelete
        },
        {
            icon: <Edit color='primary' />,
            name: "Edit Task",
            method: handleUpdate
        },
        {
            icon: <CheckCircle color='primary' />,
            name: "Update Task",
            method: handleUpdateTask
        },
        {
            icon: <Image color='primary' />,
            name: 'Upload Background Image',
            method: handleFile,
        }
    ]

    return (
        <div>
            <Card className={getStyle(task.status)} style={data && data.readFile.url ? { background: `url(${data.readFile.url})`, color: '#ffffff' } : null}>
                <CardHeader title={<strong>{task.task_title}</strong>} 
                    subheader={<Typography variant='caption' color="inherit">{dayjs(task.created_at).fromNow()}</Typography> } className={classes.header}
                />
                <CardContent className={classes.content}>
                    <em>
                        {task.description}    
                    </em>
                </CardContent>
                <div>
                    {
                        controls.map( (con, index) => {
                            return (
                                <Tooltip title={con.name} key={index}>
                                    <IconButton onClick={con.method}>
                                        {con.icon}
                                    </IconButton>
                                </Tooltip>
                            )
                        })
                    }
                </div>
            </Card>
            <AddTask open={open} handleClose={handleClose} isUpdate={true} task={task} updateCache={updateCache} />
            <input type='file' onChange={handleUpload} hidden={true} ref={file} />
        </div>
    )
}

export default Task;