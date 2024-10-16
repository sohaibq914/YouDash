package group26.youdash.classes.YoutubeAPI;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.time.LocalDateTime;

@DynamoDBTable(tableName = "History")
public class VideoHistory {
    String url;
    float duration;
    LocalDateTime timeStamp;
    String videoName;
    int category;

    public VideoHistory(String url, float duration, String videoName, int category) {
        this.url = url;
        this.duration = duration;
        this.videoName = videoName;
        this.timeStamp = LocalDateTime.now();
        this.category = category;
    }

    @DynamoDBAttribute(attributeName = "url")
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @DynamoDBAttribute(attributeName = "duration")
    public float getDuration() {
        return duration;
    }

    public void setDuration(float duration) {
        this.duration = duration;
    }

    @DynamoDBAttribute(attributeName = "category")
    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    @DynamoDBAttribute(attributeName = "timeStamp")
    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    @DynamoDBAttribute(attributeName = "videoName")
    public String getVideoName() {
        return videoName;
    }

    public void setVideoName(String videoName) {
        this.videoName = videoName;
    }
}
