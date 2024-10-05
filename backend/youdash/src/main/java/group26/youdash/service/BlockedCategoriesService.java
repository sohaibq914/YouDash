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

            // fetch the list from the user's available categories
            List<String> availableCategories = user.getAvailableCategories();

            if (availableCategories.contains(categoryName)) {

                //add new blocked category name
                blockedCategories.add(categoryName);

                // remove category from available categories
                availableCategories.remove(categoryName);

                //save updated list
                dynamoDBMapper.save(user); 
            }
            else {
                throw new NoSuchElementException("Category not found in available categories");
            }
            
        }
        else {
            throw new NoSuchElementException("User ID : " + userId + " not found");
        }
    }


    public void deleteBlockedCategory(int userId, String categoryName) {
        User user = dynamoDBMapper.load(User.class, userId);
        if (user != null) {
            // fetch the blocked categories list
            List<String> blockedCategories = user.getBlocked();
             // fetch the list from the user's available categories
             List<String> availableCategories = user.getAvailableCategories();


            // remove category from the list
            blockedCategories.remove(categoryName);
            // add it back to available categories
            availableCategories.add(categoryName);


            // save updated list 
            dynamoDBMapper.save(user);

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