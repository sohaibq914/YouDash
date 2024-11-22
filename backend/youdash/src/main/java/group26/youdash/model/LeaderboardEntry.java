package group26.youdash.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class LeaderboardEntry {
   private Integer userId;
   private String username;
   private Double watchTime;
   private Double targetHours;
   private Double percentageComplete;
   private Integer rank;
   private Long lastUpdated;

   // Default constructor
   public LeaderboardEntry() {}

   // Constructor with all fields
   public LeaderboardEntry(Integer userId, String username, Double watchTime, Double targetHours, 
                         Double percentageComplete, Integer rank, Long lastUpdated) {
       this.userId = userId;
       this.username = username;
       this.watchTime = watchTime;
       this.targetHours = targetHours;
       this.percentageComplete = percentageComplete;
       this.rank = rank;
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
   public String getUsername() {
       return username;
   }

   public void setUsername(String username) {
       this.username = username;
   }

   @DynamoDBAttribute
   public Double getWatchTime() {
       return watchTime;
   }

   public void setWatchTime(Double watchTime) {
       this.watchTime = watchTime;
   }

   @DynamoDBAttribute
   public Double getTargetHours() {
       return targetHours;
   }

   public void setTargetHours(Double targetHours) {
       this.targetHours = targetHours;
   }

   @DynamoDBAttribute
   public Double getPercentageComplete() {
       return percentageComplete;
   }

   public void setPercentageComplete(Double percentageComplete) {
       this.percentageComplete = percentageComplete;
   }

   @DynamoDBAttribute
   public Integer getRank() {
       return rank;
   }

   public void setRank(Integer rank) {
       this.rank = rank;
   }

   @DynamoDBAttribute
   public Long getLastUpdated() {
       return lastUpdated;
   }

   public void setLastUpdated(Long lastUpdated) {
       this.lastUpdated = lastUpdated;
   }
}
