package group26.youdash.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;

import group26.youdash.classes.Goal;
import group26.youdash.classes.TimeOfDayGoal;
import group26.youdash.classes.WatchTimeGoal;
import group26.youdash.classes.QualityGoal;
import group26.youdash.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

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

    public void uploadTimeFrame(int userId, int timeFrame, int timeFrameSelection) {
        User user = dynamoDBMapper.load(User.class, userId);
        user.setTimeFrame(timeFrame);
        user.setTimeFrameSelection(timeFrameSelection);
        dynamoDBMapper.save(user);
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


        // Method to get users with similar category goals
    public List<User> getUsersWithSimilarCategoryGoals(int userId) {
        User currentUser = dynamoDBMapper.load(User.class, userId);
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }

        // Retrieve all goals for the current user
        List<Goal> currentUserGoals = getGoalsByUserId(userId);
        Set<String> goalCategories = new HashSet<>();

        // Collect all unique categories from the current user's goals
        for (Goal goal : currentUserGoals) {
            if (goal instanceof WatchTimeGoal) {
                goalCategories.add(((WatchTimeGoal) goal).getTheCategory());
            } else if (goal instanceof QualityGoal) {
                goalCategories.add(((QualityGoal) goal).getCategoryToWatch());
                goalCategories.add(((QualityGoal) goal).getCategoryToAvoid());
            } else if (goal instanceof TimeOfDayGoal) {
                goalCategories.add(((TimeOfDayGoal) goal).getCategoryWatch());
                goalCategories.add(((TimeOfDayGoal) goal).getCategoryAvoid());
            }
        }

        // Scan for users with matching goal categories
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<User> allUsers = dynamoDBMapper.scan(User.class, scanExpression);

        List<User> recommendedUsers = new ArrayList<>();

        for (User user : allUsers) {
            // Skip the current user
            if (user.getId() == userId) continue;

            // Check if this user has any goal in the current user's goal categories
            List<Goal> userGoals = getGoalsByUserId(user.getId());
            for (Goal userGoal : userGoals) {
                String category = null;

                if (userGoal instanceof WatchTimeGoal) {
                    category = ((WatchTimeGoal) userGoal).getTheCategory();
                } else if (userGoal instanceof QualityGoal) {
                    category = ((QualityGoal) userGoal).getCategoryToWatch();
                } else if (userGoal instanceof TimeOfDayGoal) {
                    category = ((TimeOfDayGoal) userGoal).getCategoryWatch();
                }

                if (category != null && goalCategories.contains(category)) {
                    recommendedUsers.add(user);
                    break; // Found a match, no need to check further for this user
                }
            }
        }

        return recommendedUsers;
    }



    public List<User> getUsersWithSimilarGoalTypes(int userId) {
        User currentUser = dynamoDBMapper.load(User.class, userId);
        if (currentUser == null) {
            throw new NoSuchElementException("User not found");
        }
    
        // Get current user's goals
        List<WatchTimeGoal> currentUserWtGoals = currentUser.getWtgoals();
        List<QualityGoal> currentUserQGoals = currentUser.getQgoals();
        List<TimeOfDayGoal> currentUserTodGoals = currentUser.getTodgoals();
    
        // Track if user has each type of goal
        boolean hasWtGoals = currentUserWtGoals != null && !currentUserWtGoals.isEmpty();
        boolean hasQGoals = currentUserQGoals != null && !currentUserQGoals.isEmpty();
        boolean hasTodGoals = currentUserTodGoals != null && !currentUserTodGoals.isEmpty();
    
        // Scan all users
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<User> allUsers = dynamoDBMapper.scan(User.class, scanExpression);
        List<User> recommendedUsers = new ArrayList<>();
    
        for (User user : allUsers) {
            // Skip the current user
            if (user.getId() == userId) continue;
    
            boolean isMatch = false;
            
            // Check Watch Time Goals
            if (hasWtGoals && user.getWtgoals() != null && !user.getWtgoals().isEmpty()) {
                isMatch = true;
            }
            
            // Check Quality Goals
            if (hasQGoals && user.getQgoals() != null && !user.getQgoals().isEmpty()) {
                isMatch = true;
            }
            
            // Check Time of Day Goals
            if (hasTodGoals && user.getTodgoals() != null && !user.getTodgoals().isEmpty()) {
                isMatch = true;
            }
    
            if (isMatch) {
                recommendedUsers.add(user);
            }
        }
    
        return recommendedUsers;
    }


    

}
