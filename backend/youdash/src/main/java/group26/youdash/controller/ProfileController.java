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

    // Endpoint to update the user bio
    @PutMapping("/{userID}/updateBio")
    public ResponseEntity<String> updateBio(@PathVariable("userID") int userID, @RequestBody Map<String, String> payload) {
        String newBio = payload.get("bio");
        try {
            userService.updateUserBio(userID, newBio);  // Call the service method to update bio
            return new ResponseEntity<>("Bio updated successfully", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to get user profile information (optional, for future use)
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
