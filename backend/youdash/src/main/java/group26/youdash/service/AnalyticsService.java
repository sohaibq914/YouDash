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

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public Map<String, Float> getAggregatedWatchTimeByHour(int userId) {
        User user = dynamoDBMapper.load(User.class, userId);

        if (user == null || user.getHistory() == null) {
            return Collections.emptyMap();
        }

        // Format the watch time data by hour
        Map<String, Float> watchTimeByHour = new HashMap<>();
        DateTimeFormatter hourFormatter = DateTimeFormatter.ofPattern("HH");

        for (VideoHistory video : user.getHistory()) {
            LocalDateTime watchDateTime = LocalDateTime.parse(video.getTimeStamp());
            String hour = watchDateTime.format(hourFormatter); // Extract hour as a key
            watchTimeByHour.put(hour, watchTimeByHour.getOrDefault(hour, 0f) + video.getDuration());
        }

        return watchTimeByHour;
    }

}
