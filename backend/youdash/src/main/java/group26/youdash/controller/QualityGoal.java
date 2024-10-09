package group26.youdash.controller;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import group26.youdash.classes.Categories;
import group26.youdash.classes.Goal;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonTypeName("QualityGoal")
public class QualityGoal extends Goal {
    private Categories categoryToWatch;
    private Categories categoryToAvoid;

    private float multiplier;

    private QualityGoal () {} //default constructor

    public QualityGoal(String goalName, String goalDescription, float goalProgress, String userID,
                       Categories categoryToWatch, Categories categoryToAvoid, float multiplier) {
        super(goalName, goalDescription, goalProgress, userID);
        this.categoryToWatch = categoryToWatch;
        this.categoryToAvoid = categoryToAvoid;
        this.multiplier = multiplier;
    }

    public void setCategoryToWatch(Categories categoryToWatch) {
        this.categoryToWatch = categoryToWatch;
    }

    public void setCategoryToAvoid(Categories categoryToAvoid) {
        this.categoryToAvoid = categoryToAvoid;
    }

    public void setMultiplier(float multiplier) {
        this.multiplier = multiplier;
    }

    @DynamoDBAttribute(attributeName = "categoryToWatch")
    public Categories getCategoryToWatch() {
        return categoryToWatch;
    }

    @DynamoDBAttribute(attributeName = "categoryToAvoid")
    public Categories getCategoryToAvoid() {
        return categoryToAvoid;
    }

    @DynamoDBAttribute(attributeName = "multiplier")
    public float getMultiplier() {
        return multiplier;
    }
}
