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

    private List<Messages> messages;
    private String description;

    public Groups() {}
    // Partition key
    @DynamoDBHashKey(attributeName = "group_id")
    @DynamoDBAutoGeneratedKey
    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    @DynamoDBAttribute(attributeName = "group_description")
    public String getGroupDescription() {
        return description;
    }

    public void setGroupDescription(String description) {
        this.description = description;
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


}
