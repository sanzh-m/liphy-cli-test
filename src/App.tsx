import React, {useState} from 'react';
import './App.css';
import {Button, CircularProgress, createStyles, Grid, makeStyles, Snackbar, TextField, Theme} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import clsx from "clsx";
import axios from "axios";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: 'white'
        },
        underline: {
            "&:not(.Mui-disabled):hover:before": {
                borderBottom: '2px solid rgba(255, 255, 255, 1)',
            },
            "&:before": {
                borderBottom: '1px solid rgba(255, 255, 255, .8)',
            }
        },
        container: {
            padding: theme.spacing(2)
        },
        wrapper: {
            position: 'relative',
        },
        buttonProgress: {
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    }),
);

function App() {
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>();
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const classes = useStyles();

    const sendLoginRequest = async (name: string) => {
        const API = 'http://localhost:3100/api/login';
        return axios.post(API, {name: name})
            .then(response => response.data)
            .then(responseJson => {
                return Promise.resolve(responseJson.success);
            })
            .catch(error => {
                const result = error.message;
                return Promise.reject(result);
            });
    }

    const handleClick = async () => {
        if (!loading) {
            setShowSuccess(false);
            setLoading(true);
            const result = await sendLoginRequest(input);
            setLoading(false);
            setSuccess(result);
            setShowSuccess(true);
        }
    }

    return (
        <div className="App">
            <header className={clsx("App-header", classes.container)}>
                <Grid container spacing={2} direction={'column'}>
                    <Grid item>
                        <TextField
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                            InputProps={{
                                classes: {
                                    root: classes.root,
                                    underline: classes.underline
                                }
                            }}
                        />
                    </Grid>
                    <Grid item className={classes.wrapper}>
                        <Button onClick={handleClick} color={'primary'} variant={'contained'}>
                            Log In
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                    </Grid>
                    <Snackbar open={showSuccess} autoHideDuration={1000} onClose={() => setShowSuccess(false)}>
                        <MuiAlert onClose={() => setShowSuccess(false)} severity={success ? "success" : "error"}
                                  elevation={6} variant="filled">
                            {success ? "Success" : "Failure"}
                        </MuiAlert>
                    </Snackbar>
                </Grid>
            </header>
        </div>
    );
}

export default App;
