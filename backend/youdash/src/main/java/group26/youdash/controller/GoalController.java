package group26.youdash.controller;


import group26.youdash.classes.Goal;
import group26.youdash.classes.WatchTimeGoal;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        System.out.println("Received New Goal");
        if (wtgoal.getGoalName().equals("DUP")) {

        }
        return new ResponseEntity<>(header, HttpStatus.OK);
    }

    @GetMapping("/{user}/view")
    public Map<String, String> getName(@PathVariable("user") String user)
    {
        Map<String, String> ret = new HashMap<>();
        ret.put("User", user);
        ret.put("GoalName", "This is a goal!");
        System.out.println("Goal View Requested");
        return ret;
    }

}