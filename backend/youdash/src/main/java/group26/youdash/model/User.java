package group26.youdash.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import group26.youdash.classes.Goal;
import java.util.List;

@DynamoDBTable(tableName = "Users") // Specifies that this class maps to the DynamoDB "Users" table
public class User {

    // Fields for storing user information
    private int id;
    private String name;
    private String email;
    private String username;
    private String password;
    private String phoneNumber;
    private boolean registered; // Indicates if the user is registered
    private List<Goal> goals; // List of user's goals (custom object 'Goal')
    private List<String> blocked; // List of blocked categories
    private List<String> availableCategories; // List of available categories

    // Getter and setter methods for each field with appropriate DynamoDB annotations

    /**
     * Get the user's ID (DynamoDB Hash Key).
     * @return id The ID of the user.
     */
    @DynamoDBHashKey // Marks this field as the primary key for DynamoDB
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    /**
     * Get the user's name.
     * @return name The name of the user.
     */
    @DynamoDBAttribute // Marks this field as an attribute in the DynamoDB table
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    /**
     * Get the user's email.
     * @return email The email address of the user.
     */
    @DynamoDBAttribute
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    /**
     * Get the user's username.
     * @return username The username of the user.
     */
    @DynamoDBAttribute
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    /**
     * Get the user's password.
     * @return password The password of the user.
     */
    @DynamoDBAttribute
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    /**
     * Get the user's phone number.
     * @return phoneNumber The phone number of the user.
     */
    @DynamoDBAttribute
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    /**
     * Check if the user is registered.
     * @return registered True if the user is registered, false otherwise.
     */
    @DynamoDBAttribute
    public boolean isRegistered() { return registered; }
    public void setRegistered(boolean registered) { this.registered = registered; }

    /**
     * Get the user's goals.
     * @return goals A list of the user's goals.
     */
    @DynamoDBAttribute
    public List<Goal> getGoals() { return goals; }
    public void setGoals(List<Goal> goals) { this.goals = goals; }

    /**
     * Get the list of blocked categories.
     * @return blocked A list of blocked categories for the user.
     */
    @DynamoDBAttribute
    public List<String> getBlocked() { return blocked; }
    public void setBlocked(List<String> blocked) { this.blocked = blocked; }

    /**
     * Get the list of available categories for the user.
     * @return availableCategories A list of categories available to the user.
     */
    @DynamoDBAttribute
    public List<String> getAvailableCategories() { return availableCategories; }
    public void setAvailableCategories(List<String> availableCategories) { this.availableCategories = availableCategories; }
}
