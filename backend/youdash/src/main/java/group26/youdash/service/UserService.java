package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;

import group26.youdash.model.User;
import group26.youdash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicInteger;

@Service // Marks this class as a service component in the Spring framework
/**
 * UserService implements UserRepository for user-related operations.
 * Author: Abdul Wajid Arikattayil
 */
public class UserService implements UserRepository {

    @Autowired // Automatically injects an instance of DynamoDBMapper
    private DynamoDBMapper dynamoDBMapper;


    // Generates unique IDs across all users
    private static final AtomicInteger userIdCounter = new AtomicInteger(1);

    /**
     * Save a user to DynamoDB.
     * @param user The user object to save.
     * @return The saved user object.
     */
    @Override
    public User save(User user) {
        // Set a unique ID for the user
        user.setId(userIdCounter.getAndIncrement());

        dynamoDBMapper.save(user); // Save the user to the DynamoDB table
        return user; // Return the saved user object
    }

    /**
     * Find a user by their ID in DynamoDB.
     * @param id The ID of the user to find.
     * @return The user object if found, otherwise null.
     */
    @Override
    public User findById(int id) {
        return dynamoDBMapper.load(User.class, id); // Load the user by ID
    }

    /**
     * Delete a user by their ID in DynamoDB.
     * @param id The ID of the user to delete.
     */
    @Override
    public void delete(int id) {
        User user = dynamoDBMapper.load(User.class, id); // Load the user by ID
        if (user != null) { // If the user exists
            dynamoDBMapper.delete(user); // Delete the user
        }
    }

    /**
     * Find user by username in DynamoDB.
     * @param username The username to search for.
     * @return The User object if found, null if not.
     */
    public User findByUsername(String username) {
        // Create a scan expression to search for the user by username
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        PaginatedScanList<User> scanResult = dynamoDBMapper.scan(User.class, scanExpression);

        // Search through the result for the user with the matching username
        for (User user : scanResult) {
            if (user.getUsername().equals(username)) {
                return user; // Return user if found
            }
        }
        return null; // Return null if no user is found
    }
}