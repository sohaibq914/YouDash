package group26.youdash.controller;

import group26.youdash.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

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

}
