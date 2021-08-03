import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router';
import { signInRequest } from '../data/requests';
import LockOutlined from '@material-ui/icons/LockOutlined';

export default function SignIn() {

    const history = useHistory()

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        console.log({
            email: data.get('username'),
            password: data.get('password'),
        });

        const user = await signInRequest(data.get('username'), data.get('password'))
        history.push("/chats")
        window.location.reload(true)
    };

    return (
        <Container component="main" maxWidth="xs" >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: "100vh"
                }}
            >

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, margin: "auto", textAlign: "center" }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main', margin: "10px auto" }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5" marginBottom="20px" >
                        Sign in
                    </Typography>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Box href="#" variant="body2" textAlign="right">
                        <Link onClick={() => { history.push("/signUp") }}>Don't have an account? Sign Up</Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}