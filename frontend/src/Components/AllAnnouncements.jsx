import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AllAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [groups, setGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/groups/${userId}/view`);
            setGroups(response.data);
            await fetchAllAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const fetchAllAnnouncements = async (userGroups) => {
        try {
            const allAnnouncements = [];
            for (const group of userGroups) {
                const response = await axios.get(
                    `http://localhost:8080/groups/announcements/${group.groupId}`
                );
                const groupAnnouncements = response.data.map(announcement => ({
                    ...announcement,
                    groupName: group.groupName,
                    groupId: group.groupId
                }));
                allAnnouncements.push(...groupAnnouncements);
            }
            // Sort by timestamp, newest first
            allAnnouncements.sort((a, b) => b.timestamp - a.timestamp);
            setAnnouncements(allAnnouncements);
            setFilteredAnnouncements(allAnnouncements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    useEffect(() => {
        const filtered = announcements.filter(announcement =>
            announcement.groupName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAnnouncements(filtered);
    }, [searchTerm, announcements]);

    const getAnnouncementCount = (groupId) => {
        return announcements.filter(a => a.groupId === groupId).length;
    };

    return (
        <div className="container" style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>All Group Announcements</h2>
            
            {/* Search Bar */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by group name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
            </div>

            {/* Group Announcement Counts */}
            <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {groups.map(group => (
                    <div 
                        key={group.groupId}
                        style={{ 
                            padding: "8px 16px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                            fontSize: "14px"
                        }}
                    >
                        {group.groupName}: {getAnnouncementCount(group.groupId)} announcements
                    </div>
                ))}
            </div>

            {/* Announcements List */}
            <div>
                {filteredAnnouncements.map((announcement, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            marginBottom: "20px", 
                            padding: "15px", 
                            border: "1px solid #ddd", 
                            borderRadius: "5px" 
                        }}
                    >
                        <div style={{ 
                            backgroundColor: "#007bff", 
                            color: "white", 
                            padding: "4px 8px", 
                            borderRadius: "4px", 
                            display: "inline-block", 
                            marginBottom: "10px",
                            fontSize: "14px"
                        }}>
                            {announcement.groupName}
                        </div>
                        <h4 style={{ margin: "10px 0" }}>{announcement.title}</h4>
                        <p style={{ margin: "10px 0" }}>{announcement.message}</p>
                        <small style={{ color: "#666" }}>
                            Posted on: {new Date(announcement.timestamp).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllAnnouncements;