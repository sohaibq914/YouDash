package group26.youdash.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import group26.youdash.classes.Goal;
import java.util.List;

/**
 * User represents a user in the system, mapping to the DynamoDB "Users" table.
 * It contains user information such as ID, name, email, and more.
 *
 * Author: Abdul Wajid Arikattayil
 */
@DynamoDBTable(tableName = "Users") // Specifies that this class maps to the DynamoDB "Users" table
public class User {

    // Fields for storing user information
    private int id; // User ID, serves as the primary key
    private String name; // User's name
    private String email; // User's email address
    private String username; // User's username
    private String password; // User's password
    private String phoneNumber; // User's phone number
    private boolean registered; // Indicates if the user is registered
    private List<Goal> goals; // List of user's goals (custom object 'Goal')
    private List<String> blocked; // List of blocked categories
    private List<String> availableCategories; // List of available categories

    /**
     * Get the user's ID (DynamoDB Hash Key).
     *
     * @return The ID of the user.
     */
    @DynamoDBHashKey // Marks this field as the primary key for DynamoDB
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id; // Set the user's ID
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
        this.username = username; // Set the user's username
    }

    /**
     * Get the user's password.
     *
     * @return The password of the user.
     */
    @DynamoDBAttribute
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password; // Set the user's password
    }

    /**
     * Get the user's phone number.
     *
     * @return The phone number of the user.
     */
    @DynamoDBAttribute
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber; // Set the user's phone number
    }

    /**
     * Check if the user is registered.
     *
     * @return True if the user is registered, false otherwise.
     */
    @DynamoDBAttribute
    public boolean isRegistered() {
        return registered;
    }

    public void setRegistered(boolean registered) {
        this.registered = registered; // Set the registration status of the user
    }

    /**
     * Get the user's goals.
     *
     * @return A list of the user's goals.
     */
    @DynamoDBAttribute
    public List<Goal> getGoals() {
        return goals;
    }

    public void setGoals(List<Goal> goals) {
        this.goals = goals; // Set the user's goals
    }

    /**
     * Get the list of blocked categories.
     *
     * @return A list of blocked categories for the user.
     */
    @DynamoDBAttribute
    public List<String> getBlocked() {
        return blocked;
    }

    public void setBlocked(List<String> blocked) {
        this.blocked = blocked; // Set the list of blocked categories
    }

    /**
     * Get the list of available categories for the user.
     *
     * @return A list of categories available to the user.
     */
    @DynamoDBAttribute
    public List<String> getAvailableCategories() {
        return availableCategories;
    }

    public void setAvailableCategories(List<String> availableCategories) {
        this.availableCategories = availableCategories; // Set the list of available categories
    }
}
