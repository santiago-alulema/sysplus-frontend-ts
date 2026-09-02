import { Box, Card, CardContent, CardHeader } from '@mui/material';
import React, { ReactNode, useEffect } from 'react';
import { LoadingContextProvider } from './LoadingContext';
import HeaderBasePage from './HeaderBasePage';

interface BasePageProps {
    routers?: any[]; 
    title?: string | null;
    showRequiredFieldLabel?: boolean;
    showBreadcrumbs?: boolean;
    showBackButton?: boolean;
    showLanguageSelector?: boolean;
    useAuxiliaryBackFunction?: boolean;
    auxiliaryBackFunction?: () => void;
    children: ReactNode;
}

const BasePage: React.FC<BasePageProps> = ({
    routers = [],
    title = null,
    showRequiredFieldLabel = false,
    showBreadcrumbs = true,
    showBackButton = true,
    showLanguageSelector = false,
    useAuxiliaryBackFunction = false,
    auxiliaryBackFunction = () => { },
    children,
}) => {
    const headerProps = {
        routers,
        title,
        showRequiredFieldLabel,
        showBreadcrumbs,
        showBackButton,
        showLanguageSelector,
        useAuxiliaryBackFunction,
        auxiliaryBackFunction,
    };

    useEffect(() => {
    }, [routers]);

    return (
        <LoadingContextProvider>
            <Box paddingInline={2}>
                <Card sx={{ px: '30px', py: '20px' }} elevation={5}>
                    <CardHeader component={() => <HeaderBasePage {...headerProps} />} />
                    <CardContent sx={{ mt: 1 }}>{children}</CardContent>
                </Card>
            </Box>
        </LoadingContextProvider>
    );
};

export default BasePage;
