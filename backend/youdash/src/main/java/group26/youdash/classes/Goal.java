package group26.youdash.classes;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;


//https://stackoverflow.com/questions/30362446/deserialize-json-with-jackson-into-polymorphic-types-a-complete-example-is-giv
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "@type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = WatchTimeGoal.class, name = "WatchTimeGoal"),
        @JsonSubTypes.Type(value = QualityGoal.class, name = "QualityGoal")
    }
)
@DynamoDBTable(tableName = "Goals")
public abstract class Goal {
    private String goalId;
    private String goalName;
    private String goalDescription;
    private float goalProgress;
    private String userID;

    public Goal() {} // Default constructor for DynamoDB

    public Goal(String goalName, String goalDescription, float goalProgress, String userID) {
        this.goalName = goalName;
        this.goalDescription = goalDescription;
        this.goalProgress = goalProgress;
        this.userID = userID;
    }

    @DynamoDBHashKey(attributeName = "goalId")
    @DynamoDBAutoGeneratedKey 
    public String getGoalId() {
        return goalId;
    }
    public void setGoalId(String goalId) {
        this.goalId = goalId;
    }

    @DynamoDBAttribute(attributeName = "goalName")
    public String getGoalName() {
        return goalName;
    }
    public void setGoalName(String goalName) {
        this.goalName = goalName;
    }

    @DynamoDBAttribute(attributeName = "goalDescription")
    public String getGoalDescription() {
        return goalDescription;
    }
    public void setGoalDescription(String goalDescription) {
        this.goalDescription = goalDescription;
    }

    @DynamoDBAttribute(attributeName = "goalProgress")
    public float getGoalProgress() {
        return goalProgress;
    }
    public void setGoalProgress(float goalProgress) {
        this.goalProgress = goalProgress;
    }

    @DynamoDBIndexHashKey(globalSecondaryIndexName = "userID-index")
    public String getUserID() {
        return userID;
    }
    public void setUserID(String userID) {
        this.userID = userID;
    }

    @Override
    public String toString() {
        return "Goal Name: " + goalName + ", Goal Description: " + goalDescription + ", Goal Progress: " + goalProgress + ", User ID: " + userID;
    }

    public abstract float computeProgress();

}