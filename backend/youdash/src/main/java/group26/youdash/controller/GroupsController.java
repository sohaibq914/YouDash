package group26.youdash.controller;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;
import com.google.api.client.json.Json;
import group26.youdash.classes.Goal;
import group26.youdash.model.Announcement;
import group26.youdash.model.Groups;
import group26.youdash.model.User;
import group26.youdash.service.GoalsService;
import group26.youdash.service.GroupsService;
import group26.youdash.service.UserService;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Array;
import java.util.*;

@RestController
@RequestMapping("/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupsController {

    // @Autowired
    // private GroupService gs;

    @Autowired
    private UserService us;

    @Autowired
    private GroupsService gs;


    ArrayList<Groups> groups = new ArrayList<>();

    private static class GroupPkg {
        public GroupPkg(String groupName, String groupDescription, String managers, String users, String userCreating) {
            this.groupName = groupName;
            this.groupDescription = groupDescription;
            this.managers = managers;
            this.users = users;
            this.userCreating = userCreating;
        }

        public GroupPkg() {
        };

        public String groupName;
        public String groupDescription;
        public String managers; // list
        public String users; // list
        public String userCreating;

        // public image;

        @Override
        public String toString() {
            return groupName + " " + groupDescription + " " + managers + " " + users + " " + userCreating;// + " " +
                                                                                                          // image.toString();
        }
    }

    @Autowired // Automatically injects an instance of DynamoDBMapper
    private DynamoDBMapper dynamoDBMapper;

    @PostMapping(path = "/{user}/create", consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<String> createGoal(@PathVariable("user") String user, @RequestPart("group") GroupPkg group, @RequestPart(value = "image", required = false) MultipartFile file) {
        //System.out.println(user);
        //GroupPkg group = new GroupPkg();
        //System.out.println(group);
        //System.out.println(file);
        //System.out.println((TimeOfDayGoal)goal);
        //System.out.println((QualityGoal) goal);
        int userId;
        if (user.equals("")) {
            userId = 12345;
        } else {
            userId = Integer.parseInt(user);
        }
        // Todo, check for duplicates and create groupservice
        List<Groups> allGroups = gs.getAllGroups();
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
        // make sure all managers are users
        for (Integer i : theManagers) {
            boolean found = false;
            for (Integer j : theUsers) {
                if (i.intValue() == j.intValue()) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                theUsers.add(i);
            }
        }
        targetGroup.setUsers(theUsers);

        targetGroup.setGroupDescription(group.groupDescription);
        targetGroup.setMessages(new ArrayList<>());
        targetGroup.setRequests(new ArrayList<>());
        targetGroup.setInvitations(new ArrayList<>());
        //targetGroup.setGroupId(UUID.randomUUID().toString());
        Groups theGroup = gs.save(targetGroup);
        //System.out.println("Test pic");
        //System.out.println(file);
        if (file != null){
            try {
                System.out.println("uploading pic");
                gs.uploadProfilePicture(theGroup.getGroupId(), file);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No image given");
            theGroup.setProfilePictureKey("NULL");
            gs.save(theGroup);
        }

        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        System.out.println("Received New Group: " + group.groupName + " " + group.groupDescription + " "
                + group.userCreating + " " + group.users + " " + group.managers);
        // Todo, put in system

        return new ResponseEntity<>(header, HttpStatus.OK);
    }

    @PostMapping("/{groupName}/uploadProfilePicture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @PathVariable("groupName") String groupName,
            @RequestParam("file") MultipartFile file) {
        //System.out.println("HIIIII");

        try {
            System.out.println("Received request to upload profile picture for user ID: " + groupName);
            System.out.println("File name: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize());
            String profilePictureUrl = gs.uploadProfilePicture(groupName, file);
            return new ResponseEntity<>(Map.of("profilePicture", profilePictureUrl), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/{user}/req", consumes = "application/json")
    public void reqJoin(@PathVariable("user") String user, @RequestBody List<String> list) {
        List<Groups> allGroupsList = gs.getAllGroups();
        List<String> reqs = list;
        for (Groups g : allGroupsList) {
            if (reqs.contains(g.getGroupName())) {

                if (g.getRequests() == null) {
                    g.setRequests(new ArrayList<>());
                }
                List<Integer> newReqList = g.getRequests();
                newReqList.add(Integer.parseInt(user));
                g.setRequests(newReqList);
                System.out.println(user + " " + newReqList.get(0) + " " + g.getGroupName());
                gs.save(g);
            }
        }
    }

    @PostMapping(path = "/{user}/acc", consumes = "application/json")
    public void accInv(@PathVariable("user") String user, @RequestBody List<String> list) {
        List<Groups> allGroupsList = gs.getAllGroups();
        List<String> acc = list;
        for (Groups g : allGroupsList) {
            if (acc.contains(g.getGroupName())) {
                List<Integer> newUsers = g.getUsers();
                newUsers.add(Integer.parseInt(user));
                g.setUsers(newUsers);
                System.out.println(user + " " + newUsers.get(0) + " " + g.getGroupName());
                gs.save(g);
            }
        }
    }

    @GetMapping("/{user}/view")
    public ArrayList<Groups> viewGoal(@PathVariable("user") String user) {
        List<Groups> allGroupsList = gs.getAllGroups();
        ArrayList<Groups> allGroups = new ArrayList<>();
        for (Groups g : allGroupsList) {
            if (g.getUsers().contains(Integer.parseInt(user))) {
                allGroups.add(g);
                System.out.println(g.getGroupName());
                System.out.println(g.getManagers());
            } else if (g.getManagers().contains(Integer.parseInt(user))) {
                allGroups.add(g);
            }
            if (g.getGroupId().equals("c170105c-ab66-4696-9a52-c3e7a01461cd")) {
                System.out.println(g.getGroupName());
                System.out.println(g.getManagers());
            }
        }
        return allGroups;
    }
    @GetMapping("/{user}/rij")
    public ArrayList<String> viewReqs(@PathVariable("user") String user)
    {
        List<Groups> allGroupsList = gs.getAllGroups();
        ArrayList<String> allGroups = new ArrayList<>();
        ArrayList<String> join = new ArrayList<>();
        ArrayList<String> req = new ArrayList<>();
        ArrayList<String> inv = new ArrayList<>();
        for (Groups g : allGroupsList) {
            if (g.getUsers().contains(Integer.parseInt(user))) {
                continue;
            }
            if (g.getRequests() != null && g.getRequests().contains(Integer.parseInt(user))) {
                req.add(g.getGroupName());
            } else if (g.getInvitations() != null && g.getInvitations().contains(Integer.parseInt(user))) {
                inv.add(g.getGroupName());
            } else {
                join.add(g.getGroupName());
            }
        }
        allGroups.add("j");
        allGroups.addAll(join);
        allGroups.add("r");
        allGroups.addAll(req);
        allGroups.add("i");
        allGroups.addAll(inv);
        System.out.println(allGroups);
        return allGroups;

    }

    @GetMapping("/{groupId}/viewgroup")
    public ResponseEntity<List<User>> viewGroup(@PathVariable("groupId") String groupId) {
        System.out.println( groupId);
        try {
            List<Groups> allGroupsList = gs.getAllGroups();
            List<Integer> userGroups = new ArrayList<>();
            List<User> allUsers = us.getAllUsers();
            List<User> newUsers = new ArrayList<>();

            for (Groups g : allGroupsList) {
                if (g.getGroupId().equals(groupId)) {
                    userGroups = g.getUsers();
                    break;
                }
            }

            for (Integer u : userGroups) {
                for (User user: allUsers) {
                    if (u.intValue() == user.getId()) {
                        newUsers.add(user);
                        break;
                    }

                }
            }

            return ResponseEntity.ok(newUsers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    private static class GroupPkgEdit {
        public GroupPkgEdit(String groupName, String groupDescription, ArrayList<Integer> managers, ArrayList<Integer> users, String userCreating, String groupId, ArrayList<Integer> requests, ArrayList<Integer> invitations) {
            this.groupName = groupName;
            this.groupDescription = groupDescription;
            this.managers = managers;
            this.users = users;
            this.groupId = groupId;
            this.userCreating = userCreating;
            this.requests = requests;
            this.invitations = invitations;
        }

        public GroupPkgEdit() {
        };

        public String groupName;
        public String groupDescription;
        public ArrayList<Integer> managers; //list
        public ArrayList<Integer> users; //list
        public ArrayList<Integer> requests;
        public ArrayList<Integer> invitations;

        public String userCreating;
        public String groupId;

        // public image;

        @Override
        public String toString() {
            return groupName + " " + groupDescription + " " + managers + " " + users + " " + groupId;// + " " +
                                                                                                     // image.toString();
        }
    }

    @PostMapping(path = "/{user}/edit", consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<String> editGoal(@PathVariable("user") String user, @RequestPart("group") GroupPkgEdit group, @RequestPart(value = "image", required = false) MultipartFile file) {
        //System.out.println(user);
        //GroupPkg group = new GroupPkg();
        //System.out.println(group);
        //System.out.println(file);
        //System.out.println((TimeOfDayGoal)goal);
        //System.out.println((QualityGoal) goal);
        int userId;
        if (user.equals("")) {
            userId = 12345;
        } else {
            userId = Integer.parseInt(user);
        }
        // Todo, check for duplicates and create groupservice
        List<Groups> allGroups = gs.getAllGroups();
        for (Groups g : allGroups) {
            if (g.getGroupName().equalsIgnoreCase(group.groupName) && !g.getGroupId().equals(group.groupId)) {
                HttpHeaders header = new HttpHeaders();
                header.add("Duplicate", "Duplicate group");
                return new ResponseEntity<>(header, HttpStatus.CONFLICT);
            }
        }
        Groups targetGroup = null;
        for (Groups g : allGroups) {
            if (g.getGroupId().equals(group.groupId)) {
                targetGroup = g;
            }
        }
        // targetGroup.setUsers(group.users);
        // TODO need to parse string for users
        targetGroup.setGroupDescription(group.groupDescription);
        targetGroup.setGroupName(group.groupName);
        targetGroup.setManagers(group.managers);
        targetGroup.setRequests(group.requests);
        targetGroup.setInvitations(group.invitations);
        //add users if they are managers
        ArrayList<Integer> newUsers = group.users;
        for (Integer i : targetGroup.getManagers()) {
            boolean found = false;
            for (Integer j : group.users) {
                if (i.intValue() == j.intValue()) {
                    found = true;
                }
            }
            if (!found) {
                newUsers.add(i);
            }
        }
        targetGroup.setUsers(newUsers);
        // targetGroup.setGroupId(UUID.randomUUID().toString());
        Groups theGroup = gs.save(targetGroup);
        //System.out.println("Test pic");
        //System.out.println(file);
        if (file != null){
            try {
                System.out.println("uploading pic");
                gs.uploadProfilePicture(theGroup.getGroupId(), file);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            gs.save(theGroup);
        }

        HttpHeaders header = new HttpHeaders();
        header.add("200", "uno");
        // System.out.println("Received New Group: " + group.groupName + " " +
        // group.groupDescription + " " + group.userCreating + " " + group.users + " " +
        // group.managers);
        // Todo, put in system

        return new ResponseEntity<>(header, HttpStatus.OK);
    }

    @PostMapping("/{userId}/announcement/{groupId}")
    public ResponseEntity<?> addAnnouncement(
            @PathVariable String userId,
            @PathVariable String groupId,
            @RequestBody AnnouncementRequest announcementRequest) { // Use a request class
        try {
            // First check if user is a manager
            Groups group = gs.getGroupById(groupId);
            System.out.println("GroupID: " + groupId);
            System.out.println("User trying to post: " + userId);
            System.out.println("Managers list: " + group.getManagers());
            System.out.println("Is user in managers? " + group.getManagers().contains(Integer.parseInt(userId)));
            if (!group.getManagers().contains(Integer.parseInt(userId))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only group managers can post announcements");
            }

            Announcement announcement = new Announcement();
            announcement.setTitle(announcementRequest.title);
            announcement.setMessage(announcementRequest.message);
            announcement.setTimestamp(System.currentTimeMillis());

            group = gs.addAnnouncement(groupId, Integer.parseInt(userId), announcement);
            return ResponseEntity.ok(group);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{userId}/announcement/{groupId}/{index}")
    public ResponseEntity<?> updateAnnouncement(
            @PathVariable String userId,
            @PathVariable String groupId,
            @PathVariable int index,
            @RequestBody AnnouncementRequest announcementRequest) {
        try {
            // First check if user is a manager
            Groups group = gs.getGroupById(groupId);
            if (!group.getManagers().contains(Integer.parseInt(userId))) {
                System.out.println("User " + userId + " is not in managers list: " + group.getManagers());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only group managers can edit announcements");
            }

            Announcement updatedAnnouncement = new Announcement();
            updatedAnnouncement.setTitle(announcementRequest.title);
            updatedAnnouncement.setMessage(announcementRequest.message);
            updatedAnnouncement.setTimestamp(System.currentTimeMillis());

            group = gs.updateAnnouncement(groupId, Integer.parseInt(userId), index, updatedAnnouncement);
            return ResponseEntity.ok(group);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/announcements/{groupId}")
    public ResponseEntity<?> getAnnouncements(@PathVariable String groupId) {
        try {
            List<Announcement> announcements = gs.getAnnouncements(groupId);
            return ResponseEntity.ok(announcements);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{groupId}/announcements/{index}")
    public ResponseEntity<?> deleteAnnouncement(
            @PathVariable String groupId,
            @PathVariable int index,
            @RequestParam Integer userId) {
        try {
            Groups group = gs.deleteAnnouncement(groupId, userId, index);
            return ResponseEntity.ok(group);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private static class AnnouncementRequest {
        public String title;
        public String message;
    }

    @GetMapping("/{userId}/all-announcements")
    public ResponseEntity<?> getAllUserAnnouncements(@PathVariable String userId) {
        try {
            System.out.println("Fetching all announcements for user: " + userId);
            List<Announcement> allAnnouncements = new ArrayList<>();

            // Get all groups the user is in
            List<Groups> userGroups = gs.getAllGroups().stream()
                    .filter(group -> group.getUsers().contains(Integer.parseInt(userId)) ||
                            group.getManagers().contains(Integer.parseInt(userId)))
                    .toList();

            // Collect announcements from each group
            for (Groups group : userGroups) {
                if (group.getAnnouncements() != null) {
                    // Add group information to each announcement
                    List<Announcement> groupAnnouncements = group.getAnnouncements().stream()
                            .map(announcement -> {
                                announcement.setGroupId(group.getGroupId());
                                announcement.setGroupName(group.getGroupName());
                                return announcement;
                            })
                            .toList();
                    allAnnouncements.addAll(groupAnnouncements);
                }
            }

            // Sort by timestamp, newest first
            allAnnouncements.sort((a1, a2) -> Long.compare(a2.getTimestamp(), a1.getTimestamp()));

            return ResponseEntity.ok(allAnnouncements);
        } catch (Exception e) {
            System.out.println("Error fetching announcements: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
