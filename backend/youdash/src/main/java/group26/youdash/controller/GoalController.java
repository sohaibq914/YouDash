package group26.youdash.controller;


import group26.youdash.classes.Goal;
import group26.youdash.classes.QualityGoal;
import group26.youdash.classes.TimeOfDayGoal;
import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.service.GoalsService;
import group26.youdash.service.UserService;
import group26.youdash.service.WatchHistoryService;
import group26.youdash.service.YoutubeAPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static org.springframework.data.repository.init.ResourceReader.Type.JSON;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:3000")  // Allow React app to access this API
public class GoalController {


    @Autowired
    private WatchHistoryService whs;

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
        System.out.println((TimeOfDayGoal)goal);
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
    ArrayList<String> matches = new ArrayList<>(Arrays.asList(
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
    ));
    @GetMapping("/{user}/view")
    public ArrayList<Goal> viewGoal(@PathVariable("user") String user)
    {
        System.out.println(user);
        int userId;
        if (user.equals("")) {
            userId = 12345;
        } else {
            userId = Integer.parseInt(user);
        }
        //whs.addVideo(userId, "https://www.youtube.com/watch?v=AqvyzO3IPXc");
        //ArrayList<String> vids = (ArrayList<String>) us.getUserHistory(userId);
        for(int i = 0; i < temp.size(); i++) {
            if (temp.get(i) instanceof WatchTimeGoal) {
                try {
                    if (((WatchTimeGoal) temp.get(i)).getTheCategory().equals("ALL")) {
                        ((WatchTimeGoal) temp.get(i)).setCurrentWatchTime(whs.getWatchTimeTotal(userId));
                    } else {
                        ((WatchTimeGoal) temp.get(i)).setCurrentWatchTime(whs.getWatchTimeByCategory(userId, matches.indexOf((String)((WatchTimeGoal) temp.get(i)).getTheCategory())+1));
                    }
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
            if (temp.get(i) instanceof QualityGoal) {
                try {
                    if (((QualityGoal) temp.get(i)).getCategoryToAvoid().equals("ALL")) {
                        ((QualityGoal) temp.get(i)).setProgressAvoid(whs.getWatchTimeTotal(userId));
                    } else {
                        ((QualityGoal) temp.get(i)).setProgressAvoid(whs.getWatchTimeByCategory(userId, matches.indexOf(((QualityGoal) temp.get(i)).getCategoryToAvoid())+1));
                    }
                    if (((QualityGoal) temp.get(i)).getCategoryToWatch().equals("ALL")) {
                        ((QualityGoal) temp.get(i)).setProgressWatch(whs.getWatchTimeTotal(userId));
                    } else {
                        ((QualityGoal) temp.get(i)).setProgressWatch(whs.getWatchTimeByCategory(userId, matches.indexOf(((QualityGoal) temp.get(i)).getCategoryToWatch())+1));
                    }
                } catch (Exception e) {
                    System.out.println(e.getMessage());
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