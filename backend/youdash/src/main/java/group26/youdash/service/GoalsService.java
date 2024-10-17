package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import group26.youdash.classes.Goal;
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
            for (Goal goal : goals) {
                if (goal instanceof WatchTimeGoal) {
                    wtgoals.add((WatchTimeGoal) goal);
                }
                if (goal instanceof QualityGoal) {
                    qgoals.add((QualityGoal) goal);
                }
            }
            user.setWtgoals(wtgoals);
            user.setQgoals(qgoals);
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

}
