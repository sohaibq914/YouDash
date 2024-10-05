package group26.youdash.controller;

import group26.youdash.model.User;
import group26.youdash.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
