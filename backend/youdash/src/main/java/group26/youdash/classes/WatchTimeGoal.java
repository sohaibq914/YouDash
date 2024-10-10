package group26.youdash.classes;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import group26.youdash.model.User;
import group26.youdash.service.YoutubeAPIService;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonTypeName("WatchTimeGoal")
@DynamoDBTable(tableName = "wtgoals")
public class WatchTimeGoal extends Goal {

    //This describes the category the goal is measuring
    public String theCategory;

    //this describes the current watchtime of the category
    public float currentWatchTime;

    //This describes the goal time to meet or be lower than
    public int goalWatchTime;

    //This describes whether the user is aiming to exceed or be lower than goal
    public boolean watchLessThanGoal;

    public WatchTimeGoal () {} //default constructor

    public WatchTimeGoal(String goalName, String goalDescription, String userID,
                         String theCategory, int goalWatchTime, boolean watchLessThanGoal) {
        super(goalName, goalDescription, 0.0f, userID);
        this.theCategory = theCategory;
        this.currentWatchTime = computeCurrentWatchTime();
        this.goalWatchTime = goalWatchTime;
        this.watchLessThanGoal = watchLessThanGoal;
        computeProgress();
    }


    @DynamoDBAttribute(attributeName = "theCategory")
    public String getTheCategory() {
        return theCategory;
    }
    public void setTheCategory(String theCategory) {
        this.theCategory = theCategory;
    }

    @DynamoDBAttribute(attributeName = "currentWatchTime")
    public float getCurrentWatchTime() {
        return currentWatchTime;
    }
    public void setCurrentWatchTime(float currentWatchTime) {
        this.currentWatchTime = currentWatchTime;
    }


    @DynamoDBAttribute(attributeName = "goalWatchTime")
    public int getGoalWatchTime() {
        return goalWatchTime;
    }
    public void setGoalWatchTime(int goalWatchTime) {
        this.goalWatchTime = goalWatchTime;
    }

    @DynamoDBAttribute(attributeName = "watchLessThanGoal")
    public boolean isWatchLessThanGoal() {
        return watchLessThanGoal;
    }
    public void setWatchLessThanGoal(boolean watchLessThanGoal) {
        this.watchLessThanGoal = watchLessThanGoal;
    }
    //this computes the current goal progress as a float percentage
    public float computeProgress() {
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
                ", category: " + theCategory +
                ", currentWatchTime: " + currentWatchTime +
                ", goalWatchTime: " + goalWatchTime +
                ", watchLessThanGoal: " + watchLessThanGoal;
    }
}
