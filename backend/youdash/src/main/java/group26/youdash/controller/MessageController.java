package group26.youdash.controller;

import group26.youdash.classes.Messages;
import group26.youdash.model.Groups;
import group26.youdash.model.User;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMappingException;

import ch.qos.logback.core.util.DynamicClassLoadingException;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/group-chat")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "chrome-extension://pcfljeghhkdmleihaobbdhkphdonijdm"
})
public class MessageController {
    private final SimpMessagingTemplate messagingTemplate;
    private final DynamoDBMapper dynamoDBMapper; // Inject DynamoDBMapper
    private Groups group;

    public MessageController(SimpMessagingTemplate messagingTemplate, DynamoDBMapper dynamoDBMapper) {
        this.messagingTemplate = messagingTemplate;
        this.dynamoDBMapper = dynamoDBMapper;
    }

    @MessageMapping("/chat/{groupId}")
    public void sendMessage(@DestinationVariable String groupId, Messages chatMessage) {
        System.out.println("Received message for group " + groupId + ": " + chatMessage.getMessageText());

        // Retrieve the group by groupId
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        if (group != null) {
            // Add the new message to the group's message list
            group.getMessages().add(chatMessage);

            // Save the updated group back to DynamoDB
            dynamoDBMapper.save(group);
            System.out.println("Message saved to group in DynamoDB.");
        } else {
            System.out.println("Group not found for ID: " + groupId);
        }

        // Send the message to the WebSocket topic for the group
        String destination = "/topic/group/" + groupId;
        messagingTemplate.convertAndSend(destination, chatMessage);
    }

    @GetMapping("/groups/{groupId}/messages")
    public ResponseEntity<List<Messages>> getMessageHistory(@PathVariable String groupId) {
        // Load the group from DynamoDB
        // try {
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        // } catch(DynamoDBMappingException e) {
        // System.out.println(e);
        // }

        if (group == null) {
            System.out.println("Group not found for ID: " + groupId);
            return ResponseEntity.notFound().build(); // Return 404 if the group is not found
        }

        // Retrieve the message history from the group
        List<Messages> messageHistory = group.getMessages();
        return ResponseEntity.ok(messageHistory);
    }

    @GetMapping("/isManager/{userId}/{groupId}")
    public ResponseEntity<Boolean> checkIfManager(@PathVariable String userId, @PathVariable String groupId) {
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        if (group.getManagers().contains(Integer.parseInt(userId))) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    @PostMapping("/groups/{groupId}/messages/{messageId}/vote")
    public ResponseEntity<?> voteMessage(
            @PathVariable String groupId,
            @PathVariable String messageId,
            @RequestParam int userId,
            @RequestParam String voteType) { // voteType = "upvote" or "downvote"

        // Load the group
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        if (group == null) {
            return ResponseEntity.notFound().build(); // 404 if group is not found
        }

        // Find the specific message by messageId in the group
        Messages message = group.getMessages().stream()
                .filter(m -> m.getMessageId().equals(messageId))
                .findFirst()
                .orElse(null);

        if (message == null) {
            return ResponseEntity.notFound().build(); // 404 if message is not found
        }

        // Prevent the user from voting on their own message
        if (message.getUserId() == userId) {
            return ResponseEntity.badRequest().body("Users cannot vote on their own messages.");
        }

        // Check if the user has already voted
        String existingVote = message.getUserVotes().get(String.valueOf(userId));
        if (existingVote != null && existingVote.equals(voteType)) {
            return ResponseEntity.ok("Vote already registered.");
        }

        // Update vote: if changing vote, remove previous vote
        if (existingVote != null && !existingVote.equals(voteType)) {
            message.getUserVotes().remove(userId);
        }
        // Add the new vote
        message.getUserVotes().put(String.valueOf(userId), voteType);

        // Save the group with the updated message
        dynamoDBMapper.save(group);

        // Broadcast the updated vote count to all users in the group chat
        String destination = "/topic/group/" + groupId;
        messagingTemplate.convertAndSend(destination, message);

        return ResponseEntity.ok("Vote registered.");
    }



    @PostMapping("/groups/{groupId}/messages/{messageId}/delete")
    public ResponseEntity<?> deleteMessage(
            @PathVariable String groupId,
            @PathVariable String messageId,
            @RequestParam int userId) { // voteType = "upvote" or "downvote"

        // Load the group
        Groups group = dynamoDBMapper.load(Groups.class, groupId);
        if (group == null) {
            return ResponseEntity.notFound().build(); // 404 if group is not found
        }

        // Find the specific message by messageId in the group
        Messages message = group.getMessages().stream()
                .filter(m -> m.getMessageId().equals(messageId))
                .findFirst()
                .orElse(null);

        if (message == null) {
            return ResponseEntity.notFound().build(); // 404 if message is not found
        }

        // Prevent the user from voting on their own message
        /*if (message.getUserId() == userId) {
            return ResponseEntity.badRequest().body("Users cannot vote on their own messages.");
        }*/

        // Check if the user has already voted
        /*String existingVote = message.getUserVotes().get(String.valueOf(userId));
        if (existingVote != null && existingVote.equals(voteType)) {
            return ResponseEntity.ok("Vote already registered.");
        }*/

        // Update vote: if changing vote, remove previous vote
        /*if (existingVote != null && !existingVote.equals(voteType)) {
            message.getUserVotes().remove(userId);
        }*/
        // Add the new vote
        //message.getUserVotes().put(String.valueOf(userId), voteType);
        message.setMessageText("DELETED");
        message.setDownvotes(0);
        message.setUpvotes(0);
        message.setIsYouTube(false);
        // Save the group with the updated message
        dynamoDBMapper.save(group);

        // Broadcast the updated vote count to all users in the group chat
        String destination = "/topic/group/" + groupId;
        messagingTemplate.convertAndSend(destination, message);

        return ResponseEntity.ok("Vote registered.");
    }
}
