package group26.youdash.controller;

import group26.youdash.model.FollowRequest;
import group26.youdash.model.User;
import group26.youdash.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/privacy")
public class PrivacyController {

    @Autowired
    private UserService userService;

    @PostMapping("/{userId}/toggle")
    public ResponseEntity<String> togglePrivacy(
            @PathVariable int userId,
            @RequestParam boolean isPrivate) {
        try {
            userService.updatePrivacySettings(userId, isPrivate);
            return ResponseEntity.ok("Privacy settings updated successfully");
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{targetId}/follow-request")
    public ResponseEntity<String> sendFollowRequest(
            @PathVariable int targetId,
            @RequestParam int requesterId) {
        try {
            boolean directFollow = userService.handleFollowRequest(targetId, requesterId);
            if (directFollow) {
                return ResponseEntity.ok("Followed successfully");
            }
            return ResponseEntity.ok("Follow request sent");
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{userId}/pending-requests")
    public ResponseEntity<List<FollowRequest>> getPendingRequests(@PathVariable int userId) {
        try {
            List<FollowRequest> requests = userService.getPendingFollowRequests(userId);
            return ResponseEntity.ok(requests);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userId}/handle-request")
    public ResponseEntity<String> handleFollowRequest(
            @PathVariable int userId,
            @RequestParam int requesterId,
            @RequestParam boolean accept) {
        try {
            if (accept) {
                userService.acceptFollowRequest(userId, requesterId);
                return ResponseEntity.ok("Follow request accepted");
            } else {
                userService.rejectFollowRequest(userId, requesterId);
                return ResponseEntity.ok("Follow request rejected");
            }
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
