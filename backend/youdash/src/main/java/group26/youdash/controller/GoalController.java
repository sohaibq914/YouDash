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
import group26.youdash.model.User;  // Import User model


import java.time.LocalDateTime;
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
        //System.out.println((TimeOfDayGoal)goal);
        //System.out.println((QualityGoal) goal);

        int userId = 11111;
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
    public ArrayList<Goal> viewGoal(@PathVariable("user") String user) {
        System.out.println(user);
        ArrayList<Goal> temp1 = new ArrayList<>();
        int userId = user.equals("") ? 12345 : Integer.parseInt(user);
        System.out.println("YESSS :" + userId);
        
        // Fetch goals from DynamoDB if temp is empty
        if (temp1.isEmpty()) {
            System.out.println("SLDJFL:SDJFLk;SJDFL:FJ:S");
            temp1.addAll(gs.getGoalsByUserId(userId));  // Directly add to the class-level temp
            // System.out.println("YOOOO" + temp);
        }
    
        updateAllGoalsProgress(userId); // Update progress based on user activity
        // System.out.println("TEMP " + temp);
    
        return temp1;
    }

    @GetMapping("/{user}/pie")
    public float pieGoal(@PathVariable("user") String user)
    {
        System.out.println(user);
        int userId;
        if (user.equals("")) {
            userId = 12345;
        } else {
            userId = Integer.parseInt(user);
        }
        updateAllGoalsProgress(userId);
        int numGoals = temp.size();
        float progress = 0.0f;
        for (int i = 0; i < numGoals; i++) {
            if (temp.get(i) instanceof WatchTimeGoal && ((WatchTimeGoal) temp.get(i)).watchLessThanGoal) {
                progress += 1 - temp.get(i).getGoalProgress();
            } else {
                progress += temp.get(i).getGoalProgress();
            }
        }
        return progress / numGoals;
    }

    private void updateAllGoalsProgress(int userId) {
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
            if (temp.get(i) instanceof TimeOfDayGoal) {
                try {
                    System.out.println("Time of day goal!");
                    float goodTime =0.0f;
                    float badTime = 0.0f;
                    for (int d = 1; d <= 7; d++) {
                        LocalDateTime start = LocalDateTime.now();
                        LocalDateTime end = LocalDateTime.now();
                        if (start.getMinute() > ((TimeOfDayGoal) temp.get(i)).getStartWatchMinute() && start.getHour() > ((TimeOfDayGoal) temp.get(i)).getStartWatchHour()) {
                            start = start.minusDays(d-1);
                            end = end.minusDays(d-1);
                        } else {
                            start = start.minusDays(d);
                            end = end.minusDays(d);
                        }
                        start = start.withMinute(((TimeOfDayGoal) temp.get(i)).startWatchMinute);
                        start = start.withHour(((TimeOfDayGoal) temp.get(i)).startWatchHour);
                        start = start.withSecond(0);

                        end = end.withMinute(((TimeOfDayGoal) temp.get(i)).endWatchMinute);
                        end = end.withHour(((TimeOfDayGoal) temp.get(i)).endWatchHour);
                        end = end.withSecond(0);

                        LocalDateTime starta = LocalDateTime.now();
                        LocalDateTime enda = LocalDateTime.now();
                        if (starta.getMinute() > ((TimeOfDayGoal) temp.get(i)).getStartAvoidMinute() && starta.getHour() > ((TimeOfDayGoal) temp.get(i)).getStartAvoidHour()) {
                            starta = starta.minusDays(d-1);
                            enda = enda.minusDays(d-1);
                        } else {
                            starta = starta.minusDays(d);
                            enda = enda.minusDays(d);
                        }
                        starta = starta.withMinute(((TimeOfDayGoal) temp.get(i)).startAvoidMinute);
                        starta = starta.withHour(((TimeOfDayGoal) temp.get(i)).startAvoidHour);
                        starta = starta.withSecond(0);

                        enda = enda.withMinute(((TimeOfDayGoal) temp.get(i)).endAvoidMinute);
                        enda = enda.withHour(((TimeOfDayGoal) temp.get(i)).endAvoidHour);
                        enda = enda.withSecond(0);
                        System.out.println(start + "\n" + end);
                        if (((TimeOfDayGoal) temp.get(i)).getCategoryWatch().equals("ALL")) {
                            goodTime += whs.getWatchTimeByCustomTime(userId, start, end);
                        } else {
                            goodTime += whs.getWatchTimeByCategoryAndCustomTime(userId, matches.indexOf(((TimeOfDayGoal) temp.get(i)).getCategoryWatch()) + 1, start, end);
                        }
                        if (((TimeOfDayGoal) temp.get(i)).getCategoryAvoid().equals("ALL")) {
                            badTime += whs.getWatchTimeByCustomTime(userId, starta, enda);
                        } else {
                            badTime += whs.getWatchTimeByCategoryAndCustomTime(userId, matches.indexOf(((TimeOfDayGoal) temp.get(i)).getCategoryAvoid()) + 1, starta, enda);
                        }

                    }

                    ((TimeOfDayGoal) temp.get(i)).setBadTime(badTime);
                    ((TimeOfDayGoal) temp.get(i)).setGoodTime(goodTime);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
            temp.get(i).computeProgress();
        }
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


    @GetMapping("/{user}/recommended-similar-goals")
public ResponseEntity<List<User>> getUsersWithSimilarCategoryGoals(@PathVariable("user") int userId) {
    try {
        List<User> recommendedUsers = gs.getUsersWithSimilarCategoryGoals(userId);
        return new ResponseEntity<>(recommendedUsers, HttpStatus.OK);
    } catch (NoSuchElementException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}


@GetMapping("/{userId}/users-with-similar-goal-types")
public ResponseEntity<List<User>> getUsersWithSimilarGoalTypes(@PathVariable int userId) {
    try {
        List<User> recommendedUsers = gs.getUsersWithSimilarGoalTypes(userId);
        return new ResponseEntity<>(recommendedUsers, HttpStatus.OK);
    } catch (NoSuchElementException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}






}