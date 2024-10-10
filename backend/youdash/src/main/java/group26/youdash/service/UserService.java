package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import group26.youdash.model.User;
import group26.youdash.repository.UserRepository;

import java.io.IOException;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService implements UserRepository {

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
        } else {
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
