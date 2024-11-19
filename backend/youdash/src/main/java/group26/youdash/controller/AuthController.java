package group26.youdash.controller;

import group26.youdash.classes.QualityGoal;
import group26.youdash.classes.TimeOfDayGoal;
import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.model.User;
import group26.youdash.service.UserService;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/google-login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> payload, HttpSession session) {
        System.out.println("Auth received");
        String tokenId = payload.get("tokenId");

        try {
            // Verify the Google ID token
            GoogleIdToken idToken = userService.verifyGoogleToken(tokenId);

            if (idToken != null) {
                Payload tokenPayload = idToken.getPayload();
                String email = tokenPayload.getEmail();
                String name = (String) tokenPayload.get("name");

                // Check if the user exists in the database
                Optional<User> existingUser = userService.getUserByEmail(email);
                User user;

                if (existingUser.isPresent()) {
                    user = existingUser.get();
                } else {
                    // If user doesn't exist, create a new user with default settings
                    List<String> defaultCategories = Arrays.asList(
                            "Entertainment", "Vlogs", "Sports", "Comedy",
                            "Pets & Animals", "Howto & Style", "Film & Animation", "Music", "Gaming");

                    user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setBio("");
                    user.setPromptHistory(new ArrayList<>());
                    user.setQgoals(new ArrayList<QualityGoal>());
                    user.setWtgoals(new ArrayList<WatchTimeGoal>());
                    user.setTodgoals(new ArrayList<TimeOfDayGoal>());
                    user.setAvailableCategories(defaultCategories);
                    user.setBlocked(new ArrayList<>());
                    user.setDarkMode(false);
                    user.setFollowers(new ArrayList<>());

                    userService.save(user);
                }

                // Store the user's ID in the session
                session.setAttribute("userId", user.getId());
                System.out.println("Session created for user ID: " + user.getId());

                // Return the user's ID and success message
                return ResponseEntity.ok(new HashMap<String, Object>() {
                    {
                        put("userId", user.getId());
                        put("message", "Google login successful");
                    }
                });
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying token.");
        }
    }

}
