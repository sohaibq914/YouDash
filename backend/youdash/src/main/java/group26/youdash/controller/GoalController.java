package group26.youdash.controller;


import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:3000")  // Allow React app to access this API
public class GoalController {

    public class Goal {

    }

    //mapping for "/goals/user/create" that creates a goal based on json
    @PostMapping(path = "/{user}/create", consumes = "application/json")
    public String getMessage(@PathVariable("user") String user, @RequestBody Goal goal) {
        return "Hello from Spring Boot!";
    }

    @GetMapping("/{user}/view")
    public String getName(@PathVariable("user") String user)
    {

        return "Goals: " + user + "!";
    }

}