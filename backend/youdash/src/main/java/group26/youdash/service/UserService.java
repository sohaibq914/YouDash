package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;

import group26.youdash.model.User;
import group26.youdash.repository.UserRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService implements UserRepository {


    public void followUser(int userId) {
        // Find the user to be followed
        User userToFollow = dynamoDBMapper.load(User.class, userId);
        if (userToFollow == null) {
            throw new NoSuchElementException("User not found");
        }

        // Retrieve the current user from session or context (pseudo-code, implement this as needed)
        int currentUserId = getCurrentUserId();  // Implement a method to get the current logged-in user ID
        User currentUser = dynamoDBMapper.load(User.class, currentUserId);

        // Add current user ID to the followers list of the user to be followed
        List<Integer> followers = userToFollow.getFollowers();
        if (followers == null) {
            followers = new ArrayList<>();
        }

        if (!followers.contains(currentUserId)) {
            followers.add(currentUserId);
            userToFollow.setFollowers(followers);
            dynamoDBMapper.save(userToFollow);  // Save the updated user with the new followers list
        }
    }


    public void unfollowUser(int userId) {
        // Find the user to be unfollowed
        User userToUnfollow = dynamoDBMapper.load(User.class, userId);
        if (userToUnfollow == null) {
            throw new NoSuchElementException("User not found");
        }
    
        // Retrieve the current user from session or context (pseudo-code, implement this as needed)
        int currentUserId = getCurrentUserId();  // Implement a method to get the current logged-in user ID
        User currentUser = dynamoDBMapper.load(User.class, currentUserId);
    
        // Remove current user ID from the followers list of the user to be unfollowed
        List<Integer> followers = userToUnfollow.getFollowers();
        if (followers != null && followers.contains(currentUserId)) {
            followers.remove(Integer.valueOf(currentUserId));  // Remove the current user from the followers list
            userToUnfollow.setFollowers(followers);
            dynamoDBMapper.save(userToUnfollow);  // Save the updated user with the new followers list
        }
    }

    
    

    // Implement this method or retrieve it from security context
    private int getCurrentUserId() {
        // For demonstration, returning a hardcoded user ID. Replace this with actual logic.
        return 1;  // Replace with logic to get the current user ID (e.g., from the security context or session)
    }


    public List<User> getFollowers(int userId) {
        User user = dynamoDBMapper.load(User.class, userId);
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }
    
        List<Integer> followerIds = user.getFollowers();
        List<User> followers = new ArrayList<>();
    
        // Retrieve each follower by their ID
        if (followerIds != null) {
            for (Integer followerId : followerIds) {
                User follower = dynamoDBMapper.load(User.class, followerId);
                if (follower != null) {
                    followers.add(follower);
                }
            }
        }
    
        return followers;
    }


    public List<User> getMyFollowers(int userId) {
        User currentUser = dynamoDBMapper.load(User.class, userId); // Load the current user from DynamoDB
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }
    
        // Get the list of follower IDs from the current user
        List<Integer> followerIds = currentUser.getFollowers();
        System.out.println(followerIds);
        List<User> followers = new ArrayList<>();
    
        // Retrieve each follower's details using the follower IDs
        if (followerIds != null && !followerIds.isEmpty()) {
            for (Integer followerId : followerIds) {
                User follower = dynamoDBMapper.load(User.class, followerId);
                if (follower != null) {
                    followers.add(follower);
                }
            }
        }
    
        return followers; // Return the list of followers
    }
    
    



    public List<User> getAllUsers() {
        // Use DynamoDBMapper to scan all users in the Users table
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        return dynamoDBMapper.scan(User.class, scanExpression);
    }

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    @Autowired
    private FileStorageService fileStorageService;  // Autowire the FileStorageServic

    @Override
    public User save(User user) {
        dynamoDBMapper.save(user);
        return user;
    }

    @Override
    public User findById(int id) {
        return dynamoDBMapper.load(User.class, id);
    }

    @Override
    public void delete(int id) {
        User user = dynamoDBMapper.load(User.class, id);
        if (user != null) {
            dynamoDBMapper.delete(user);
        }
    }

    // Method to update user bio in the database
    public void updateUserBio(int userID, String newBio) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            user.setBio(newBio);  // Set the new bio
            dynamoDBMapper.save(user);  // Save the updated user
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    // Method to update user profile information in the database
    public void updateUserProfile(int userID, String name, String email, String password, String bio) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            if (name != null) user.setName(name);
            if (email != null) user.setEmail(email);
            if (password != null) user.setPassword(password);
            if (bio != null) user.setBio(bio);
            dynamoDBMapper.save(user);  // Save the updated user
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    // Method to get user profile information
    public User getUserProfile(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            return user;
        } 
        else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public String uploadProfilePicture(int userID, MultipartFile file) throws IOException {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user == null) throw new NoSuchElementException("User not found");

        // Use FileStorageService to upload the file and get the URL
        String profilePictureUrl = fileStorageService.uploadFile(file);

        // Update the user's profilePicture attribute with the S3 URL
        user.setProfilePicture(profilePictureUrl);
        dynamoDBMapper.save(user);

        return profilePictureUrl;
    }


    // Method to update dark mode preference for a specific user
    public void updateUserDarkMode(int userID, boolean darkMode) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user == null) throw new NoSuchElementException("User not found");

        user.setDarkMode(darkMode);  // Set the new dark mode value
        dynamoDBMapper.save(user);   // Save the updated user object in DynamoDB
    }

    // Method to get dark mode preference for a specific user
    public boolean getUserDarkMode(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user == null) throw new NoSuchElementException("User not found");

        return user.isDarkMode();  // Return the current dark mode preference
    }




}
