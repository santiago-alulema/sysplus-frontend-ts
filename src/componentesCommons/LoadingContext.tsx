import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import logo from '@/assets/images/LogoOriginal.png';

interface LoadingContextType {
    showLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType>({
    showLoading: false,
    startLoading: () => { },
    stopLoading: () => { },
});

interface LoadingContextProviderProps {
    children: ReactNode;
}

export const LoadingContextProvider: React.FC<LoadingContextProviderProps> = ({ children }) => {
    const [showLoading, setShowLoading] = useState(false);

    const startLoading = () => {
        setShowLoading(true)
    };

    const stopLoading = () => setShowLoading(false);

    return (
        <LoadingContext.Provider value={{ showLoading, startLoading, stopLoading }}>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }}
                open={showLoading}
            >
                <Box sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <CircularProgress
                        thickness={4}
                        size={120}
                        color="inherit"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    />

                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'left',
                        boxShadow: '0 0 8px rgba(0,0,0,0.2)',
                    }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="logo"
                            sx={{
                                width: '80%',
                                height: '80%',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                </Box>
            </Backdrop>
            {children}
        </LoadingContext.Provider >
    );
};
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading debe usarse dentro de un LoadingContextProvider');
    }
    return context;
};