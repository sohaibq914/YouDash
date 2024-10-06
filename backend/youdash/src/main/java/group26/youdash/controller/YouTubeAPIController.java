package group26.youdash.controller;
import group26.youdash.service.YoutubeAPIService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/youtube")
public class YouTubeAPIController {

    private final YoutubeAPIService youtubeAPIService;

    @Autowired
    public YouTubeAPIController(YoutubeAPIService youtubeAPIService) {
        this.youtubeAPIService = youtubeAPIService;
    }

    @GetMapping("/video-category")
    public ResponseEntity<String> getVideoCategoryId(@RequestParam String url) {

        try {
            String categoryID = youtubeAPIService.getVideoCategoryID(url);
            return ResponseEntity.ok("Category ID: " + categoryID);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
