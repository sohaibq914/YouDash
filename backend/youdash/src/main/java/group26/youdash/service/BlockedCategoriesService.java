package group26.youdash.service;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

import group26.youdash.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BlockedCategoriesService {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    


    public void addBlockedCategory(int userId, String categoryName) {
        User user = dynamoDBMapper.load(User.class, userId);

        if (user != null) {
            //fetch the list from the user's blocked categories
            List<String> blockedCategories = user.getBlocked();
            //add new blocked category name
            blockedCategories.add(categoryName);
            //save updated list
            dynamoDBMapper.save(user); 
        }
    }


    public void deleteBlockedCategory(int userId, String categoryName) {
        User user = dynamoDBMapper.load(User.class, userId);
        if (user != null) {
            // fetch the blocked categories list
            List<String> blockedCategories = user.getBlocked();
            // remove category from the list
            blockedCategories.remove(categoryName);
            // save updated list 
            dynamoDBMapper.save(user);

            // TODO: add it back to the available categories list
        }
    }


    public List<String> getBlockedCategories(int userID) {
        User user = dynamoDBMapper.load(User.class, userID); 
        if (user != null) {
            return user.getBlocked();
        }
        else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }

    public List<String> getAvailableCategories(int userID) {
        User user = dynamoDBMapper.load(User.class, userID);
        if (user != null) {
            return user.getAvailableCategories();
        }
        else {
            throw new NoSuchElementException("User with ID " + userID + " not found");
        }
    }
}