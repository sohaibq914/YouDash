package group26.youdash.controller;


import group26.youdash.classes.Goal;
import group26.youdash.classes.WatchTimeGoal;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:3000")  // Allow React app to access this API
public class GoalController {


    //mapping for "/goals/user/create" that creates a goal based on json
    @PostMapping(path = "/{user}/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> getMessage(@PathVariable("user") String user, @RequestBody WatchTimeGoal wtgoal) {
        System.out.println(wtgoal);
        //Add goal to database

        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        System.out.println("RECEIVED");
        return new ResponseEntity<>(header, HttpStatus.OK);
    }

    @GetMapping("/{user}/view")
    public String getName(@PathVariable("user") String user)
    {

        return "Goals: " + user + "!";
    }

}