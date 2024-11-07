package group26.youdash.controller;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;
import group26.youdash.classes.Goal;
import group26.youdash.model.Groups;
import group26.youdash.model.User;
import group26.youdash.service.GoalsService;
import group26.youdash.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupsController {

    //@Autowired
    //private GroupService gs;

    @Autowired
    private UserService us;

    ArrayList<Groups> groups = new ArrayList<>();

    private static class GroupPkg {

        public String groupName;
        public String groupDescription;
        public String managers; //list
        public String users; //list
        public String userCreating;

    }
    @Autowired // Automatically injects an instance of DynamoDBMapper
    private DynamoDBMapper dynamoDBMapper;

    @PostMapping(path = "/{user}/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<String> createGoal(@PathVariable("user") String user, @RequestBody GroupPkg group) {
        //System.out.println(user);
        //System.out.println(goal);
        //System.out.println((TimeOfDayGoal)goal);
        //System.out.println((QualityGoal) goal);
        int userId;
        if (user.equals("")) {
            userId = 12345;
        } else {
            userId = Integer.parseInt(user);
        }
        //Todo, check for duplicates and create groupservice
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        PaginatedScanList<Groups> allGroups = dynamoDBMapper.scan(Groups.class, scanExpression);
        for (Groups g : allGroups) {
            if (g.getGroupName().equalsIgnoreCase(group.groupName)) {
                HttpHeaders header = new HttpHeaders();
                header.add("Duplicate", "Duplicate group");
                return new ResponseEntity<>(header, HttpStatus.CONFLICT);
            }
        }

        Groups targetGroup = new Groups();
        targetGroup.setGroupName(group.groupName);

        List<Integer> theManagers = new ArrayList<>();
        List<String> theManagersStr = Arrays.asList(group.managers.split(","));
        if (group.managers.equals("Empty")) {
            theManagers.add(Integer.parseInt(group.userCreating));
        } else {
            for (String s : theManagersStr) {
                theManagers.add(Integer.parseInt(s));
            }
            theManagers.add(Integer.parseInt(group.userCreating));
        }
        targetGroup.setManagers(theManagers);

        List<Integer> theUsers = new ArrayList<>();
        List<String> theUsersStr = Arrays.asList(group.users.split(","));
        if (!group.users.equals("Empty")) {
            for (String s : theUsersStr) {
                theUsers.add(Integer.parseInt(s));
            }
        }
        targetGroup.setUsers(theUsers);

        targetGroup.setGroupDescription(group.groupDescription);

        targetGroup.setGroupId(UUID.randomUUID().toString());
        dynamoDBMapper.save(targetGroup);

        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        System.out.println("Received New Group: " + group.groupName + " " + group.groupDescription + " " + group.userCreating + " " + group.users + " " + group.managers);
        //Todo, put in system

        return new ResponseEntity<>(header, HttpStatus.OK);
    }

}
