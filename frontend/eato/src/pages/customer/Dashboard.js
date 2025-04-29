import React from 'react';
import { Typography, Box } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import FoodMenu from '../../components/customer/FoodMenu';
import CustomerLayout from '../../components/layouts/CustomerLayout';

const CustomerDashboard = () => {
    const { currentUser } = useAuth();

    return (
        <CustomerLayout>
            <Box sx={{
                mt: 2,
                mb: 4,
                bgcolor: '#FFE0B2',
                borderRadius: '8px',
                padding: 3 // Add some padding if needed so content isn't right against the rounded edges
            }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Your Favorite meals are a Click Away
                    </Typography>
                </Box>

                <FoodMenu />
            </Box>
        </CustomerLayout>
    );
};

export default CustomerDashboard;