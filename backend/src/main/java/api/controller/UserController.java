package api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.blog.BlogResponse;
import api.model.subscription.SubscribeRequest;
import api.model.user.UserDto;
import api.model.user.UserRecord;
import api.service.BlogService;
import api.service.UserService;
import jakarta.validation.Valid;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final BlogService blogService;

    public UserController(UserService userService, BlogService blogService) {
        this.userService = userService;
        this.blogService = blogService;
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
            @RequestParam(defaultValue = "0") int pageNumber) {
        return ResponseEntity.ok(this.userService.getSubscribers(userId, pageNumber));
    }

    @GetMapping("{userId}/subscriptions")
    public ResponseEntity<List<UserDto>> getSubscriptions(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") int pageNumber) {
        return ResponseEntity.ok(this.userService.getSubscriptions(userId, pageNumber));
    }

    @GetMapping("{userId}/blogs")
    public ResponseEntity<List<BlogResponse>> getBlogsByUser(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") int pageNumber) {
        List<BlogResponse> savedBlog = this.blogService.getBlogsByUser(userId, pageNumber);
        return ResponseEntity.ok(savedBlog);
    }

}
