package group26.youdash.classes;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonTypeName("WatchTimeGoal")
public class WatchTimeGoal extends Goal {

    //This describes the category the goal is measuring
    private Categories category;

    //this describes the current watchtime of the category
    private float currentWatchTime;

    //This describes the goal time to meet or be lower than
    private int goalWatchTime;

    //This describes whether the user is aiming to exceed or be lower than goal
    private boolean watchLessThanGoal;

    public WatchTimeGoal () {} //default constructor

    public WatchTimeGoal(String goalName, String goalDescription, String userID,
                         Categories category, int goalWatchTime, boolean watchLessThanGoal) {
        super(goalName, goalDescription, 0.0f, userID);
        this.category = category;
        this.currentWatchTime = computeCurrentWatchTime();
        this.goalWatchTime = goalWatchTime;
        this.watchLessThanGoal = watchLessThanGoal;
        computeGoalProgress();
    }

    public void setCategory(Categories category) {
        this.category = category;
    }

    public void setCurrentWatchTime(int currentWatchTime) {
        this.currentWatchTime = currentWatchTime;
    }

    public void setGoalWatchTime(int goalWatchTime) {
        this.goalWatchTime = goalWatchTime;
    }

    public void setWatchLessThanGoal(boolean watchLessThanGoal) {
        this.watchLessThanGoal = watchLessThanGoal;
    }

    @DynamoDBAttribute(attributeName = "category")
    public Categories getCategory() {
        return category;
    }

    @DynamoDBAttribute(attributeName = "currentWatchTime")
    public float getCurrentWatchTime() {
        return currentWatchTime;
    }

    @DynamoDBAttribute(attributeName = "goalWatchTime")
    public int getGoalWatchTime() {
        return goalWatchTime;
    }

    @DynamoDBAttribute(attributeName = "watchLessThanGoal")
    public boolean isWatchLessThanGoal() {
        return watchLessThanGoal;
    }

    //this computes the current goal progress as a float percentage
    public float computeGoalProgress() {
        computeCurrentWatchTime();
        float progress = currentWatchTime / goalWatchTime;
        setGoalProgress(progress);
        return progress;
    }

    //this grabs the current user watchtime of "category" from database
    public float computeCurrentWatchTime() {
        //calculate from videos in database
        return 0.0f;
    }

    @Override
    public String toString() {
        return "WatchTimeGoal: " + super.toString() +
                ", category: " + category +
                ", currentWatchTime: " + currentWatchTime +
                ", goalWatchTime: " + goalWatchTime +
                ", watchLessThanGoal: " + watchLessThanGoal;
    }
}
