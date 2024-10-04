package group26.youdash.model;
import com.amazonaws.services.dynamodbv2.datamodeling.*;

import group26.youdash.classes.Goal;

import java.util.List;

@DynamoDBTable(tableName = "Users")
public class User {

    private int id;
    private String name;
    private String email;
    private String username;
    private String password;
    private String phoneNumber;
    private boolean registered;
    private List<Goal> goals;
    private List<String> blocked;
    private List<String> availableCategories;

    @DynamoDBHashKey
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    @DynamoDBAttribute
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @DynamoDBAttribute
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @DynamoDBAttribute
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    @DynamoDBAttribute
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @DynamoDBAttribute
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    @DynamoDBAttribute
    public boolean isRegistered() { return registered; }
    public void setRegistered(boolean registered) { this.registered = registered; }

    @DynamoDBAttribute
    public List<Goal> getGoals() { return goals; }
    public void setGoals(List<Goal> goals) { this.goals = goals; }

    @DynamoDBAttribute
    public List<String> getBlocked() { return blocked; }
    public void setBlocked(List<String> blocked) { this.blocked = blocked; }

    @DynamoDBAttribute
    public List<String> getAvailableCategories() { return availableCategories;}
    public void setAvailableCategories(List<String> availableCategories) {this.availableCategories = availableCategories;}
}


