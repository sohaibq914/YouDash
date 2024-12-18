package group26.youdash.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;

import group26.youdash.classes.Messages;
import group26.youdash.classes.MessagesListConverter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@DynamoDBTable(tableName = "Groups")
public class Groups {
    private String groupId;
    private String groupName;
    // managers is int because users are ints in our user table e.g. user 12345
    private List<Integer> managers;
    private List<Integer> users;
    private List<Integer> requests;
    private List<Integer> invitations;
    private List<Messages> messages;
    private String groupDescription;
    private String profilePictureKey;
    private List<Announcement> announcements = new ArrayList<>();

    public Groups(String groupId, String groupName, List<Integer> managers, List<Integer> users,
                  List<Messages> messages, String groupDescription, List<Integer> invitations, List<Integer> requests) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.managers = managers;
        this.users = users;
        this.messages = messages;
        this.groupDescription = groupDescription;
        this.requests = requests;
        this.invitations = invitations;
    }

    public Groups() {
    }

    // Partition key
    @DynamoDBHashKey(attributeName = "group_id")
    @DynamoDBAutoGeneratedKey
    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    @DynamoDBAttribute(attributeName = "group_name")
    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    @DynamoDBAttribute(attributeName = "manager_list")
    public List<Integer> getManagers() {
        return managers;
    }

    public void setManagers(List<Integer> managers) {
        this.managers = managers;
    }

    @DynamoDBAttribute(attributeName = "messages")
    public List<Messages> getMessages() {
        return messages;
    }

    public void setMessages(List<Messages> messages) {
        this.messages = messages;
    }

    @DynamoDBAttribute(attributeName = "users")
    public List<Integer> getUsers() {
        return users;
    }

    public void setUsers(List<Integer> users) {
        this.users = users;
    }


    @DynamoDBAttribute(attributeName = "requests")
    public List<Integer> getRequests() {
        return requests;
    }

    public void setRequests(List<Integer> requests) {
        this.requests = requests;
    }

    @DynamoDBAttribute(attributeName = "invitations")
    public List<Integer> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Integer> invitations) {
        this.invitations = invitations;
    }

    @DynamoDBAttribute(attributeName = "group_description")
    public String getGroupDescription() {
        return groupDescription;
    }

    public void setGroupDescription(String groupDescription) {
        this.groupDescription = groupDescription;
    }

    @DynamoDBAttribute(attributeName = "profilePictureKey")
    public String getProfilePictureKey() {
        return profilePictureKey;
    }

    public void setProfilePictureKey(String profilePictureKey) {
        this.profilePictureKey = profilePictureKey;
    }

    @DynamoDBAttribute(attributeName = "announcements")
    public List<Announcement> getAnnouncements() {
        return announcements;
    }

    public void setAnnouncements(List<Announcement> announcements) {
        this.announcements = announcements;
    }


}
