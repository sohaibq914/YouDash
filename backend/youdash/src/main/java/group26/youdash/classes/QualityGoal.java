package group26.youdash.classes;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import group26.youdash.classes.Categories;
import group26.youdash.classes.Goal;
import group26.youdash.model.User;
import group26.youdash.service.YoutubeAPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "@type")
@JsonTypeName("QualityGoal")
@DynamoDBTable(tableName = "qgoals")
public class QualityGoal extends Goal {


    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public String categoryToWatch;
    public float progressWatch;
    public String categoryToAvoid;


    public float progressAvoid;
    public float multiplier;

    public QualityGoal () {} //default constructor

    public QualityGoal(String goalName, String goalDescription, String userID,
                       String categoryToWatch, String categoryToAvoid, float multiplier) {
        super(goalName, goalDescription, 0.0f, userID);
        this.categoryToWatch = categoryToWatch;
        this.categoryToAvoid = categoryToAvoid;
        this.multiplier = multiplier;
        computeProgress();
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

    @Override
    public String toString() {
        return "QualityGoal: " + super.toString() +
                ", categoryToAvoid: " + categoryToAvoid +
                ", categoryToWatch: " + categoryToWatch +
                ", multiplier: " + multiplier;
    }

    public float computeProgress() {
        if (progressAvoid == 0.0f) {
            setGoalProgress(1);
        } else if (progressWatch == 0.0f) {
            setGoalProgress(0);
        } else {
            setGoalProgress(progressWatch / (progressAvoid * multiplier));
        }
        return getGoalProgress();
    }


    public void setProgressWatch(float progressWatch) {
        this.progressWatch = progressWatch;
    }

    public void setProgressAvoid(float progressAvoid) {
        this.progressAvoid = progressAvoid;
    }

    public float getProgressWatch() {
        return progressWatch;
    }

    public float getProgressAvoid() {
        return progressAvoid;
    }
}
