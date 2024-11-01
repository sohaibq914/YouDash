import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Switch,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Alert,
} from '@mui/material';

const PrivacySettings = () => {
    const { userId } = useParams();
    const [isPrivate, setIsPrivate] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchPrivacySettings();
        fetchPendingRequests();
    }, [userId]);

    const fetchPrivacySettings = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
            setIsPrivate(response.data.isPrivate);
        } catch (error) {
            setError('Failed to fetch privacy settings');
            console.error('Error:', error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/privacy/${userId}/pending-requests`);
            setPendingRequests(response.data);
        } catch (error) {
            setError('Failed to fetch pending requests');
            console.error('Error:', error);
        }
    };

    const handlePrivacyToggle = async () => {
        try {
            await axios.post(`http://localhost:8080/api/privacy/${userId}/toggle?isPrivate=${!isPrivate}`);
            setIsPrivate(!isPrivate);
            setSuccess('Privacy settings updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError('Failed to update privacy settings');
            console.error('Error:', error);
        }
    };

    const handleFollowRequest = async (requesterId, accept) => {
        try {
            await axios.post(`http://localhost:8080/api/privacy/${userId}/handle-request`, {
                requesterId,
                accept
            });
            fetchPendingRequests();
            setSuccess(accept ? 'Follow request accepted' : 'Follow request rejected');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError('Failed to handle follow request');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mt-4">
            <Card>
                <CardHeader title="Privacy Settings" />
                <CardContent>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    
                    <div className="d-flex align-items-center mb-4">
                        <Typography variant="body1">Private Account</Typography>
                        <Switch
                            checked={isPrivate}
                            onChange={handlePrivacyToggle}
                            color="primary"
                        />
                    </div>

                    <Typography variant="h6" className="mb-3">
                        Pending Follow Requests
                    </Typography>

                    <List>
                        {pendingRequests.map((request) => (
                            <ListItem key={request.requesterId}>
                                <ListItemText 
                                    primary={request.requesterName}
                                    secondary={new Date(request.requestDate).toLocaleDateString()}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleFollowRequest(request.requesterId, true)}
                                    className="me-2"
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleFollowRequest(request.requesterId, false)}
                                >
                                    Reject
                                </Button>
                            </ListItem>
                        ))}
                        {pendingRequests.length === 0 && (
                            <ListItem>
                                <ListItemText primary="No pending follow requests" />
                            </ListItem>
                        )}
                    </List>
                </CardContent>
            </Card>
        </div>
    );
};

export default PrivacySettings;