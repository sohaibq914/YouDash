package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import group26.youdash.classes.YoutubeAPI.VideoHistory;
import group26.youdash.model.FollowRequest;
import group26.youdash.model.User;
import group26.youdash.repository.UserRepository;

import java.util.*;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


@Service // Marks this class as a service component in the Spring framework
/**
 * UserService implements UserRepository for user-related operations.
 * Author: Abdul Wajid Arikattayil
 */
public class UserService  {


    private final GoogleIdTokenVerifier verifier;

    @Autowired
    public UserService(DynamoDBMapper dynamoDBMapper) {
        this.dynamoDBMapper = dynamoDBMapper;
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList("682668393207-okhgksrvqn1ulvc9rlspeuose1opaimq.apps.googleusercontent.com"))
                .build();
    }

    public Optional<User> getUserByEmail(String email) {
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<User> users = dynamoDBMapper.scan(User.class, scanExpression);
        return users.stream().filter(user -> email.equals(user.getEmail())).findFirst();
    }
    public GoogleIdToken verifyGoogleToken(String tokenId) throws Exception {
        System.out.println(tokenId);
        return verifier.verify(tokenId);
    }
    // Add these methods to your existing UserService.java class

public void updatePrivacySettings(int userId, boolean isPrivate) {
    User user = dynamoDBMapper.load(User.class, userId);
    if (user == null) {
        throw new NoSuchElementException("User not found");
    }
    user.setPrivate(isPrivate);
    dynamoDBMapper.save(user);
}

public boolean handleFollowRequest(int targetUserId, int requesterId) {
    User targetUser = dynamoDBMapper.load(User.class, targetUserId);
    User requester = dynamoDBMapper.load(User.class, requesterId);
    
    if (targetUser == null || requester == null) {
        throw new NoSuchElementException("User not found");
    }

    // Don't allow self-following
    if (targetUserId == requesterId) {
        throw new IllegalArgumentException("Users cannot follow themselves");
    }
    
    // Check if already following
    List<Integer> currentUserFollowers = requester.getFollowers();
    if (currentUserFollowers != null && currentUserFollowers.contains(targetUserId)) {
        throw new IllegalStateException("Already following this user");
    }
    
    // If account is public, follow directly
    if (!targetUser.isPrivate()) {
        followUser(targetUserId, requesterId);
        return true;
    }
    
    // If account is private, create follow request
    List<FollowRequest> requests = targetUser.getPendingFollowRequests();
    if (requests == null) {
        requests = new ArrayList<>();
    }
    
    // Check if request already exists
    boolean requestExists = requests.stream()
        .anyMatch(request -> request.getRequesterId() == requesterId && 
                 "PENDING".equals(request.getStatus()));
    
    if (!requestExists) {
        requests.add(new FollowRequest(requesterId, requester.getName()));
        targetUser.setPendingFollowRequests(requests);
        dynamoDBMapper.save(targetUser);
    } else {
        throw new IllegalStateException("Follow request already pending");
    }
    
    return false;
}

public List<FollowRequest> getPendingFollowRequests(int userId) {
    User user = dynamoDBMapper.load(User.class, userId);
    if (user == null) {
        throw new NoSuchElementException("User not found");
    }
    
    List<FollowRequest> allRequests = user.getPendingFollowRequests();
    if (allRequests == null) {
        return new ArrayList<>();
    }
    
    // Filter to only return PENDING requests
    return allRequests.stream()
        .filter(request -> "PENDING".equals(request.getStatus()))
        .collect(Collectors.toList());
}

public void acceptFollowRequest(int userId, int requesterId) {
    User user = dynamoDBMapper.load(User.class, userId);
    if (user == null) {
        throw new NoSuchElementException("User not found");
    }
    
    List<FollowRequest> requests = user.getPendingFollowRequests();
    if (requests == null) {
        throw new IllegalStateException("No pending follow requests");
    }
    
    // Find and update the specific request
    Optional<FollowRequest> requestOpt = requests.stream()
        .filter(request -> request.getRequesterId() == requesterId && 
                "PENDING".equals(request.getStatus()))
        .findFirst();
        
    if (requestOpt.isPresent()) {
        FollowRequest request = requestOpt.get();
        request.setStatus("ACCEPTED");
        dynamoDBMapper.save(user);
        
        // Create the follow relationship
        followUser(userId, requesterId);
    } else {
        throw new NoSuchElementException("No pending follow request found from this user");
    }
}

