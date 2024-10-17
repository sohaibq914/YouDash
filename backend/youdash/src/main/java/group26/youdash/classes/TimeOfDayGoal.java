package group26.youdash.classes;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import group26.youdash.model.User;
import group26.youdash.service.YoutubeAPIService;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonTypeName("TimeOfDayGoal")
@DynamoDBTable(tableName = "todgoals")
public class TimeOfDayGoal extends Goal{

    //time to watch
    public LocalDateTime startWatch;
    public LocalDateTime endWatch;
    //time to avoid, can be all other than above
    public LocalDateTime startAvoid;
    public LocalDateTime endAvoid;

    // multiplier
    float multiplier;

    //optional categories
    int categoryWatch;
    int categoryAvoid;

    public TimeOfDayGoal(){};

    public TimeOfDayGoal(String goalName, String goalDescription, float goalProgress, String userID,
                         LocalDateTime startWatch, LocalDateTime endWatch, LocalDateTime startAvoid,
                         LocalDateTime endAvoid, float multiplier, int categoryWatch, int categoryAvoid) {
        super(goalName, goalDescription, goalProgress, userID);
        this.startWatch = startWatch;
        this.endWatch = endWatch;
        this.startAvoid = startAvoid;
        this.endAvoid = endAvoid;
        this.multiplier = multiplier;
        this.categoryWatch = categoryWatch;
        this.categoryAvoid = categoryAvoid;
    }

    @DynamoDBAttribute(attributeName = "startWatch")
    public LocalDateTime getStartWatch() {
        return startWatch;
    }

    public void setStartWatch(LocalDateTime startWatch) {
        this.startWatch = startWatch;
    }

    @DynamoDBAttribute(attributeName = "endWatch")
    public LocalDateTime getEndWatch() {
        return endWatch;
    }

    public void setEndWatch(LocalDateTime endWatch) {
        this.endWatch = endWatch;
    }

    @DynamoDBAttribute(attributeName = "startAvoid")
    public LocalDateTime getStartAvoid() {
        return startAvoid;
    }

    public void setStartAvoid(LocalDateTime startAvoid) {
        this.startAvoid = startAvoid;
    }

    @DynamoDBAttribute(attributeName = "endAvoid")
    public LocalDateTime getEndAvoid() {
        return endAvoid;
    }

    public void setEndAvoid(LocalDateTime endAvoid) {
        this.endAvoid = endAvoid;
    }

    @DynamoDBAttribute(attributeName = "multiplier")
    public float getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(float multiplier) {
        this.multiplier = multiplier;
    }

    @DynamoDBAttribute(attributeName = "categoryWatch")
    public int getCategoryWatch() {
        return categoryWatch;
    }

    public void setCategoryWatch(int categoryWatch) {
        this.categoryWatch = categoryWatch;
    }

    @DynamoDBAttribute(attributeName = "categoryAvoid")
    public int getCategoryAvoid() {
        return categoryAvoid;
    }

    public void setCategoryAvoid(int categoryAvoid) {
        this.categoryAvoid = categoryAvoid;
    }

    @Override
    public float computeProgress() {
        return 0;
    }
}
