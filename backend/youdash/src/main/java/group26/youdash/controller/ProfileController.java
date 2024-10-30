package group26.youdash.controller;

import group26.youdash.model.User;
import group26.youdash.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;


@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserService userService;

    // Endpoint to update the user profile information
    @PutMapping("/{userID}/updateProfile")
    public ResponseEntity<String> updateProfile(
            @PathVariable("userID") int userID, 
            @RequestBody Map<String, String> payload) {
        
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");
        String bio = payload.get("bio");

        try {
            userService.updateUserProfile(userID, name, email, password, bio);
            return new ResponseEntity<>("Profile updated successfully", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }



    @PostMapping("/{userID}/uploadProfilePicture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
        @PathVariable("userID") int userID, 
        @RequestParam("file") MultipartFile file) {
            System.out.println("HIIIII");
            
    
        try {
            System.out.println("Received request to upload profile picture for user ID: " + userID);
        System.out.println("File name: " + file.getOriginalFilename());
        System.out.println("File size: " + file.getSize());
            String profilePictureUrl = userService.uploadProfilePicture(userID, file);
            return new ResponseEntity<>(Map.of("profilePicture", profilePictureUrl), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to get user profile information
    @GetMapping("/{userID}")
    public ResponseEntity<User> getUserProfile(@PathVariable("userID") int userID) {
        try {
            User user = userService.getUserProfile(userID);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    // GET endpoint to fetch dark mode preference for the logged-in user
    @GetMapping("/darkmode")
    public ResponseEntity<Map<String, Boolean>> getDarkMode() {
        int userID = 12345; // Hardcoded or retrieved from session for now
        try {
            boolean darkMode = userService.getUserDarkMode(userID);
            return new ResponseEntity<>(Map.of("darkMode", darkMode), HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // POST endpoint to update dark mode preference for the logged-in user
    @PostMapping("/darkmode")
    public ResponseEntity<String> updateDarkMode(@RequestBody Map<String, Boolean> payload) {
        int userID = 12345; // Hardcoded or retrieved from session for now
        try {
            boolean darkMode = payload.get("darkMode");
            userService.updateUserDarkMode(userID, darkMode);
            return new ResponseEntity<>("Dark mode updated successfully", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{userId}/full")
    public ResponseEntity<?> getFullUserData(@PathVariable int userId) {
        try {
            User user = userService.findById(userId);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Create a response object with all necessary data
            Map<String, Object> fullUserData = new HashMap<>();
            fullUserData.put("name", user.getName());
            fullUserData.put("email", user.getEmail());
            fullUserData.put("bio", user.getBio());
            fullUserData.put("username", user.getUsername());
            fullUserData.put("wtgoals", user.getWtgoals());
            fullUserData.put("qgoals", user.getQgoals());
            fullUserData.put("todgoals", user.getTodgoals());
            fullUserData.put("blocked", user.getBlocked());
            fullUserData.put("availableCategories", user.getAvailableCategories());
            fullUserData.put("history", user.getHistory());
            
            return ResponseEntity.ok(fullUserData);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error retrieving user data: " + e.getMessage());
        }
    }

}