public void rejectFollowRequest(int userId, int requesterId) {
    User user = dynamoDBMapper.load(User.class, userId);
    if (user == null) {
        throw new NoSuchElementException("User not found");
    }
    
    List<FollowRequest> requests = user.getPendingFollowRequests();
    if (requests == null) {
        throw new IllegalStateException("No pending follow requests");
    }
    
    // Find and update the specific request
    Optional<FollowRequest> requestOpt = requests.stream()
        .filter(request -> request.getRequesterId() == requesterId && 
                "PENDING".equals(request.getStatus()))
        .findFirst();
        
    if (requestOpt.isPresent()) {
        FollowRequest request = requestOpt.get();
        request.setStatus("REJECTED");
        dynamoDBMapper.save(user);
    } else {
        throw new NoSuchElementException("No pending follow request found from this user");
    }
}

// Helper method to check if a user can view another user's profile
public boolean canViewProfile(int viewerId, int profileId) {
    if (viewerId == profileId) {
        return true; // Users can always view their own profile
    }

    User profileUser = dynamoDBMapper.load(User.class, profileId);
    if (profileUser == null) {
        throw new NoSuchElementException("Profile user not found");
    }

    // If account is public, anyone can view
    if (!profileUser.isPrivate()) {
        return true;
    }

    // If account is private, check if viewer is a follower
    List<Integer> followers = profileUser.getFollowers();
    return followers != null && followers.contains(viewerId);
}

