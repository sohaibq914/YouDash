package group26.youdash.controller;

import group26.youdash.model.User;
import group26.youdash.service.UserService;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = userService.findById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

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









}
