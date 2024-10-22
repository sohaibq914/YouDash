package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import group26.youdash.classes.Goal;
import group26.youdash.classes.TimeOfDayGoal;
import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.classes.QualityGoal;
import group26.youdash.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class GoalsService {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public void uploadGoalList(int userId, ArrayList<Goal> goals) {
        User user = dynamoDBMapper.load(User.class, userId);

        if (user != null) {
            ArrayList<WatchTimeGoal> wtgoals = new ArrayList<>();
            ArrayList<QualityGoal> qgoals = new ArrayList<>();
            ArrayList<TimeOfDayGoal> todgoals = new ArrayList<>();
            for (Goal goal : goals) {
                if (goal instanceof WatchTimeGoal) {
                    wtgoals.add((WatchTimeGoal) goal);
                }
                if (goal instanceof QualityGoal) {
                    qgoals.add((QualityGoal) goal);
                }
                if (goal instanceof TimeOfDayGoal) {
                    todgoals.add((TimeOfDayGoal) goal);
                }
            }
            user.setWtgoals(wtgoals);
            user.setQgoals(qgoals);
            user.setTodgoals(todgoals);
            //all error handling done in backend, will just be list of goals
            dynamoDBMapper.save(user);
        } else {
            throw new NoSuchElementException("User ID : " + userId + " not found");
        }
    }



    public List<WatchTimeGoal> getUserGoals(int userId) {
        User user = dynamoDBMapper.load(User.class, userId);
        return user != null ? user.getWtgoals(): new ArrayList<>();
    }

        // Get all goals (WatchTimeGoal, QualityGoal, TimeOfDayGoal) for a user
        public List<Goal> getGoalsByUserId(int userId) {
            User user = dynamoDBMapper.load(User.class, userId);
    
            if (user == null) {
                throw new NoSuchElementException("User ID : " + userId + " not found");
            }
    
            // Combine all goals into a single list
            List<Goal> allGoals = new ArrayList<>();
            
            if (user.getWtgoals() != null) {
                allGoals.addAll(user.getWtgoals());
            }
            if (user.getQgoals() != null) {
                allGoals.addAll(user.getQgoals());
            }
            if (user.getTodgoals() != null) {
                allGoals.addAll(user.getTodgoals());
            }
    
            return allGoals;
        }

    

}
