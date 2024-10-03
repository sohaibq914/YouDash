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

import static org.springframework.data.repository.init.ResourceReader.Type.JSON;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:3000")  // Allow React app to access this API
public class GoalController {

    ArrayList<WatchTimeGoal> temp = new ArrayList<>();

    //mapping for "/goals/user/create" that creates a goal based on json
    @PostMapping(path = "/{user}/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> getMessage(@PathVariable("user") String user, @RequestBody WatchTimeGoal wtgoal) {
        System.out.println(wtgoal);
        //Add goal to database

        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        System.out.println("Received New Goal");
        if (wtgoal.getGoalName().equals("DUP")) {
            //can't have duplicate names
        }
        temp.add(wtgoal);
        return new ResponseEntity<>(header, HttpStatus.OK);
    }

    @GetMapping("/{user}/view")
    public ArrayList<WatchTimeGoal> getName(@PathVariable("user") String user)
    {
        System.out.println(user + "Goal View Requested");
        System.out.println(temp);
        return temp;
    }

    private static class updateGoalPackage {
        public String originalName;
        public WatchTimeGoal wtg;

        public updateGoalPackage(String originalName, WatchTimeGoal wtg) {
            this.originalName = originalName;
            this.wtg = wtg;
        }
    }

    //mapping for "/goals/user/create" that creates a goal based on json
    @PostMapping(path = "/{user}/edit", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> editGoal(@PathVariable("user") String user, @RequestBody updateGoalPackage wtgoalPkg) {
        System.out.println(wtgoalPkg);
        //Update goal based on name
        for (int i = 0; i < temp.size(); i++) {
            if (temp.get(i).getGoalName().equals(wtgoalPkg.originalName)) {
                temp.set(i, wtgoalPkg.wtg);
                //replace in database
                break;
            }
        }

        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        System.out.println("Updated New Goal");
        System.out.println(temp);
        return new ResponseEntity<>(header, HttpStatus.OK);
    }

}