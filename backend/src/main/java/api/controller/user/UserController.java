package api.controller.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.controller.blog.FileUploadController;
import api.model.blog.BlogResponse;
import api.model.notification.NotificationResponse;
import api.model.subscription.SubscribeRequest;
import api.model.user.User;
import api.model.user.UserDto;
import api.model.user.UserRecord;
import api.model.user.UserResponse;
import api.service.BlogService;
import api.service.NotificationService;
import api.service.UserService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(defaultValue = "0") long cursor) {
        List<UserResponse> users = this.userService.getAllUsers(cursor);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@Valid @RequestBody SubscribeRequest subscribeRequest) {
        String operation = this.userService.subscribe(subscribeRequest);
        return ResponseEntity.ok(Map.of("operation", operation));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, UserResponse>> getUserById(
            @RequestParam long userId) {
        return ResponseEntity.ok(Map.of("user", this.userService.getUserById(userId)));
    }

    @PatchMapping("/updateprofile")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String ext = "";
        if (fileName != null) {
            ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            if (!FileUploadController.ALLOWED_TYPES_IMAGES.contains(ext)) {
                throw new IllegalArgumentException("type not allowed");
            }
        }

        return ResponseEntity.ok(Map.of("url", this.userService.updateProfile(file, ext)));
    }

    @GetMapping("{userId}/subscribers")
    public ResponseEntity<List<UserResponse>> getSubscribers(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.userService.getSubscribers(userId, cursor));
    }

    @GetMapping("{userId}/subscribtions")
    public ResponseEntity<List<UserResponse>> getSubscriptions(
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
    public ResponseEntity<Map<String, Object>> getnotification(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.notificationService.getNotification(user.getId(), cursor));
    }

    @PatchMapping("/notification/{ntfId}/review")
    public ResponseEntity<NotificationResponse> readNotification(
            @AuthenticationPrincipal User user,
            @PathVariable long ntfId) {
        return ResponseEntity.ok(this.notificationService.readNotification(ntfId, user.getId()));
    }

}
