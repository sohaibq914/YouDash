package group26.youdash.service;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import group26.youdash.classes.YoutubeAPI.YouTubeSnippet;
import group26.youdash.classes.YoutubeAPI.YouTubeVideoResponse;

@Service
public class YoutubeAPIService {

    private static final String YOUTUBE_API_KEY = "AIzaSyBbFSmvJuLiBdhmkY8Z9RXs6PgH1fR_M64";
    private static final String YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

    private final RestTemplate restTemplate;

    public YoutubeAPIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }



    // Get the video ID for the given youtube video
    public String extractVideoId(String url) {
        // Example: "https://www.youtube.com/watch?v=abcd1234"
        // Video ID will be abcd1234
        String[] splitUrl = url.split("v=");
        if (splitUrl.length > 1) {
            return splitUrl[1];
        } else {
            throw new IllegalArgumentException("Invalid YouTube URL");
        }
    }


    public String getVideoCategoryID(String youtubeUrl) throws Exception{

        // Get the specifics video id
        String videoID = extractVideoId(youtubeUrl);

        // Make API request URL
        // UriComponentsBuilder will make the url, including the parameters, to request from youtube api
        String url = UriComponentsBuilder.fromHttpUrl( YOUTUBE_API_URL + "/videos")
                .queryParam("part", "snippet")
                .queryParam("id", videoID)
                .queryParam("key", YOUTUBE_API_KEY)
                .toUriString();

        // ResponseEntity is in charge of making the API request
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

         
        // return category id once it's parsed
        return parseCategoryId(response.getBody());
        
    
    }



    private String parseCategoryId (String json) throws Exception {

        // initiate objectmapper object to map json to object
        ObjectMapper objectMapper = new ObjectMapper();

        // read the json and make it into a YouTubeVideoResponse object
        YouTubeVideoResponse videoResponse = objectMapper.readValue(json, YouTubeVideoResponse.class);

        // check if response if not empty
        if(!videoResponse.getItems().isEmpty()) {
            // Get snippet and return category id from the snippet
            YouTubeSnippet youTubeSnippet = videoResponse.getItems().get(0).getSnippet();
            return youTubeSnippet.getCategoryId();
        }
        
        throw new IllegalArgumentException("No video found for the provided ID");
        
    }
 




    
}
