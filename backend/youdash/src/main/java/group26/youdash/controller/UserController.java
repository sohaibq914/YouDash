package group26.youdash.controller;

import group26.youdash.model.LoginRequest;
import group26.youdash.model.User;
import group26.youdash.service.EmailService;
import group26.youdash.service.GoogleAuthService;
import group26.youdash.service.UserService;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.auth.openidconnect.IdToken.Payload;

/**
 * UserController handles HTTP requests related to user operations.
 * It provides endpoints for user creation, retrieval, deletion,
 * sign-up, and login.
 *
 * Author: Abdul Wajid Arikattayil
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

     @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private UserService userService;


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @Autowired
    private EmailService emailService;

    /**
     * Creates a new user.
     *
     * @param user The User object from the HTTP request body.
     * @return ResponseEntity containing the saved user and HTTP status 201
     *         (CREATED) if successful.
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    private String getPayloadValue(Payload payload, String key) {
        Object value = payload.get(key);
        return value != null ? value.toString() : null;
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            Payload payload = googleAuthService.verifyGoogleToken(request.getIdToken());
            
            // Check if user exists by Google ID
            User user = userService.findByGoogleId((String) payload.getSubject());
            
            if (user == null) {
                // Create new user
                user = new User();
                user.setGoogleId((String) payload.getSubject());
                
                // Use helper method to safely get values
                String email = getPayloadValue(payload, "email");
                String name = getPayloadValue(payload, "name");
                String picture = getPayloadValue(payload, "picture");
                
                user.setEmail(email);
                user.setName(name);
                user.setUsername(email); // Use email as username
                user.setAuthProvider("google");
                if (picture != null) {
                    user.setProfilePicture(picture);
                }
                
                user = userService.save(user);
            }
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to authenticate with Google: " + e.getMessage());
        }
    }

    /**
     * Retrieves a user by ID.
     *
     * @param id The ID of the user to retrieve.
     * @return ResponseEntity containing the user if found, with HTTP
     *         status 200 (OK); otherwise, HTTP status 404 (NOT FOUND).
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = userService.findById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Deletes a user by ID.
     * 
     * @param id The ID of the user to delete.
     * @return ResponseEntity with HTTP status 204 (NO CONTENT) if the 
     *         deletion is successful.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<String> followUser(@PathVariable int id) {
        try {
            userService.followUser(id);  // Call the followUser method in the service
            return new ResponseEntity<>("User followed successfully", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/unfollow")
public ResponseEntity<String> unfollowUser(@PathVariable int id) {
    try {
        userService.unfollowUser(id);  // Call the unfollowUser method in the service
        return new ResponseEntity<>("User unfollowed successfully", HttpStatus.OK);
    } catch (NoSuchElementException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
}


@GetMapping("/{id}/followers")
public ResponseEntity<List<User>> getFollowers(@PathVariable int id) {
    try {
        List<User> followers = userService.getFollowers(id);  // Fetch followers for the given user ID
        return new ResponseEntity<>(followers, HttpStatus.OK);
    } catch (NoSuchElementException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}


@GetMapping("/{id}/my-followers")
public ResponseEntity<List<User>> getMyFollowers(@PathVariable int id) {
    try {
        List<User> followers = userService.getMyFollowers(id);  // Fetch followers of the given user ID
        return new ResponseEntity<>(followers, HttpStatus.OK);
    } catch (NoSuchElementException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

    /**
     * Handles user sign-up requests.
     *
     * @param user The User object from the HTTP request body.
     * @return ResponseEntity containing the saved user and HTTP status 201
     *         (CREATED) if successful; otherwise, HTTP status 500 (INTERNAL
     *         SERVER ERROR).
     */
    @PostMapping("/signup")
    public ResponseEntity<User> signUpUser(@RequestBody User user) {
        System.out.println("Received sign-up request for user: " + user);

            // Check if a user with the same username already exists
    User existingUser = userService.findByUsername(user.getUsername());
    if (existingUser != null) {
        System.out.println("Username already taken: " + user.getUsername());
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }
        User savedUser = userService.save(user);
        if (savedUser != null) {
            System.out.println("User saved successfully: " + savedUser);
            emailService.sendEmail(savedUser.getEmail(), "Welcome to YouDash",
            "Thank you for signing up, " + savedUser.getName() + "!");
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } else {
            System.out.println("Failed to save user.");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Handles user login requests.
     *
     * @param loginRequest The LoginRequest object containing the username
     *                     and password from the HTTP request body.
     * @return ResponseEntity containing the user if login is successful;
     *         otherwise, HTTP status 401 (UNAUTHORIZED).
     */
    @CrossOrigin(origins = "chrome-extension://jjbiojjnmgdpdlgjoommonpchgdbjmfc") // Allow CORS for your Chrome extension
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User user = userService.findByUsername(username);
        if (user != null) {
            String storedPassword = user.getPassword();
            // Check if the stored password is null
            if (storedPassword == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // or another suitable response
            }
            System.out.println("here");
            if (storedPassword.equals(password)) {
                System.out.println("done");
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}

class GoogleLoginRequest {
    private String idToken;
    
    public String getIdToken() {
        return idToken;
    }
    
    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
