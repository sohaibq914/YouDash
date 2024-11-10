package group26.youdash.controller;

import group26.youdash.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @GetMapping(path = "/{userId}/recommendations")
    public ResponseEntity<String> getRecommendations(@PathVariable("userId") int userId) {
        try {
            // Get watch time goals and send to OpenAI to get recommendations
            String recommendations = openAIService.getAIRecommendations(userId);
            return ResponseEntity.ok(recommendations);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error generating recommendations", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping(path = "/{userId}/prompt-history")
    public ResponseEntity<List<Map<String, String>>> getPromptHistory(@PathVariable("userId") int userId) {

        try {
            List<Map<String, String>> promptHistory = openAIService.getPromptHistory(userId);
            return ResponseEntity.ok(promptHistory);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/reformat-message")
public ResponseEntity<String> reformatMessage(@RequestBody Map<String, String> request) {
    try {
        String message = request.get("message");
        String prompt = "Please reformat and improve the following message to be more professional and clear, while maintaining its core meaning: \n\n" + message;
        String reformattedMessage = openAIService.sendToOpenAI(prompt);
        return ResponseEntity.ok(reformattedMessage);
    } catch (Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>("Error reformatting message", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

}
