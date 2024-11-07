package group26.youdash.controller;

import group26.youdash.classes.Messages;
import group26.youdash.model.Groups;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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
        Groups group = dynamoDBMapper.load(Groups.class, groupId);

        if (group == null) {
            System.out.println("Group not found for ID: " + groupId);
            return ResponseEntity.notFound().build(); // Return 404 if the group is not found
        }

        // Retrieve the message history from the group
        List<Messages> messageHistory = group.getMessages();
        return ResponseEntity.ok(messageHistory);
    }



}
