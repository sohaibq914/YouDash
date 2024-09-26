package group26.youdash.classes;

public class Goal {
    private String goalName;
    private String goalDescription;
    private float goalProgress;
    private String userID;

    //add field later for other users doing same goal?


    public Goal(String goalName, String goalDescription, float goalProgress, String userID) {
        this.goalName = goalName;
        this.goalDescription = goalDescription;
        this.goalProgress = goalProgress;
        this.userID = userID;
    }

    public String getGoalName() {
        return goalName;
    }

    public String getGoalDescription() {
        return goalDescription;
    }

    public float getGoalProgress() {
        return goalProgress;
    }

    public String getUserID() {
        return userID;
    }

    public void setGoalName(String goalName) {
        this.goalName = goalName;
    }

    public void setGoalDescription(String goalDescription) {
        this.goalDescription = goalDescription;
    }

    public void setGoalProgress(float goalProgress) {
        this.goalProgress = goalProgress;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }
}
