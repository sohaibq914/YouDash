

package group26.youdash.service;
import group26.youdash.model.DirectMessage;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DirectMessageService {
    private static final Logger logger = LoggerFactory.getLogger(DirectMessageService.class);
    private final DynamoDBMapper dynamoDBMapper;

    @Autowired
    public DirectMessageService(DynamoDBMapper dynamoDBMapper) {
        this.dynamoDBMapper = dynamoDBMapper;
    }

    public DirectMessage saveMessage(DirectMessage message) {
        try {
            logger.info("Saving message from user {} to user {}", message.getSenderId(), message.getReceiverId());
            if (message.getTimestamp() == null) {
                message.setTimestamp(new Date());
            }
            dynamoDBMapper.save(message);
            return message;
        } catch (Exception e) {
            logger.error("Error saving message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save message", e);
        }
    }

    public List<DirectMessage> getMessageHistory(int userId1, int userId2) {
        try {
            logger.info("Fetching message history between users {} and {}", userId1, userId2);
            
            // Get messages where userId1 is sender and userId2 is receiver
            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
            List<DirectMessage> allMessages = dynamoDBMapper.scan(DirectMessage.class, scanExpression);
            
            List<DirectMessage> conversation = allMessages.stream()
                .filter(msg -> (msg.getSenderId() == userId1 && msg.getReceiverId() == userId2) || 
                             (msg.getSenderId() == userId2 && msg.getReceiverId() == userId1))
                .sorted(Comparator.comparing(DirectMessage::getTimestamp))
                .collect(Collectors.toList());
            
            logger.info("Found {} messages between users {} and {}", conversation.size(), userId1, userId2);
            return conversation;
        } catch (Exception e) {
            logger.error("Error fetching message history: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch message history", e);
        }
    }

    public List<Integer> getConversationsForUser(int userId) {
        try {
            logger.info("Fetching conversations for user {}", userId);
            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
            List<DirectMessage> allMessages = dynamoDBMapper.scan(DirectMessage.class, scanExpression);
            
            Set<Integer> conversationPartners = new HashSet<>();
            
            for (DirectMessage message : allMessages) {
                if (message.getSenderId() == userId) {
                    conversationPartners.add(message.getReceiverId());
                } else if (message.getReceiverId() == userId) {
                    conversationPartners.add(message.getSenderId());
                }
            }
            
            List<Integer> result = new ArrayList<>(conversationPartners);
            logger.info("Found {} conversations for user {}", result.size(), userId);
            return result;
        } catch (Exception e) {
            logger.error("Error fetching conversations for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch conversations", e);
        }
    }

    public void deleteMessage(String messageId) {
        try {
            logger.info("Deleting message with ID: {}", messageId);
            DirectMessage message = dynamoDBMapper.load(DirectMessage.class, messageId);
            if (message != null) {
                dynamoDBMapper.delete(message);
                logger.info("Successfully deleted message {}", messageId);
            } else {
                logger.warn("Message {} not found", messageId);
                throw new RuntimeException("Message not found");
            }
        } catch (Exception e) {
            logger.error("Error deleting message {}: {}", messageId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete message", e);
        }
    }

    public List<DirectMessage> getRecentMessages(int userId, int limit) {
        try {
            logger.info("Fetching {} recent messages for user {}", limit, userId);
            DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
            List<DirectMessage> allMessages = dynamoDBMapper.scan(DirectMessage.class, scanExpression);
            
            return allMessages.stream()
                .filter(msg -> msg.getSenderId() == userId || msg.getReceiverId() == userId)
                .sorted(Comparator.comparing(DirectMessage::getTimestamp).reversed())
                .limit(limit)
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching recent messages for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch recent messages", e);
        }
    }

    public boolean isUserInConversation(int userId, String messageId) {
        DirectMessage message = dynamoDBMapper.load(DirectMessage.class, messageId);
        return message != null && (message.getSenderId() == userId || message.getReceiverId() == userId);
    }
}

