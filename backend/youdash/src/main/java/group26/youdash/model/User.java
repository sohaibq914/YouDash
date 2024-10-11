package group26.youdash.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;

import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.classes.QualityGoal;

import java.util.List;

@DynamoDBTable(tableName = "Users")  // Specify the DynamoDB table name
public class User {

    private int id;
    private String name;
    private String email;
    private String username;
    private String password;
    private String phoneNumber;
    private boolean registered;
    //private List<Goal> goals;
    private List<WatchTimeGoal> wtgoals;
    private List<QualityGoal> qgoals;
    private List<String> blocked;
    private List<String> availableCategories;
    private String bio;  // Add the bio attribute here
    private String profilePicture; // New field for storing profile picture URL
    private boolean darkMode;
    private List<Integer> followers;  // New followers attribute to store a list of follower IDs
    private String profilePictureKey; // New field to store S3 key of profile picture



    private List<String> historyURLs;

    @DynamoDBHashKey
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Get the user's name.
     *
     * @return The name of the user.
     */
    @DynamoDBAttribute // Marks this field as an attribute in the DynamoDB table
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name; // Set the user's name
    }

    /**
     * Get the user's email.
     *
     * @return The email address of the user.
     */
    @DynamoDBAttribute
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email; // Set the user's email
    }

    /**
     * Get the user's username.
     *
     * @return The username of the user.
     */
    @DynamoDBAttribute
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    @DynamoDBAttribute
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Get the user's password.
     *
     * @return The password of the user.
     */
    @DynamoDBAttribute
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @DynamoDBAttribute
    public boolean isRegistered() {
        return registered;
    }
    public void setRegistered(boolean registered) {
        this.registered = registered;
    }


    //https://jspong.github.io/2021/07/19/AbstractDynamoAttributes.html
    /*@DynamoDBAttribute(attributeName = "goals")
    @DynamoDBTypeConverted(converter = GoalConverter.class)
    public List<Goal> getGoals() { return goals; }
    public void setGoals(List<Goal> goals) { this.goals = goals; }*/

    @DynamoDBAttribute(attributeName = "wtgoals")
    public List<WatchTimeGoal> getWtgoals() { return wtgoals; }
    public void setWtgoals(List<WatchTimeGoal> wtgoals) { this.wtgoals = wtgoals; }

    @DynamoDBAttribute(attributeName = "qgoals")
    public List<QualityGoal> getQgoals() { return qgoals; }
    public void setQgoals(List<QualityGoal> qgoals) { this.qgoals = qgoals; }

    @DynamoDBAttribute(attributeName = "blocked")
    public List<String> getBlocked() {
        return blocked;
    }
    public void setBlocked(List<String> blocked) {
        this.blocked = blocked;
    }

    // Add getter and setter for the new bio attribute
    @DynamoDBAttribute(attributeName = "bio")  // Map the bio field to a DynamoDB attribute
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }

    @DynamoDBAttribute(attributeName = "availableCategories")
    public List<String> getAvailableCategories() { return availableCategories;}
    public void setAvailableCategories(List<String> availableCategories) {this.availableCategories = availableCategories;}

    @DynamoDBAttribute(attributeName = "historyURLs")
    public List<String> getHistoryURLs() { return historyURLs; }
    public void setHistoryURLs(List<String> historyURLs) {this.historyURLs = historyURLs; }

    // New getter and setter for profile picture URL
    @DynamoDBAttribute(attributeName = "profilePicture")
    public String getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    @DynamoDBAttribute(attributeName = "darkMode")  // Map the new attribute to DynamoDB
    public boolean isDarkMode() {
        return darkMode;
    }

    public void setDarkMode(boolean darkMode) {
        this.darkMode = darkMode;
    }


    @DynamoDBAttribute(attributeName = "followers")  // Store followers as a list of user IDs
    public List<Integer> getFollowers() {
        return followers;
    }

    public void setFollowers(List<Integer> followers) {
        this.followers = followers;
    }


        // New attribute to store the S3 key of the profile picture
        @DynamoDBAttribute(attributeName = "profilePictureKey")
        public String getProfilePictureKey() {
            return profilePictureKey;
        }
    
        public void setProfilePictureKey(String profilePictureKey) {
            this.profilePictureKey = profilePictureKey;
        }
}
