import { useState } from 'react';
import {
    Box,
    Paper,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Divider
} from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline, LockOutlined } from '@mui/icons-material';
import { actualizarPasswordUserServicioWeb, getLogin } from '../services/Service_Api_Login';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePassword = ({ usuario, setUsuario }) => {
   
    
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showPassConfirm, setShowPassConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate();

    const updatePassword = async () =>{
        const respuesta = await actualizarPasswordUserServicioWeb({userName: usuario.User, password: password});
            console.log("first", respuesta)
        setUsuario(respuesta);
    }
   

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100dvh',
                width: '100%',
                display: 'grid',
                placeItems: 'center',
                p: 2,
                background:
                    'radial-gradient(1200px 600px at 10% 10%, rgba(25,118,210,0.0025), transparent), radial-gradient(1200px 600px at 90% 90%, rgba(156,39,176,0.04), transparent)',

            }}
        >

            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 350,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 5,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow:
                        '0 10px 30px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    color: 'black',
                    background:
                        'radial-gradient(1200px 600px at 10% 10%, rgba(113, 159, 206, 0.5), transparent), radial-gradient(1200px 600px at 90% 90%, rgba(156,39,176,0.04), transparent)',

                }}>
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                            'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
                    }}
                >
                   
                </Box>

                <Divider />

                <CardContent sx={{ pl: 4, pr: 4, pb: 4 }}>
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{ textAlign: 'center', letterSpacing: 0.5, mb: 0.5 }}
                    >
                        CAMBIAR CONTRASEÑA
                    </Typography>

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                          <TextField
                            label="NUEVA CONTRASEÑA"
                            placeholder="••••••••"
                            fullWidth
                            variant='standard'
                            required
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="small"
                            margin="normal"
                            sx={{
                                '& .MuiInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    borderRadius: '8px',
                                    padding: '4px 10px',
                                },

                                '& input': {
                                    backgroundColor: 'transparent !important',
                                },

                                '& input:-webkit-autofill': {
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: '#000',
                                    caretColor: '#000',
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined fontSize="small" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    fontSize: "0.8rem",
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="mostrar/ocultar contraseña"
                                            onClick={() => setShowPass((s) => !s)}
                                            edge="end"
                                            size="small"
                                            tabIndex={-1}
                                        >
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                sx: { fontSize: "0.75rem", color: "black" },
                            }}
                        />

                        <TextField
                            label="CONFIRMAR CONTRASEÑA"
                            placeholder="••••••••"
                            fullWidth
                            variant='standard'
                            required
                            type={showPassConfirm ? "text" : "password"}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            size="small"
                            margin="normal"
                            sx={{
                                '& .MuiInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    borderRadius: '8px',
                                    padding: '4px 10px',
                                },

                                '& input': {
                                    backgroundColor: 'transparent !important',
                                },

                                '& input:-webkit-autofill': {
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: '#000',
                                    caretColor: '#000',
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined fontSize="small" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    fontSize: "0.8rem",
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="mostrar/ocultar contraseña"
                                            onClick={() => setShowPassConfirm((s) => !s)}
                                            edge="end"
                                            size="small"
                                            tabIndex={-1}
                                        >
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                sx: { fontSize: "0.75rem", color: "black" },
                            }}
                        />


                        <Button
                            variant="contained"
                            fullWidth
                            size='small'
                            disabled={password !== passwordConfirm}
                            onClick={updatePassword}
                            sx={{
                                mt: 1,
                                py: 1.1,
                                fontWeight: 700,
                                letterSpacing: 0.4,
                                borderRadius: 2,
                                textTransform: 'none',
                                color: 'white',
                                height: 30
                            }}
                        >
                            {isLoading ? 'Ingresando…' : 'ACTUALIZAR'}
                        </Button>

                        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
                            <Typography variant='body1' >Version 2.0</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Paper>

            <ToastContainer />
        </Box>
    );
};

export default UpdatePassword;
