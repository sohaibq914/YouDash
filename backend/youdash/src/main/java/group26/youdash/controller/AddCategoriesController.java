package group26.youdash.controller;
import group26.youdash.classes.Category;
import org.springframework.http.HttpStatus;
import  org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/block-categories") 
@CrossOrigin(origins = "http://localhost:3000")
public class AddCategoriesController {
    
  
    @PostMapping(path = "/{user}/addCategory")
    public ResponseEntity<String> addCategory(@PathVariable("user") String user, @RequestBody Category category) {
        System.out.println("Received category from user: " + user);
        System.out.println("Category Name: " + category.getCategoryName()); 

        return new ResponseEntity<>("Category added successfully", HttpStatus.OK);
    }
}
