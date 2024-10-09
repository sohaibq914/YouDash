package group26.youdash.controller;


import group26.youdash.classes.Goal;
import group26.youdash.classes.QualityGoal;
import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.service.GoalsService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private GoalsService gs;

    ArrayList<Goal> temp = new ArrayList<>();

    //mapping for "/goals/user/create" that creates a goal based on json
    @PostMapping(path = "/{user}/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> createGoal(@PathVariable("user") String user, @RequestBody Goal goal) {
        System.out.println(user);
        System.out.println(goal);
        //System.out.println((QualityGoal) goal);

        int userId = 12345;
        for (int i = 0; i < temp.size(); i++) {
            if (goal.getGoalName().equals(temp.get(i).getGoalName())) {
                //can't have duplicate names
                System.out.println("Error: Duplicate Goal Name");
                HttpHeaders header = new HttpHeaders();
                header.add("Duplicate", "Duplicate goal");
                return new ResponseEntity<>(header, HttpStatus.CONFLICT);
            }
        }
        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        System.out.println("Received New Goal");
        temp.add(goal);
        gs.uploadGoalList(userId, temp);
        return new ResponseEntity<>(header, HttpStatus.OK);
    }

    @GetMapping("/{user}/view")
    public ArrayList<Goal> viewGoal(@PathVariable("user") String user)
    {
        System.out.println(user + "Goal View Requested");
        System.out.println(temp);
        return temp;
    }

    private static class updateGoalPackage {
        public String originalName;
        public Goal g;

        public updateGoalPackage(String originalName, Goal g) {
            this.originalName = originalName;
            this.g = g;
        }
    }

    //mapping for "/goals/user/create" that creates a goal based on json
    @PostMapping(path = "/{user}/edit", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> editGoal(@PathVariable("user") String user, @RequestBody updateGoalPackage goalPkg) {
        int userId = 12345;
        System.out.println(goalPkg.g);
        //Update goal based on name
        for (int i = 0; i < temp.size(); i++) {
            if (temp.get(i).getGoalName().equals(goalPkg.originalName)) {
                temp.set(i, goalPkg.g);
                //replace in database
                break;
            }
        }

        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        System.out.println("Updated New Goal");
        System.out.println(temp);
        gs.uploadGoalList(userId, temp);
        return new ResponseEntity<>(header, HttpStatus.OK);
    }

    @PostMapping(path = "/{user}/delete", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> deleteGoal(@PathVariable("user") String user, @RequestBody Goal goalToDelete)
    {
        //Add goal to database
        int userId = 12345;

        for (int i = 0; i < temp.size(); i++) {
            if (temp.get(i).getGoalName().equals(goalToDelete.getGoalName())) {
                temp.remove(i);
                //removed
                //replace in database
                break;
            }
        }
        HttpHeaders header = new HttpHeaders();
        header.add("200", "Removed Goal");
        System.out.println("Removed Goal" + goalToDelete.getGoalName());
        gs.uploadGoalList(userId, temp);
        return new ResponseEntity<>(header, HttpStatus.OK);
    }


}