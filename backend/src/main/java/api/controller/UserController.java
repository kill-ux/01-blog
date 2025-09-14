package api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.subscription.SubscribeRequest;
import api.model.user.User;
import api.model.user.UserRecord;
import api.service.UserService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserRecord>> users() {
        List<UserRecord> users = this.userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@Valid @RequestBody SubscribeRequest subscribeRequest) {
        String operation = this.userService.subscribe(subscribeRequest);
        return ResponseEntity.ok("successful operation: " + operation);
    }

    @GetMapping("/subscribers")
    public ResponseEntity<Set<User>> getSubscribers() {
        return ResponseEntity.ok(this.userService.getSubscribers());
    }

    // @GetMapping("/subscriptions")
    // public ResponseEntity<List<User>> getSubscribers() {
    // return ResponseEntity.ok();
    // }
    @GetMapping("/subscriptions")
    public ResponseEntity<Set<User>> getSubscriptions() {
        return ResponseEntity.ok(this.userService.getSubscriptions());
    }

}
