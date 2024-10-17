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
@JsonTypeName("TimeOfDayGoal")
@DynamoDBTable(tableName = "todgoals")
public class TimeOfDayGoal extends Goal{

    //time to watch
    public int startWatchHour;
    public int startWatchMinute;
    public int endWatchHour;
    public int endWatchMinute;
    //time to avoid, can be all other than above
    public int startAvoidHour;
    public int startAvoidMinute;
    public int endAvoidHour;
    public int endAvoidMinute;

    // multiplier
    public float multiplier;

    //optional categories
    public String categoryWatch;
    public String categoryAvoid;

    public TimeOfDayGoal(){};

    public TimeOfDayGoal(String goalName, String goalDescription, String userID,
                         int startWatchHour, int startWatchMinute, int endWatchHour, int endWatchMinute,
                         int startAvoidHour, int startAvoidMinute, int endAvoidHour, int endAvoidMinute,
                         float multiplier, String categoryWatch, String categoryAvoid) {
        super(goalName, goalDescription, 0.0f, userID);
        this.startWatchHour = startWatchHour;
        this.startWatchMinute = startWatchMinute;
        this.endWatchHour = endWatchHour;
        this.endWatchMinute = endWatchMinute;
        this.startAvoidHour = startAvoidHour;
        this.startAvoidMinute = startAvoidMinute;
        this.endAvoidHour = endAvoidHour;
        this.endAvoidMinute = endAvoidMinute;
        this.multiplier = multiplier;
        this.categoryWatch = categoryWatch;
        this.categoryAvoid = categoryAvoid;

    }

    @DynamoDBAttribute(attributeName = "startWatchHour")
    public int getStartWatchHour() {
        return startWatchHour;
    }

    public void setStartWatchHour(int startWatchHour) {
        this.startWatchHour = startWatchHour;
    }

    @DynamoDBAttribute(attributeName = "startWatchMinute")
    public int getStartWatchMinute() {
        return startWatchMinute;
    }

    public void setStartWatchMinute(int startWatchMinute) {
        this.startWatchMinute = startWatchMinute;
    }

    @DynamoDBAttribute(attributeName = "endWatchMinute")
    public int getEndWatchMinute() {
        return endWatchMinute;
    }

    public void setEndWatchMinute(int endWatchMinute) {
        this.endWatchMinute = endWatchMinute;
    }

    @DynamoDBAttribute(attributeName = "endWatchHour")
    public int getEndWatchHour() {
        return endWatchHour;
    }

    public void setEndWatchHour(int endWatchHour) {
        this.endWatchHour = endWatchHour;
    }

    @DynamoDBAttribute(attributeName = "startAvoidHour")
    public int getStartAvoidHour() {
        return startAvoidHour;
    }

    public void setStartAvoidHour(int startAvoidHour) {
        this.startAvoidHour = startAvoidHour;
    }

    @DynamoDBAttribute(attributeName = "startAvoidMinute")
    public int getStartAvoidMinute() {
        return startAvoidMinute;
    }

    public void setStartAvoidMinute(int startAvoidMinute) {
        this.startAvoidMinute = startAvoidMinute;
    }

    @DynamoDBAttribute(attributeName = "endAvoidHour")
    public int getEndAvoidHour() {
        return endAvoidHour;
    }

    public void setEndAvoidHour(int endAvoidHour) {
        this.endAvoidHour = endAvoidHour;
    }

    @DynamoDBAttribute(attributeName = "endAvoidMinute")
    public int getEndAvoidMinute() {
        return endAvoidMinute;
    }

    public void setEndAvoidMinute(int endAvoidMinute) {
        this.endAvoidMinute = endAvoidMinute;
    }

    @DynamoDBAttribute(attributeName = "multiplier")
    public float getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(float multiplier) {
        this.multiplier = multiplier;
    }

    @DynamoDBAttribute(attributeName = "categoryWatch")
    public String getCategoryWatch() {
        return categoryWatch;
    }

    public void setCategoryWatch(String categoryWatch) {
        this.categoryWatch = categoryWatch;
    }

    @DynamoDBAttribute(attributeName = "categoryAvoid")
    public String getCategoryAvoid() {
        return categoryAvoid;
    }

    public void setCategoryAvoid(String categoryAvoid) {
        this.categoryAvoid = categoryAvoid;
    }

    @Override
    public float computeProgress() {
        return 0;
    }

    @Override
    public String toString() {
        return "TimeOfDayGoal{" +
                "startWatchHour=" + startWatchHour +
                ", startWatchMinute=" + startWatchMinute +
                ", endWatchHour=" + endWatchHour +
                ", endWatchMinute=" + endWatchMinute +
                ", startAvoidHour=" + startAvoidHour +
                ", startAvoidMinute=" + startAvoidMinute +
                ", endAvoidHour=" + endAvoidHour +
                ", endAvoidMinute=" + endAvoidMinute +
                ", multiplier=" + multiplier +
                ", categoryWatch=" + categoryWatch +
                ", categoryAvoid=" + categoryAvoid +
                '}';
    }
}
