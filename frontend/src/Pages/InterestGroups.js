import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './InterestGroups.css';

const InterestGroupCard = ({ group, userIsMember, onJoinLeave, isLoading }) => {
  return (
    <div className="group-card">
      <div className="group-header">
        <h3>{group.name}</h3>
        <span className="member-count">{group.memberCount} members</span>
      </div>
      <p className="group-description">{group.description}</p>
      <div className="group-topics">
        {group.topics.map((topic, index) => (
          <span key={index} className="topic-tag">
            {topic}
          </span>
        ))}
      </div>
      <button 
        className={`group-action-btn ${userIsMember ? 'leave' : 'join'}`}
        onClick={() => onJoinLeave(group.id, !userIsMember)}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : userIsMember ? 'Leave Group' : 'Join Group'}
      </button>
    </div>
  );
};

const InterestGroupsList = ({ groups, userGroups, onJoinLeave, isLoading }) => {
  return (
    <div className="groups-grid">
      {groups.map(group => (
        <InterestGroupCard
          key={group.id}
          group={group}
          userIsMember={userGroups.includes(group.id)}
          onJoinLeave={onJoinLeave}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    topics: []
  });
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(groupData);
    onClose();
  };

  const addTopic = () => {
    if (topic.trim()) {
      setGroupData(prev => ({
        ...prev,
        topics: [...prev.topics, topic.trim()]
      }));
      setTopic('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Interest Group</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Group Name"
            value={groupData.name}
            onChange={e => setGroupData({...groupData, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Group Description"
            value={groupData.description}
            onChange={e => setGroupData({...groupData, description: e.target.value})}
            required
          />
          <div className="topics-input">
            <input
              type="text"
              placeholder="Add topics"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
            <button type="button" onClick={addTopic}>Add Topic</button>
          </div>
          <div className="topics-list">
            {groupData.topics.map((t, i) => (
              <span key={i} className="topic-tag">
                {t}
                <button 
                  onClick={() => setGroupData(prev => ({
                    ...prev,
                    topics: prev.topics.filter((_, index) => index !== i)
                  }))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="modal-actions">
            <button type="submit">Create Group</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InterestGroups = () => {
  const { userId } = useParams();
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGroups();
    fetchUserGroups();
  }, [userId]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/interest-groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}/interest-groups`);
      setUserGroups(response.data.map(group => group.id));
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const handleJoinLeave = async (groupId, isJoining) => {
    setIsLoading(true);
    try {
      if (isJoining) {
        await axios.post(`http://localhost:8080/api/interest-groups/${groupId}/join/${userId}`);
        setUserGroups(prev => [...prev, groupId]);
      } else {
        await axios.post(`http://localhost:8080/api/interest-groups/${groupId}/leave/${userId}`);
        setUserGroups(prev => prev.filter(id => id !== groupId));
      }
    } catch (error) {
      console.error('Error updating group membership:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      await axios.post('http://localhost:8080/api/interest-groups', {
        ...groupData,
        creatorId: userId
      });
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="interest-groups-container">
      <div className="groups-header">
        <h1>Interest Groups</h1>
        <button 
          className="create-group-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Group
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <InterestGroupsList
        groups={filteredGroups}
        userGroups={userGroups}
        onJoinLeave={handleJoinLeave}
        isLoading={isLoading}
      />

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  );
};

export default InterestGroups;