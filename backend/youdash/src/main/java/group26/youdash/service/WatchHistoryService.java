package group26.youdash.service;

import group26.youdash.classes.YoutubeAPI.VideoHistory;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import group26.youdash.model.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;


@Service
public class WatchHistoryService {

    private final YoutubeAPIService youtubeAPIService;

    @Autowired
    public WatchHistoryService(YoutubeAPIService youtubeAPIService) {
        this.youtubeAPIService = youtubeAPIService;
    }
    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public List<String> getWatchHistory(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            List<String> retVal = new ArrayList<>();
            List<VideoHistory> vh = user.getHistory();
            for (VideoHistory v : vh) {
                retVal.add(v.getUrl());
            }
            return retVal;
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public void addVideo(int userID, String url) {
        User user = dynamoDBMapper.load(User.class, userID);

        if (user != null) {
            // Get the list of urls from the watch history list
            List<VideoHistory> watchHistory = user.getHistory();

            if (watchHistory == null) {
                watchHistory = new ArrayList<>();
            }

            try {
                VideoHistory vh = new VideoHistory(url, youtubeAPIService.getVideoLength(url), youtubeAPIService.getVideoName(url), Integer.parseInt(youtubeAPIService.getVideoCategoryID(url)), "" + userID);
                watchHistory.add(vh);
                user.setHistory(watchHistory);
                dynamoDBMapper.save(user);
            }catch (Exception e) {
                e.printStackTrace();
            }

            // Add the new video URL to the list if it doesn't already exist
            //if (!watchHistory.contains(url)) {
            //    watchHistory.add(url);
             //   user.setHistoryURLs(watchHistory);
                // save the list for the user
            //    dynamoDBMapper.save(user);
            //}

        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public float getWatchTimeTotal(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);

        if (user != null) {
            // Get the list of urls from the watch history list
            List<VideoHistory> watchHistory = user.getHistory();

            if (watchHistory == null) {
                return 0.0f;
            }
            float total = 0.0f;
            for (VideoHistory vh : watchHistory) {
                total += vh.getDuration();
            }
            System.out.println("TOTAL: " + total);
            return total;
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public float getWatchTimeByCategory(int userID, int category) {
        User user = dynamoDBMapper.load(User.class, userID);
        System.out.println("CATEGORY!!!" + category);
        System.out.println("userID!!!" + userID);

        if (user != null) {
            // Get the list of urls from the watch history list
            List<VideoHistory> watchHistory = user.getHistory();

            if (watchHistory == null) {
                return 0.0f;
            }
            float total = 0.0f;
            for (VideoHistory vh : watchHistory) {
                if (vh.getCategory() == category) {
                    total += vh.getDuration();
                }
            }
            return total;
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    //time frame can we 'week' 'month' or 'day'
    public float getWatchTimeByCategoryAndTimeframe(int userID, int category, String timeframe) {
        User user = dynamoDBMapper.load(User.class, userID);

        if (user != null) {
            // Get the list of urls from the watch history list
            List<VideoHistory> watchHistory = user.getHistory();

            if (watchHistory == null) {
                return 0.0f;
            }
            float total = 0.0f;
            LocalDateTime start = LocalDateTime.now();
            if (timeframe.equalsIgnoreCase("week")) {
                start = start.minusWeeks(1);
            } else if (timeframe.equalsIgnoreCase("month")) {
                start = start.minusMonths(1);
            } else if (timeframe.equalsIgnoreCase("day")) {
                start = start.minusDays(1);
            } else {
                throw new IllegalArgumentException("Please use 'day' 'month' or 'week' for the timeframe parameter");
            }
            for (VideoHistory vh : watchHistory) {
                if (vh.getCategory() == category && LocalDateTime.parse(vh.getTimeStamp()).isAfter(start)) {
                    total += vh.getDuration();
                }
            }
            return total;
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public float getWatchTimeByCategoryAndCustomTime(int userID, int category, LocalDateTime start, LocalDateTime end) {
        User user = dynamoDBMapper.load(User.class, userID);

        if (user != null) {
            // Get the list of urls from the watch history list
            List<VideoHistory> watchHistory = user.getHistory();

            if (watchHistory == null) {
                return 0.0f;
            }
            float total = 0.0f;
            for (VideoHistory vh : watchHistory) {
                if (vh.getCategory() == category && LocalDateTime.parse(vh.getTimeStamp()).isAfter(start) && LocalDateTime.parse(vh.getTimeStamp()).isBefore(end)) {
                    total += vh.getDuration();
                }
            }
            return total;
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public float getWatchTimeByCustomTime(int userID, LocalDateTime start, LocalDateTime end) {
        User user = dynamoDBMapper.load(User.class, userID);

        if (user != null) {
            // Get the list of urls from the watch history list
            List<VideoHistory> watchHistory = user.getHistory();

            if (watchHistory == null) {
                return 0.0f;
            }
            float total = 0.0f;
            for (VideoHistory vh : watchHistory) {
                if (LocalDateTime.parse(vh.getTimeStamp()).isAfter(start) && LocalDateTime.parse(vh.getTimeStamp()).isBefore(end)) {
                    total += vh.getDuration();
                }
            }
            return total;
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    
    
}
