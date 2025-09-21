package api.controller.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.blog.BlogResponse;
import api.model.notification.NotificationResponse;
import api.model.subscription.SubscribeRequest;
import api.model.user.User;
import api.model.user.UserDto;
import api.model.user.UserRecord;
import api.service.BlogService;
import api.service.NotificationService;
import api.service.UserService;
import jakarta.validation.Valid;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final BlogService blogService;
    private final NotificationService notificationService;

    public UserController(UserService userService, BlogService blogService, NotificationService notificationService) {
        this.userService = userService;
        this.blogService = blogService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<UserRecord>> users(@RequestParam(defaultValue = "0") int pageNumber) {
        List<UserRecord> users = this.userService.getAllUsers(pageNumber);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@Valid @RequestBody SubscribeRequest subscribeRequest) {
        String operation = this.userService.subscribe(subscribeRequest);
        return ResponseEntity.ok("successful operation: " + operation);
    }

    @GetMapping("{userId}/subscribers")
    public ResponseEntity<List<UserDto>> getSubscribers(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.userService.getSubscribers(userId, cursor));
    }

    @GetMapping("{userId}/subscribtions")
    public ResponseEntity<List<UserDto>> getSubscriptions(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.userService.getSubscriptions(userId, cursor));
    }

    @GetMapping("{userId}/blogs")
    public ResponseEntity<List<BlogResponse>> getBlogsByUser(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        List<BlogResponse> savedBlog = this.blogService.getBlogsByUser(userId, cursor);
        return ResponseEntity.ok(savedBlog);
    }

    @GetMapping("/notification")
    public ResponseEntity<List<NotificationResponse>> getnotification(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") long cursor) {
        List<NotificationResponse> savedBlog = this.notificationService.getNotification(user.getId(), cursor);
        return ResponseEntity.ok(savedBlog);
    }

    @PatchMapping("/notification/{ntfId}/review")
    public ResponseEntity<NotificationResponse> readNotification(
            @AuthenticationPrincipal User user,
            @PathVariable long ntfId) {
        return ResponseEntity.ok(this.notificationService.readNotification(ntfId, user.getId()));
    }

}