// Helper method to check if a follow request exists
public boolean hasExistingFollowRequest(int targetUserId, int requesterId) {
    User targetUser = dynamoDBMapper.load(User.class, targetUserId);
    if (targetUser == null) {
        throw new NoSuchElementException("Target user not found");
    }

    List<FollowRequest> requests = targetUser.getPendingFollowRequests();
    if (requests == null) {
        return false;
    }

    return requests.stream()
        .anyMatch(request -> request.getRequesterId() == requesterId && 
                 "PENDING".equals(request.getStatus()));
}
    

    // In UserService.java
    public void followUser(int targetUserId, int currentUserId) { // Added currentUserId parameter
        // Find the user to be followed
        // System.out.println("CURRENT USER " + currentUserId);
        User userToFollow = dynamoDBMapper.load(User.class, targetUserId);
        if (userToFollow == null) {
            throw new NoSuchElementException("User not found");
        }
        // System.out.println("TARGET USER " + targetUserId);

        // Load the current user
        User currentUser = dynamoDBMapper.load(User.class, currentUserId);
        if (currentUser == null) {
            throw new NoSuchElementException("Current user not found");
        }
        // System.out.println("USER TO FOLLOW: " + userToFollow.getFollowers());
        // Add current user ID to the followers list of the user to be followed
        List<Integer> followers = currentUser.getFollowers();
        if (followers == null) {
            followers = new ArrayList<>();
        }

        if (!followers.contains(targetUserId)) {
            followers.add(targetUserId);
            currentUser.setFollowers(followers);
            dynamoDBMapper.save(currentUser);
        }
    }

    public void unfollowUser(int targetUserId, int currentUserId) {
        // System.out.println("CURRENT USER " + currentUserId);
        // Find the target user
        User userToUnfollow = dynamoDBMapper.load(User.class, targetUserId);
        if (userToUnfollow == null) {
            throw new NoSuchElementException("User not found");
        }
        // System.out.println("TARGET USER " + targetUserId);

        // Load the current user
        User currentUser = dynamoDBMapper.load(User.class, currentUserId);
        if (currentUser == null) {
            throw new NoSuchElementException("Current user not found");
        }

        // System.out.println("CURRENT USER FOLLOWERS: " + currentUser.getFollowers());
        // Remove target user ID from the current user's followers list
        List<Integer> followers = currentUser.getFollowers();
        if (followers != null && followers.contains(targetUserId)) {
            followers.remove(Integer.valueOf(targetUserId)); // Use Integer.valueOf to remove by object, not index
            currentUser.setFollowers(followers);
            dynamoDBMapper.save(currentUser);
        }
    }

    public User findByGoogleId(String googleId) {
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        PaginatedScanList<User> scanResult = dynamoDBMapper.scan(User.class, scanExpression);

        for (User user : scanResult) {
            if (googleId.equals(user.getGoogleId())) {
                return user;
            }
        }
        return null;
    }

    public List<User> getRecommendationsFromFollowers(int userId) {
        // Scan all users to find who has current user in their followers list
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<User> allUsers = dynamoDBMapper.scan(User.class, scanExpression);
        System.out.println("ALL USERS: " + allUsers);
        Set<Integer> recommendedUserIds = new HashSet<>();

        // Get current user to get their followers list (for filtering)
        User currentUser = dynamoDBMapper.load(User.class, userId);
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }
        List<Integer> currentUserFollowers = currentUser.getFollowers(); // People current user follows

        // Find users who follow the current user
        for (User user : allUsers) {
            System.out.println("U" + user.getFollowers());
            List<Integer> theirFollowers = user.getFollowers();
            System.out.println("USERID" + userId);
            // If this user has current user in their followers list
            if (theirFollowers != null && theirFollowers.contains(userId)) {
                // Add who they follow (their followers list) to recommendations
                recommendedUserIds.addAll(theirFollowers);
            }
        }

        System.out.println("YOLO: " + recommendedUserIds);
        // Remove the current user and people they already follow
        recommendedUserIds.remove(userId);
        if (currentUserFollowers != null) {
            recommendedUserIds.removeAll(currentUserFollowers);
        }

        System.out.println("FF" + recommendedUserIds);

        // Convert IDs to User objects
        return recommendedUserIds.stream()
                .map(id -> dynamoDBMapper.load(User.class, id))
                .filter(user -> user != null)
                .collect(Collectors.toList());
    }

    // Method to recommend users to follow based on who the user's followers are
    // following
    public List<User> getRecommendedFollowers(int userId) {
        User currentUser = dynamoDBMapper.load(User.class, userId);
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }

        List<Integer> followerIds = currentUser.getFollowers();
        Set<Integer> recommendedUserIds = new HashSet<>();

        // Iterate over each follower to get their followers
        for (Integer followerId : followerIds) {
            User follower = dynamoDBMapper.load(User.class, followerId);
            if (follower != null) {
                // Add each follower's followers to the recommended list
                List<Integer> followersOfFollower = follower.getFollowers();
                if (followersOfFollower != null) {
                    recommendedUserIds.addAll(followersOfFollower);
                }
            }
        }

        // Remove the current user and their direct followers from recommendations
        recommendedUserIds.remove(userId);
        recommendedUserIds.removeAll(followerIds);

        // Retrieve user objects for each recommended ID
        return recommendedUserIds.stream()
                .map(id -> dynamoDBMapper.load(User.class, id))
                .filter(user -> user != null)
                .collect(Collectors.toList());
    }

    // Method to get followers of a follower
    public List<User> getFollowersOfFollower(int followerId) {
        User follower = dynamoDBMapper.load(User.class, followerId);
        if (follower == null) {
            throw new NoSuchElementException("Follower not found");
        }

        List<Integer> followersOfFollowerIds = follower.getFollowers();
        List<User> followersOfFollower = new ArrayList<>();

        if (followersOfFollowerIds != null) {
            for (Integer id : followersOfFollowerIds) {
                User user = dynamoDBMapper.load(User.class, id);
                if (user != null) {
                    followersOfFollower.add(user);
                }
            }
        }

        return followersOfFollower;
    }

    public List<User> getFollowersOfFollowersRecommendations(int userId) {
        User currentUser = dynamoDBMapper.load(User.class, userId);
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }

        // Get the current user's followers
        List<Integer> followerIds = currentUser.getFollowers();
        Set<Integer> recommendedUserIds = new HashSet<>();

        // For each follower, get their followers
        for (Integer followerId : followerIds) {
            User follower = dynamoDBMapper.load(User.class, followerId);
            if (follower != null) {
                List<Integer> followersOfFollower = follower.getFollowers();
                if (followersOfFollower != null) {
                    recommendedUserIds.addAll(followersOfFollower);
                }
            }
        }

        // Exclude the current user and their direct followers
        recommendedUserIds.remove(userId);
        recommendedUserIds.removeAll(followerIds);

        // Retrieve user objects for each recommended ID
        return recommendedUserIds.stream()
                .map(id -> dynamoDBMapper.load(User.class, id))
                .filter(user -> user != null)
                .collect(Collectors.toList());
    }

    // Method to recommend users based on who the current user follows
    public List<User> getRecommendedBasedOnFollowing(int userId) {
        User currentUser = dynamoDBMapper.load(User.class, userId);
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }

        // Get the list of users that the current user follows
        List<Integer> followingIds = currentUser.getFollowing(); // Assuming `getFollowing()` method exists
        Set<Integer> recommendedUserIds = new HashSet<>();

        // Iterate over each user that the current user follows
        for (Integer followingId : followingIds) {
            User followedUser = dynamoDBMapper.load(User.class, followingId);
            if (followedUser != null) {
                // Add each user that the followed user follows to the recommendations
                List<Integer> followersOfFollowedUser = followedUser.getFollowing(); // Assuming `getFollowing()` method
                                                                                     // exists for User
                if (followersOfFollowedUser != null) {
                    recommendedUserIds.addAll(followersOfFollowedUser);
                }
            }
        }

        // Remove the current user and their direct followees from recommendations
        recommendedUserIds.remove(userId);
        recommendedUserIds.removeAll(followingIds);

        // Retrieve user objects for each recommended ID
        return recommendedUserIds.stream()
                .map(id -> dynamoDBMapper.load(User.class, id))
                .filter(user -> user != null)
                .collect(Collectors.toList());
    }

    // Implement this method or retrieve it from security context
    private int getCurrentUserId() {
        // For demonstration, returning a hardcoded user ID. Replace this with actual
        // logic.
        return 12345; // Replace with logic to get the current user ID (e.g., from the security
                      // context or session)
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

    public List<User> getUsersFollowingCurrentUser(int userId) {
        // Scan all users in the database
        // System.out.println("IN SERVICE");
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<User> allUsers = dynamoDBMapper.scan(User.class, scanExpression);

        List<User> usersFollowingCurrentUser = new ArrayList<>();

        // Iterate over each user to check if they are following the current user
        for (User user : allUsers) {
            List<Integer> followingList = user.getFollowers(); // Assuming `getFollowing()` returns IDs the user is
                                                               // following
            // System.out.println("USER: " + user);
            // System.out.println("FOLLOWING " + followingList);
            if (followingList != null && followingList.contains(userId)) {
                // System.out.println("THIS GUY" + user);
                usersFollowingCurrentUser.add(user); // Add user if they are following the current user
            }
        }

        return usersFollowingCurrentUser;
    }

    public List<User> getMyFollowers(int userId) {
        User currentUser = dynamoDBMapper.load(User.class, userId); // Load the current user from DynamoDB
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }

        // Get the list of follower IDs from the current user
        List<Integer> followerIds = currentUser.getFollowers();
        // System.out.println("SUPP" + followerIds);
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
    private FileStorageService fileStorageService; // Autowire the FileStorageServic

    @Autowired // Automatically injects an instance of DynamoDBMapper
    private DynamoDBMapper dynamoDBMapper;

    // Generates unique IDs across all users
    private static final AtomicInteger userIdCounter = new AtomicInteger(1);

    /**
     * Save a user to DynamoDB.
     * 
     * @param user The user object to save.
     * @return The saved user object.
     */
  

    public User save(User user) {
        // If new user (no ID set)
        if (user.getId() == 0) {
            int newId = 0;
            List<User> users = getAllUsers();
            boolean matchExists = true;
            while (matchExists) {
                matchExists = false;
                for (User u : users) {
                    if (u.getId() == newId) {
                        newId++;
                        matchExists = true;
                    }
                }
            }
            user.setId(newId);
        }

        // If Google user, handle special case
        if ("google".equals(user.getAuthProvider())) {
            User existingUser = findByGoogleId(user.getGoogleId());
            if (existingUser != null) {
                // Update existing user's information
                existingUser.setEmail(user.getEmail());
                existingUser.setName(user.getName());
                user = existingUser;
            }
        }

        dynamoDBMapper.save(user);
        return user;
    }

    /**
     * Find a user by their ID in DynamoDB.
     * 
     * @param id The ID of the user to find.
     * @return The user object if found, otherwise null.
     */

    public User findById(int id) {
        return dynamoDBMapper.load(User.class, id); // Load the user by ID
    }

    /**
     * Delete a user by their ID in DynamoDB.
     * 
     * @param id The ID of the user to delete.
     */
    
    public void delete(int id) {
        User user = dynamoDBMapper.load(User.class, id); // Load the user by ID
        if (user != null) { // If the user exists
            dynamoDBMapper.delete(user); // Delete the user
        }
    }

    // Method to update user bio in the database
    public void updateUserBio(int userID, String newBio) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            user.setBio(newBio); // Set the new bio
            dynamoDBMapper.save(user); // Save the updated user
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    // Method to update user profile information in the database
    public void updateUserProfile(int userID, String name, String email, String password, String bio) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            if (name != null)
                user.setName(name);
            if (email != null)
                user.setEmail(email);
            if (password != null)
                user.setPassword(password);
            if (bio != null)
                user.setBio(bio);
            dynamoDBMapper.save(user); // Save the updated user
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

    // Method to get user history information (only urls)
    public List<String> getUserHistory(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            List<String> retVal = new ArrayList<>();
            List<VideoHistory> vh = user.getHistory();
            for (VideoHistory v : vh) {
                retVal.add(v.getUrl());
            }
            return retVal;
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    // Upload profile picture to a single S3 bucket using FileStorageService
    public String uploadProfilePicture(int userID, MultipartFile file) throws IOException {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user == null)
            throw new NoSuchElementException("User not found");

        // Create a unique key for the profile picture using the userID
        String profilePictureKey = "user-" + userID + "-profile-picture." + getExtension(file.getOriginalFilename());
        System.out.println(profilePictureKey);

        // Upload the file to S3 and get the URL
        String profilePictureUrl = fileStorageService.uploadFile(file, profilePictureKey);
        // Update user's profile picture key in the database
        user.setProfilePictureKey(profilePictureKey);
        dynamoDBMapper.save(user);

        System.out.println("BEFOREE RETURNNNING");
        return profilePictureUrl;
    }

    // Get the profile picture URL for a specific user
    public String getProfilePictureUrl(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user == null)
            throw new NoSuchElementException("User not found");

        String profilePictureKey = user.getProfilePictureKey();
        if (profilePictureKey == null || profilePictureKey.isEmpty()) {
            return null; // Return null or a default URL if no profile picture is set
        }

        // Use FileStorageService to get the S3 URL for the profile picture key
        return fileStorageService.getS3FileUrl(profilePictureKey);
    }

    // Helper method to extract file extension
    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    // Method to update dark mode preference for a specific user
    public void updateUserDarkMode(int userID, boolean darkMode) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user == null)
            throw new NoSuchElementException("User not found");

        user.setDarkMode(darkMode); // Set the new dark mode value
        dynamoDBMapper.save(user); // Save the updated user object in DynamoDB
    }

    // Method to get dark mode preference for a specific user
    public boolean getUserDarkMode(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user == null)
            throw new NoSuchElementException("User not found");

        return user.isDarkMode(); // Return the current dark mode preference
    }

    // public List<User> getRecommendedBasedOnFollowersOfFollowers(int userId) {
    // User currentUser = dynamoDBMapper.load(User.class, userId);
    // if (currentUser == null) {
    // throw new NoSuchElementException("User not found");
    // }

    // // Get followers of the current user
    // List<Integer> followerIds = currentUser.getFollowers();
    // Set<Integer> recommendedUserIds = new HashSet<>();

    // // Iterate over each follower to get their followers
    // for (Integer followerId : followerIds) {
    // User follower = dynamoDBMapper.load(User.class, followerId);
    // if (follower != null) {
    // List<Integer> followersOfFollower = follower.getFollowers();
    // if (followersOfFollower != null) {
    // recommendedUserIds.addAll(followersOfFollower);
    // }
    // }
    // }

    // // Exclude the current user and their direct followers from the
    // recommendations
    // recommendedUserIds.remove(userId);
    // recommendedUserIds.removeAll(followerIds);

    // // Retrieve user objects for each recommended ID
    // return recommendedUserIds.stream()
    // .map(id -> dynamoDBMapper.load(User.class, id))
    // .filter(Objects::nonNull)
    // .collect(Collectors.toList());
    // }

    /**
     * Find user by username in DynamoDB.
     * 
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


    public void blockUser(int userId, int blockedUserId) {
        User user = findById(userId);
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }

        List<Integer> blockedUsers = user.getBlockedUsers();
        if (blockedUsers == null) {
            blockedUsers = new ArrayList<>();
        }
        
        if (!blockedUsers.contains(blockedUserId)) {
            blockedUsers.add(blockedUserId);
            user.setBlockedUsers(blockedUsers);
            dynamoDBMapper.save(user);
        }
    }

    public void unblockUser(int userId, int blockedUserId) {
        User user = findById(userId);
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }

        List<Integer> blockedUsers = user.getBlockedUsers();
        if (blockedUsers != null) {
            blockedUsers.remove(Integer.valueOf(blockedUserId));
            user.setBlockedUsers(blockedUsers);
            dynamoDBMapper.save(user);
        }
    }

    public boolean isUserBlocked(int userId, int blockedUserId) {
        User user = findById(userId);
        return user != null && 
               user.getBlockedUsers() != null && 
               user.getBlockedUsers().contains(blockedUserId);
    }

}
