package group26.youdash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import group26.youdash.service.WatchHistoryService;

import java.util.Map;
import java.util.List;
import java.util.HashMap;

@RestController
@RequestMapping("/watch-history")
@CrossOrigin(origins = {
    "http://localhost:3000", 
    "chrome-extension://pcfljeghhkdmleihaobbdhkphdonijdm"
})
public class WatchHistoryController {

    @Autowired
    private WatchHistoryService whs;
    
    @GetMapping("/{userID}/historyList")
    public ResponseEntity<Map<String, List<String>>> getWatchHistory(@PathVariable int userID) {

        try {
            List<String> watchHistory = whs.getWatchHistory(userID);
            Map<String, List<String>> response = new HashMap<>();
            response.put("watchHistory", watchHistory);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{userID}/addVideo")
    public ResponseEntity<String> addVideo(@PathVariable int userID, @RequestBody Map<String, String> body) {

        String videoUrl = body.get("url");
        
        // error checking
        if (videoUrl == null || videoUrl.isEmpty()) {
            return new ResponseEntity<>("Invalid URL", HttpStatus.BAD_REQUEST);
        }

        // Add video to the watch history of the user
        whs.addVideo(userID, videoUrl);

        return new ResponseEntity<>("Video added successfully to the watch history", HttpStatus.OK);
    }


        // Endpoint to get the total watch time for a user
        @GetMapping("/{userID}/totalWatchTime")
        public ResponseEntity<Float> getTotalWatchTime(@PathVariable int userID) {
            try {
                float totalWatchTime = whs.getWatchTimeTotal(userID);
                return ResponseEntity.ok(totalWatchTime);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    
        // Endpoint to get the watch time filtered by category
        @GetMapping("/{userID}/watchTimeByCategory/{category}")
        public ResponseEntity<Float> getWatchTimeByCategory(@PathVariable int userID, @PathVariable int category) {
            try {
                float totalWatchTime = whs.getWatchTimeByCategory(userID, category);
                return ResponseEntity.ok(totalWatchTime);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
}
