package group26.youdash.controller;

import group26.youdash.model.DirectMessage;
import group26.youdash.service.DirectMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/direct-messages")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "chrome-extension://pcfljeghhkdmleihaobbdhkphdonijdm"
})
public class DirectMessageController {
    
    private static final Logger logger = LoggerFactory.getLogger(DirectMessageController.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final DirectMessageService messageService;

    @Autowired
    public DirectMessageController(SimpMessagingTemplate messagingTemplate, DirectMessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/dm/{userId}")
    public void handleDirectMessage(@PathVariable String userId, DirectMessage message) {
        try {
            logger.info("Received message from user {} to user {}", message.getSenderId(), message.getReceiverId());
            
            message.setMessageId(UUID.randomUUID().toString());
            message.setTimestamp(new Date());
            
            DirectMessage savedMessage = messageService.saveMessage(message);
            logger.info("Message saved to database: {}", savedMessage);

            // Send to both sender and receiver
            messagingTemplate.convertAndSend("/topic/dm/" + message.getSenderId(), savedMessage);
            messagingTemplate.convertAndSend("/topic/dm/" + message.getReceiverId(), savedMessage);
            
            logger.info("Message successfully sent to WebSocket topics");
        } catch (Exception e) {
            logger.error("Error processing message: {}", e.getMessage(), e);
            messagingTemplate.convertAndSend("/topic/errors/" + userId, 
                Map.of("error", "Failed to process message: " + e.getMessage()));
        }
    }

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<?> getConversations(@PathVariable int userId) {
        try {
            logger.info("Fetching conversations for user: {}", userId);
            List<Integer> conversations = messageService.getConversationsForUser(userId);
            logger.info("Found {} conversations for user {}", conversations.size(), userId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            logger.error("Error fetching conversations for user {}: {}", userId, e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch conversations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/history/{userId1}/{userId2}")
    public ResponseEntity<?> getMessageHistory(
            @PathVariable int userId1,
            @PathVariable int userId2) {
        try {
            logger.info("Fetching message history between users {} and {}", userId1, userId2);
            List<DirectMessage> messages = messageService.getMessageHistory(userId1, userId2);
            logger.info("Found {} messages in conversation", messages.size());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error fetching message history: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch message history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable String messageId,
            @RequestParam int userId) {
        try {
            logger.info("Attempting to delete message {} requested by user {}", messageId, userId);
            if (!messageService.isUserInConversation(userId, messageId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "User not authorized to delete this message"));
            }
            
            messageService.deleteMessage(messageId);
            return ResponseEntity.ok(Map.of("message", "Message successfully deleted"));
        } catch (Exception e) {
            logger.error("Error deleting message {}: {}", messageId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete message: " + e.getMessage()));
        }
    }

    @GetMapping("/recent/{userId}")
    public ResponseEntity<?> getRecentMessages(
            @PathVariable int userId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            logger.info("Fetching {} recent messages for user {}", limit, userId);
            List<DirectMessage> messages = messageService.getRecentMessages(userId, limit);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error fetching recent messages: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch recent messages: " + e.getMessage()));
        }
    }

    // Test endpoint for debugging
    @GetMapping("/test/{userId}")
    public ResponseEntity<List<Integer>> getTestConversations(@PathVariable int userId) {
        logger.info("Accessing test endpoint for user {}", userId);
        return ResponseEntity.ok(List.of(1, 2, 3, 4, 5));
    }
}
