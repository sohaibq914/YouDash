package group26.youdash.controller;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import group26.youdash.classes.Categories;
import group26.youdash.classes.Goal;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonTypeName("QualityGoal")
@DynamoDBTable(tableName = "qgoals")
public class QualityGoal extends Goal {
    public String categoryToWatch;
    public String categoryToAvoid;

    public float multiplier;

    public QualityGoal () {} //default constructor

    public QualityGoal(String goalName, String goalDescription, float goalProgress, String userID,
                       String categoryToWatch, String categoryToAvoid, float multiplier) {
        super(goalName, goalDescription, goalProgress, userID);
        this.categoryToWatch = categoryToWatch;
        this.categoryToAvoid = categoryToAvoid;
        this.multiplier = multiplier;
    }







    @DynamoDBAttribute(attributeName = "categoryToWatch")
    public String getCategoryToWatch() {
        return categoryToWatch;
    }
    public void setCategoryToWatch(String categoryToWatch) {
        this.categoryToWatch = categoryToWatch;
    }

    @DynamoDBAttribute(attributeName = "categoryToAvoid")
    public String getCategoryToAvoid() {
        return categoryToAvoid;
    }
    public void setCategoryToAvoid(String categoryToAvoid) {
        this.categoryToAvoid = categoryToAvoid;
    }

    @DynamoDBAttribute(attributeName = "multiplier")
    public float getMultiplier() {
        return multiplier;
    }
    public void setMultiplier(float multiplier) {
        this.multiplier = multiplier;
    }
}
