package group26.youdash.service;

import group26.youdash.classes.YoutubeAPI.VideoHistory;
import group26.youdash.classes.YoutubeAPI.VideoHistory;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import java.time.LocalDateTime;

import group26.youdash.model.*;

@Service
public class AnalyticsService {

    private static final Map<String, Integer> CATEGORY_MAP = Map.ofEntries(
            Map.entry("Film & Animation", 1),
            Map.entry("Autos & Vehicles", 2),
            Map.entry("Music", 10),
            Map.entry("Pets & Animals", 15),
            Map.entry("Sports", 17),
            Map.entry("Short Movies", 18),
            Map.entry("Travel & Events", 19),
            Map.entry("Gaming", 20),
            Map.entry("Videoblogging", 21),
            Map.entry("Vlogs", 22),
            Map.entry("Comedy", 23),
            Map.entry("Entertainment", 24),
            Map.entry("News & Politics", 25),
            Map.entry("Howto & Style", 26),
            Map.entry("Education", 27),
            Map.entry("Science & Technology", 28),
            Map.entry("Nonprofits & Activism", 29),
            Map.entry("Movies", 30),
            Map.entry("Anime/Animation", 31),
            Map.entry("Action/Adventure", 32),
            Map.entry("Classics", 33),
            Map.entry("Comedy (Movies)", 34),
            Map.entry("Documentary", 35),
            Map.entry("Drama", 36),
            Map.entry("Family", 37),
            Map.entry("Foreign", 38),
            Map.entry("Horror", 39),
            Map.entry("Sci-Fi/Fantasy", 40),
            Map.entry("Thriller", 41),
            Map.entry("Shorts", 42),
            Map.entry("Shows", 43),
            Map.entry("Trailers", 44));

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public Map<String, Float> getAggregatedWatchTimeByHour(int userId, String categoryName) {
        User user = dynamoDBMapper.load(User.class, userId);
        if (user == null || user.getHistory() == null) {
            return Collections.emptyMap();
        }
    
        Map<String, Float> watchTimeByHour = new HashMap<>();
        DateTimeFormatter hourFormatter = DateTimeFormatter.ofPattern("HH");
    
        Integer categoryId = null;
    
        // Only retrieve a specific category ID if it's not "All Categories"
        if (categoryName != null && !"All Categories".equalsIgnoreCase(categoryName)) {
            categoryId = CATEGORY_MAP.get(categoryName);
            
            // Handle case where category does not exist in CATEGORY_MAP
            if (categoryId == null) {
                throw new IllegalArgumentException("Invalid category name: " + categoryName);
            }
        }
    
        for (VideoHistory video : user.getHistory()) {
            // If categoryId is null, we skip category filtering (show all categories)
            if (categoryId == null || video.getCategory() == categoryId) {
                LocalDateTime watchDateTime = LocalDateTime.parse(video.getTimeStamp());
                String hour = watchDateTime.format(hourFormatter);
                watchTimeByHour.put(hour, watchTimeByHour.getOrDefault(hour, 0f) + video.getDuration());
            }
        }
        return watchTimeByHour;
    }
    

}
