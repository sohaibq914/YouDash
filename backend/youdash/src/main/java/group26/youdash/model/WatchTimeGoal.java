package group26.youdash.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;


@DynamoDBDocument
public class WatchTimeGoal {
    private Integer userId;
    private Double targetHours;  
    private Double currentHours;
    private Double percentageComplete;
    private Long lastUpdated;

    // No-argument constructor
    public WatchTimeGoal() {}

    // All-arguments constructor
    public WatchTimeGoal(Integer userId, Double targetHours, Double currentHours, 
                         Double percentageComplete, Long lastUpdated) {
        this.userId = userId;
        this.targetHours = targetHours;
        this.currentHours = currentHours;
        this.percentageComplete = percentageComplete;
        this.lastUpdated = lastUpdated;
    }

    @DynamoDBAttribute
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @DynamoDBAttribute
    public Double getTargetHours() {
        return targetHours;
    }

    public void setTargetHours(Double targetHours) {
        this.targetHours = targetHours;
    }

    @DynamoDBAttribute
    public Double getCurrentHours() {
        return currentHours;
    }

    public void setCurrentHours(Double currentHours) {
        this.currentHours = currentHours;
    }

    @DynamoDBAttribute
    public Double getPercentageComplete() {
        return percentageComplete;
    }

    public void setPercentageComplete(Double percentageComplete) {
        this.percentageComplete = percentageComplete;
    }

    @DynamoDBAttribute
    public Long getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Long lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
