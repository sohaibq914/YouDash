package group26.youdash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import java.util.NoSuchElementException;
import group26.youdash.model.*;
import java.util.List;
import java.util.ArrayList;

@Service
public class WatchHistoryService {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public List<String> getWatchHistory(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            return user.getHistoryURLs();
        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public void addVideo(int userID, String url) {
        User user = dynamoDBMapper.load(User.class, userID);

        if (user != null) {
            // Get the list of urls from the watch history list
            List<String> watchHistory = user.getHistoryURLs();

            if (watchHistory == null) {
                watchHistory = new ArrayList<>();
            }

            // Add the new video URL to the list if it doesn't already exist
            if (!watchHistory.contains(url)) {
                watchHistory.add(url);
                user.setHistoryURLs(watchHistory);
                // save the list for the user
                dynamoDBMapper.save(user);
            }

        } else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }
}
