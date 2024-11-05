package group26.youdash.controller;

import group26.youdash.classes.QualityGoal;
import group26.youdash.classes.TimeOfDayGoal;
import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.model.User;
import group26.youdash.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import java.util.ArrayList;
import java.util.Arrays;
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
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> payload) {
        System.out.println("Auth received");
        String tokenId = payload.get("tokenId");
        try {
            GoogleIdToken idToken = userService.verifyGoogleToken(tokenId);

            if (idToken != null) {
                Payload tokenPayload = idToken.getPayload();
                String email = tokenPayload.getEmail();
                String name = (String) tokenPayload.get("name");

                Optional<User> existingUser = userService.getUserByEmail(email);
                User user;

                if (existingUser.isPresent()) {
                    user = existingUser.get();
                } else {

                    List<String> defaultCategories = Arrays.asList("Entertainment", "Vlogs", "Sports", "Comedy", 
                    "Pets & Animals", "Howto & Style", "Film & Animation", "Music", "Gaming");
                    // TODO add all attributes of a user
                    user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setBio("");
                    user.setPromptHistory(new ArrayList<>());
                    user.setQgoals(new ArrayList<QualityGoal> ());
                    user.setWtgoals(new ArrayList<WatchTimeGoal> ());
                    user.setTodgoals(new ArrayList<TimeOfDayGoal>());
                    user.setAvailableCategories(defaultCategories);
                    user.setBlocked(new ArrayList<>());
                    user.setDarkMode(false);
                    user.setFollowers(new ArrayList<>());
                    userService.save(user);
                }

                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying token.");
        }
    }

}
