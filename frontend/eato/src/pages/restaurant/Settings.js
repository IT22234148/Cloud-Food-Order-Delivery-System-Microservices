import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Avatar,
    CircularProgress,
    Snackbar,
    Alert,
    Divider
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Save as SaveIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

const Settings = () => {
    const { currentUser, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fileInputRef = useRef(null);

    // Initialize form with current user data
    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || ''
            });

            if (currentUser.profilePicture) {
                setPreviewUrl(currentUser.profilePicture);
            }
        }
    }, [currentUser]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger file input click
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user profile with new data
            const updatedProfile = {
                ...formData,
                profilePicture: previewUrl 
            };


            setSnackbar({
                open: true,
                message: 'Profile updated successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update profile. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ bgcolor: '#FFE0B2', minHeight: '100vh', py: 4, px: 3, borderRadius: '8px' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#333' }}>
                Your Profile Information
            </Typography>

            <Paper elevation={3} sx={{ p: 4, mt: 3, maxWidth: 600, mx: 'auto', borderRadius: '8px' }}>
                

                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                helperText="Email cannot be changed."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Notification Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings;