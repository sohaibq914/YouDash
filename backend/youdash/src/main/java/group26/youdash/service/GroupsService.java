package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.model.Announcement;
import group26.youdash.model.Groups;
import group26.youdash.model.LeaderboardEntry;
import group26.youdash.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupsService {

    @Autowired
    public GroupsService(DynamoDBMapper dynamoDBMapper) {
        this.dynamoDBMapper = dynamoDBMapper;
    }

    @Autowired
    private FileStorageService fileStorageService; // Autowire the FileStorageServic

    @Autowired // Automatically injects an instance of DynamoDBMapper
    private DynamoDBMapper dynamoDBMapper;

    public List<Groups> getAllGroups() {
        // Use DynamoDBMapper to scan all users in the Users table
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        return dynamoDBMapper.scan(Groups.class, scanExpression);
    }

    public Groups save(Groups group) {
        // If new user (no ID set)
        if (group.getGroupId() == null || group.getGroupId().equals("")) {
            group.setGroupId(UUID.randomUUID().toString());
        } else {
            //System.out.println("Already UUID exists");
        }
        dynamoDBMapper.save(group);
        return group;
    }

    public String uploadProfilePicture(String groupId, MultipartFile file) throws IOException {
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        if (group == null)
            throw new NoSuchElementException("User not found");

        // Create a unique key for the profile picture using the userID
        String profilePictureKey = "group-" + groupId + "-profile-picture." + getExtension(file.getOriginalFilename());
        System.out.println(profilePictureKey);

        // Upload the file to S3 and get the URL
        String profilePictureUrl = fileStorageService.uploadFile(file, profilePictureKey);
        // Update user's profile picture key in the database
        group.setProfilePictureKey(profilePictureKey);
        dynamoDBMapper.save(group);

        return profilePictureUrl;
    }

    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public Groups addAnnouncement(String groupId, Integer userId, Announcement announcement) {
        Groups group = getGroupById(groupId);
        if (group.getAnnouncements() == null) {
            group.setAnnouncements(new ArrayList<>());
        }
        announcement.setUserId(userId);
        announcement.setTimestamp(System.currentTimeMillis());
        group.getAnnouncements().add(announcement);

        return save(group);
    }

    public List<Announcement> getAnnouncements(String groupId, Integer userId) {
        Groups group = getGroupById(groupId);
        if (group == null) {
            throw new NoSuchElementException("Group not found");
        }

        // Check if user is member of group
        if (!group.getUsers().contains(userId) && !group.getManagers().contains(userId)) {
            throw new IllegalStateException("User not authorized to view announcements");
        }

        return group.getAnnouncements() != null ? group.getAnnouncements() : new ArrayList<>();
    }

    public List<Announcement> getAnnouncements(String groupId) {
        Groups group = getGroupById(groupId);
        return group.getAnnouncements() != null ? group.getAnnouncements() : new ArrayList<>();
    }

    public Groups getGroupById(String groupId) {
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        if (group == null) {
            throw new NoSuchElementException("Group not found with ID: " + groupId);
        }
        return group;
    }

    public Groups deleteAnnouncement(String groupId, Integer userId, int announcementIndex) {
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        if (group == null) {
            throw new NoSuchElementException("Group not found");
        }

        if (!group.getManagers().contains(userId)) {
            throw new IllegalStateException("Only managers can delete announcements");
        }

        if (group.getAnnouncements() != null && announcementIndex < group.getAnnouncements().size()) {
            group.getAnnouncements().remove(announcementIndex);
            dynamoDBMapper.save(group);
        }

        return group;
    }

    public Groups updateAnnouncement(String groupId, Integer userId, int index, Announcement updatedAnnouncement) {
        Groups group = getGroupById(groupId);

        if (group.getAnnouncements() == null || index >= group.getAnnouncements().size()) {
            throw new IllegalArgumentException("Announcement not found");
        }

        updatedAnnouncement.setUserId(userId);
        group.getAnnouncements().set(index, updatedAnnouncement);

        return save(group);
    }

    



}
