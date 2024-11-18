package group26.youdash.classes;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAutoGeneratedKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "messages")
public class Messages {
    String messageId;
    int userId;
    String messageText;
    String timeStamp;
    boolean isYoutube;
    Integer videoTimestamp;
   
     int upvotes;


     int downvotes;

   
    private Map<String, String> userVotes; // Map of userId -> "upvote" or "downvote"

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public Messages() {
    }

    public Messages(String messageId, int userId, String messageText, String timeStamp) {
        this.messageId = messageId;
        this.userId = userId;
        this.messageText = messageText;
        this.timeStamp = timeStamp;
    }

    @DynamoDBHashKey(attributeName = "message_id")
    @DynamoDBAutoGeneratedKey
    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    @DynamoDBAttribute(attributeName = "message_text")
    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    @DynamoDBAttribute(attributeName = "timestamp")
    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timestamp) {
        this.timeStamp = timestamp;
    }

    @DynamoDBAttribute(attributeName = "user_id")
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @DynamoDBAttribute(attributeName = "is_youtube")
    public boolean getIsYouTube() {
        return isYoutube;
    }

    public void setIsYouTube(boolean isYoutube) {
        this.isYoutube = isYoutube;
    }

    @DynamoDBAttribute(attributeName = "video_timestamp")
    public Integer getVideoTimestamp() {
        return videoTimestamp;
    }

    public void setVideoTimestamp(Integer videoTimestamp) {
        this.videoTimestamp = videoTimestamp;
    }

    @DynamoDBAttribute(attributeName = "upvotes")
    public int getUpvotes() {
        return upvotes;
    }

    public void setUpvotes(int upvotes) {
        this.upvotes = upvotes;
    }

    @DynamoDBAttribute(attributeName = "downvotes")
    public int getDownvotes() {
        return downvotes;
    }

    public void setDownvotes(int downvotes) {
        this.downvotes = downvotes;
    }

    @DynamoDBAttribute(attributeName = "user_votes")
    public Map<String, String> getUserVotes() {
        return userVotes;
    }

    public void setUserVotes(Map<String, String> userVotes) {
        this.userVotes = userVotes;
    }

}
