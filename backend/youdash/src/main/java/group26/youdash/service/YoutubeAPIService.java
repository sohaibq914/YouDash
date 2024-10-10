package group26.youdash.service;
import group26.youdash.classes.YoutubeAPI.YouTubeContentDetails;
import group26.youdash.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.fasterxml.jackson.databind.ObjectMapper;

import group26.youdash.classes.YoutubeAPI.YouTubeSnippet;
import group26.youdash.classes.YoutubeAPI.YouTubeVideoResponse;
import java.util.NoSuchElementException;
import java.util.List;

@Service
public class YoutubeAPIService {

    private static final String YOUTUBE_API_KEY = "AIzaSyBbFSmvJuLiBdhmkY8Z9RXs6PgH1fR_M64";
    private static final String YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

    private final RestTemplate restTemplate;

    public YoutubeAPIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Autowired
    private DynamoDBMapper dynamoDBMapper;



    // Get the video ID for the given youtube video
    public String extractVideoId(String url) {
        // Example: "https://www.youtube.com/watch?v=abcd1234"
        // Video ID will be abcd1234
        String[] splitUrl = url.split("v=");
    
        if (splitUrl.length > 1) {
            // Split again by "&" to remove any additional parameters after the video ID
            String videoId = splitUrl[1].split("&")[0];
            return videoId;
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
        System.out.println(url);

        // ResponseEntity is in charge of making the API request
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

         
        // return category id once it's parsed
        return parseCategoryId(response.getBody());
        
    
    }

    public float getVideoLength(String youtubeUrl) throws Exception{

        // Get the specifics video id
        String videoID = extractVideoId(youtubeUrl);

        // Make API request URL
        // UriComponentsBuilder will make the url, including the parameters, to request from youtube api
        String url = UriComponentsBuilder.fromHttpUrl( YOUTUBE_API_URL + "/videos")
                .queryParam("part", "contentDetails")
                .queryParam("id", videoID)
                .queryParam("key", YOUTUBE_API_KEY)
                .toUriString();

        // ResponseEntity is in charge of making the API request
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);


        // return category id once it's parsed
        return parseLength(response.getBody());


    }

    private float parseLength (String json) throws Exception {
        // initiate objectmapper object to map json to object
        ObjectMapper objectMapper = new ObjectMapper();

        // read the json and make it into a YouTubeVideoResponse object
        YouTubeVideoResponse videoResponse = objectMapper.readValue(json, YouTubeVideoResponse.class);

        // check if response if not empty
        if(!videoResponse.getItems().isEmpty()) {
            // Get snippet and return category id from the snippet
            YouTubeContentDetails ytcd = videoResponse.getItems().get(0).getContentDetails();
            String formattedTime = ytcd.getDuration();
            float retVal = 0;
            if (formattedTime.contains("DT")) {
                retVal += 60 * 24 * Integer.parseInt(formattedTime.substring(1,formattedTime.indexOf('D')));
            }
            boolean hours = false;
            if (formattedTime.contains("H")) {
                hours = true;
                retVal += 60 * Integer.parseInt(formattedTime.substring(formattedTime.indexOf('T')+1, formattedTime.indexOf('H')));
            }
            boolean minutes = false;
            if (formattedTime.contains("M")) {
                minutes = true;
                if (hours) {
                    retVal += Integer.parseInt(formattedTime.substring(formattedTime.indexOf('H') + 1, formattedTime.indexOf('M')));
                } else {
                    retVal += Integer.parseInt(formattedTime.substring(formattedTime.indexOf('T') + 1, formattedTime.indexOf('M')));
                }
            }
            if (minutes) {
                retVal += (Integer.parseInt(formattedTime.substring(formattedTime.indexOf('M') + 1, formattedTime.indexOf('S'))) + 0.0f) / 60;
            } else {
                retVal += (Integer.parseInt(formattedTime.substring(formattedTime.indexOf('T') + 1, formattedTime.indexOf('S'))) + 0.0f) / 60;
            }
            return retVal;
        }

        throw new IllegalArgumentException("No video found for the provided ID");

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


    public void addVideoURL(int userId, String url) {
        User user = dynamoDBMapper.load(User.class, userId);
        
        if (user != null) {

            List<String> watchHistory = user.getHistoryURLs();
            //add the youtube url to the watchhistory
            watchHistory.add(url);
        }
        else {
            throw new NoSuchElementException("Category not found in available categories");
        }
    }

    public List<String> getWatchHistory(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            return user.getHistoryURLs();
        } 
        else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }



    
}
