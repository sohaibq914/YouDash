package group26.youdash.controller;
import group26.youdash.classes.Category;
import group26.youdash.config.DynamoDBConfig;
import group26.youdash.service.BlockedCategoriesService;
import group26.youdash.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import  org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController 
@RequestMapping("/block-categories") 
@CrossOrigin(origins = {
    "http://localhost:3000", 
    "chrome-extension://pcfljeghhkdmleihaobbdhkphdonijdm"
})
public class CategoriesController {

     @Autowired
    private BlockedCategoriesService bcs;
    
  
    @PostMapping(path = "/{userID}/addCategory")
    public ResponseEntity<String> addCategory(@PathVariable("userID") int user, @RequestBody Category category) {
        System.out.println("Received category from user: " + user);
        System.out.println("Category Name: " + category.getCategoryName()); 

        // adding category to database
        bcs.addBlockedCategory(user, category.getCategoryName());

        return new ResponseEntity<>("Category added successfully", HttpStatus.OK);
    }


    @PostMapping(path = "/{userID}/DeleteCategory")
    public ResponseEntity<String> deleteCategory(@PathVariable("userID") int user, @RequestBody Category category) {
        System.out.println("Received category from user: " + user);
        System.out.println("Category Name: " + category.getCategoryName());

        // delete category from blocked category list
        bcs.deleteBlockedCategory(user, category.getCategoryName());

        return new ResponseEntity<>("Category deleted successfully", HttpStatus.OK);
    }


    @GetMapping(path = "/{userID}/availableCategories")
    public ResponseEntity<Map<String, List<String>>> getAvailableCategories(@PathVariable int userID) {
        try {
             // Fetch available categories from the database based on userID
            List<String> availableCategories = bcs.getAvailableCategories(userID);
            Map<String, List<String>> response = new HashMap<>();
            response.put("availableCategories", availableCategories);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
           return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping(path = "/{userID}/blockedCategories")
    public ResponseEntity<Map<String, List<String>>> getBlockedCategories(@PathVariable int userID) {
        try {
            
            // Retrieve the blocked categories from the database given userID
            List<String> blockedCategories = bcs.getBlockedCategories(userID);
            Map<String, List<String>> response = new HashMap<>();
            response.put("blockedCategories", blockedCategories);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/{userID}/testGetBlockedCategories")
    public List<String> testGetBlockedCategories(@PathVariable int userID) {
        return bcs.getBlockedCategories(userID);  // Directly call service method
    }

    @GetMapping("/{userID}/testAddBlockedCategory/{categoryName}")
    public String testAddBlockedCategory(@PathVariable int userID, @PathVariable String categoryName) {
        bcs.addBlockedCategory(userID, categoryName);
        return "Category added successfully!";
    }
}
