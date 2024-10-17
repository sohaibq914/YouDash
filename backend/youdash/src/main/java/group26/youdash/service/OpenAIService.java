package group26.youdash.service;

import group26.youdash.model.*;

import org.joda.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

import org.springframework.http.*;

import group26.youdash.classes.WatchTimeGoal;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class OpenAIService {
    private static final String OPENAI_API_KEY = "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";
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    @Autowired
    private RestTemplate restTemplate;
    private GoalsService goalsService;
    private DynamoDBMapper dbMapper;

    @Autowired
    public OpenAIService(RestTemplate restTemplate, GoalsService goalsService, DynamoDBMapper dbMapper) {
        this.restTemplate = restTemplate;
        this.goalsService = goalsService;
        this.dbMapper = dbMapper;
    }

    public String getAIRecommendations(int userId) {
    // Fetch goals and build prompt
    List<WatchTimeGoal> watchTimeGoals = goalsService.getUserGoals(userId);
    String prompt = buildPromptFromGoals(watchTimeGoals);

    // Send prompt to OpenAI
    String response = sendToOpenAI(prompt);

    // Fetch the user from DynamoDB
    User user = dbMapper.load(User.class, userId);

    // Create a new entry for prompt history
    Map<String, String> promptHistoryEntry = new HashMap<>();
    promptHistoryEntry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
    promptHistoryEntry.put("response", response);

    // Add the new entry to the user's promptHistory
    if (user.getPromptHistory() == null) {
        user.setPromptHistory(new ArrayList<>()); // Initialize the list if null
    }
    user.getPromptHistory().add(promptHistoryEntry);

    // Save the updated user back to DynamoDB
    dbMapper.save(user);

    return response; // Return the AI response
}

    private String buildPromptFromGoals(List<WatchTimeGoal> goals) {
        StringBuilder prompt = new StringBuilder("Here are your current goals:\n");
        for (WatchTimeGoal goal : goals) {
            System.out.println("Goal is " + goal.getGoalName() + " Current Watch time: " + goal.getCurrentWatchTime() + " Goal Watch Time: " + goal.getGoalWatchTime() + " Progress: " + goal.getGoalProgress());
            prompt.append("Goal: ").append(goal.getGoalName())
                    .append("\nCurrent Watch Time: ").append(goal.getCurrentWatchTime())
                    .append("\nGoal Watch Time: ").append(goal.getGoalWatchTime())
                    .append("\nProgress: ").append(goal.getGoalProgress() * 100).append("%\n\n");
        }

        // Tell Chat GPT to provide recommendations
        prompt.append("Please provide personalized recommendations to help achieve these goals.");
        return prompt.toString();
    }

    public String sendToOpenAI(String prompt) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENAI_API_KEY);
    
        // Create request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo"); // Updated model
        requestBody.put("messages", List.of(
            Map.of("role", "user", "content", prompt) // Using 'messages' for chat completion
        ));
        requestBody.put("max_tokens", 75);
        requestBody.put("temperature", 0.7);
    
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
    
        try {
            // Send POST request to OpenAI API
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_API_URL, entity, Map.class);
    
            // Check if the response is successful
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
    
                // Safely extract the 'choices' array
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
    
                if (choices != null && !choices.isEmpty()) {
                    // Get the first choice and extract 'message' > 'content'
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                    String content = (String) message.get("content");
    
                    return content; // Return the generated content
                } else {
                    return "No choices available in the response.";
                }
            } else {
                return "Error: Unable to get a valid response from OpenAI.";
            }
    
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to communicate with OpenAI.";
        }
    }
    

}
