package group26.youdash.controller;

import group26.youdash.model.LoginRequest;
import group26.youdash.model.User;
import group26.youdash.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Marks this class as a RESTful controller for handling HTTP requests and returning responses in JSON or XML format
@RequestMapping("/api/users") // Base URL path for all endpoints in this controller
public class UserController {

    @Autowired // Automatically injects an instance of UserService for handling business logic
    private UserService userService;

    /**
     * Create a new user.
     * Endpoint: POST /api/users
     * @param user The User object from the HTTP request body
     * @return The saved user and HTTP status 201 (CREATED) if successful
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user); // Save the user using the service layer
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED); // Return the saved user with HTTP 201 status
    }

    /**
     * Get a user by ID.
     * Endpoint: GET /api/users/{id}
     * @param id The ID of the user to retrieve
     * @return The user if found, with HTTP status 200 (OK); otherwise, HTTP status 404 (NOT FOUND)
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = userService.findById(id); // Retrieve the user by ID
        if (user != null) { // If user is found
            return new ResponseEntity<>(user, HttpStatus.OK); // Return user and HTTP 200 status
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Return HTTP 404 if user not found
    }

    /**
     * Delete a user by ID.
     * Endpoint: DELETE /api/users/{id}
     * @param id The ID of the user to delete
     * @return HTTP status 204 (NO CONTENT) if the deletion is successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.delete(id); // Delete the user by ID using the service layer
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Return HTTP 204 status if successful
    }

    @PostMapping("/signup") // Endpoint for user sign-up
    public ResponseEntity<User> signUpUser(@RequestBody User user) {
        // Log the incoming user object
        System.out.println("Received sign-up request for user: " + user);

        User savedUser = userService.save(user);

        if (savedUser != null) {
            // Log success
            System.out.println("User saved successfully: " + savedUser);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } else {
            // Log failure
            System.out.println("Failed to save user.");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


@PostMapping("/login")
public ResponseEntity<User> loginUser(@RequestBody LoginRequest loginRequest) {
    String username = loginRequest.getUsername();
    String password = loginRequest.getPassword();

    // Fetch the user by username
    User user = userService.findByUsername(username);

    if (user != null && user.getPassword().equals(password)) {
        // If username exists and password matches, return success
        return new ResponseEntity<>(user, HttpStatus.OK);
    } else {
        // If the credentials are invalid, return 401 Unauthorized
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}



}
