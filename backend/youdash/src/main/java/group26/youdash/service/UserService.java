package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;

import group26.youdash.model.User;
import group26.youdash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // Marks this class as a service component in the Spring framework
public class UserService implements UserRepository {

    @Autowired // Automatically injects an instance of DynamoDBMapper to interact with DynamoDB
    private DynamoDBMapper dynamoDBMapper;

    /**
     * Save a user to DynamoDB.
     * @param user The user object to save.
     * @return The saved user object.
     */
    @Override
    public User save(User user) {
        dynamoDBMapper.save(user); // Use DynamoDBMapper to save the user to the DynamoDB table
        return user; // Return the saved user object
    }

    /**
     * Find a user by their ID in DynamoDB.
     * @param id The ID of the user to find.
     * @return The user object if found, otherwise null.
     */
    @Override
    public User findById(int id) {
        return dynamoDBMapper.load(User.class, id); // Use DynamoDBMapper to load the user by ID
    }

    /**
     * Delete a user by their ID in DynamoDB.
     * @param id The ID of the user to delete.
     */
    @Override
    public void delete(int id) {
        User user = dynamoDBMapper.load(User.class, id); // Load the user by ID
        if (user != null) { // If the user exists
            dynamoDBMapper.delete(user); // Use DynamoDBMapper to delete the user
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
                return user;
            }
        }
        return null; // Return null if no user is found
    }
}
