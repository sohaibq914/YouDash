package group26.youdash.model;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class FollowRequest {
    private int requesterId;
    private String requesterName;
    private long requestDate;
    private String status; // "PENDING", "ACCEPTED", "REJECTED"
    
    public FollowRequest() {}
    
    public FollowRequest(int requesterId, String requesterName) {
        this.requesterId = requesterId;
        this.requesterName = requesterName;
        this.requestDate = System.currentTimeMillis();
        this.status = "PENDING";
    }
    
    @DynamoDBAttribute
    public int getRequesterId() {
        return requesterId;
    }
    
    public void setRequesterId(int requesterId) {
        this.requesterId = requesterId;
    }
    
    @DynamoDBAttribute
    public String getRequesterName() {
        return requesterName;
    }
    
    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }
    
    @DynamoDBAttribute
    public long getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(long requestDate) {
        this.requestDate = requestDate;
    }

    @DynamoDBAttribute
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
