package group26.youdash.controller;


import group26.youdash.classes.Goal;
import group26.youdash.classes.QualityGoal;
import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.service.GoalsService;
import group26.youdash.service.UserService;
import group26.youdash.service.YoutubeAPIService;
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


    private final YoutubeAPIService youtubeAPIService;

    @Autowired
    public GoalController(YoutubeAPIService youtubeAPIService) {
        this.youtubeAPIService = youtubeAPIService;
    }

    @Autowired
    private GoalsService gs;

    @Autowired
    private UserService us;

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
    String[] matches = {
      "Film & Animation",
          "Autos & Vehicles",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "Music",
          "11",
          "12",
          "13",
          "14",
          "Pets & Animals",
          "16",
          "Sports",
          "Short Movies",
          "Travel & Events",
          "Gaming",
          "Videoblogging",
          "People & Blogs",
          "Comedy",
          "Entertainment",
          "News & Politics",
          "Howto & Style",
          "Education",
          "Science & Technology",
          "Nonprofits & Activism",
          "Movies",
          "Anime/Animation",
          "Action/Adventure",
          "Classics",
          "Comedy",
          "Documentary",
          "Drama",
          "Family",
          "Foreign",
          "Horror",
          "Sci-Fi/Fantasy",
          "Thriller",
          "Shorts",
          "Shows",
          "Trailers"
    };
    @GetMapping("/{user}/view")
    public ArrayList<Goal> viewGoal(@PathVariable("user") String user)
    {
        int userId = 12345;
        //System.out.println(user + "Goal View Requested");
        //System.out.println(temp);
        ArrayList<String> vids = (ArrayList<String>) us.getUserHistory(userId);
        for(int i = 0; i < temp.size(); i++) {
            if (temp.get(i) instanceof WatchTimeGoal) {
                float totalWT = 0.0f;
                for (String vid : vids) {
                    try {
                        //System.out.println(matches[Integer.parseInt(youtubeAPIService.getVideoCategoryID(vid))-1]);
                        if (matches[Integer.parseInt(youtubeAPIService.getVideoCategoryID(vid))-1].equalsIgnoreCase(((WatchTimeGoal) temp.get(i)).getTheCategory())
                                || ((WatchTimeGoal) temp.get(i)).getTheCategory().equals("ALL")) {
                            totalWT += (youtubeAPIService.getVideoLength(vid));
                        }
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                }
                ((WatchTimeGoal) temp.get(i)).setCurrentWatchTime(totalWT);
            }
            if (temp.get(i) instanceof QualityGoal) {
                float totalWatch = 0.0f;
                float totalAvoid = 0.0f;
                for (String vid : vids) {
                    try {
                        if (matches[Integer.parseInt(youtubeAPIService.getVideoCategoryID(vid))-1].equalsIgnoreCase(((QualityGoal) temp.get(i)).getCategoryToAvoid())
                                || ((QualityGoal) temp.get(i)).getCategoryToAvoid().equals("ALL")) {
                            totalAvoid += youtubeAPIService.getVideoLength(vid);
                        }
                        if (matches[Integer.parseInt(youtubeAPIService.getVideoCategoryID(vid))-1].equalsIgnoreCase(((QualityGoal) temp.get(i)).getCategoryToWatch())
                                || ((QualityGoal) temp.get(i)).getCategoryToWatch().equals("ALL")) {
                            totalWatch += youtubeAPIService.getVideoLength(vid);
                        }
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                    ((QualityGoal) temp.get(i)).setProgressAvoid(totalAvoid);
                    ((QualityGoal) temp.get(i)).setProgressWatch(totalWatch);
                }
            }
            temp.get(i).computeProgress();
        }
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