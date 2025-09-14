package api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.subscription.SubscribeRequest;
import api.model.user.UserRecord;
import api.service.UserService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    public ResponseEntity<String> postMethodName(@Valid @RequestBody SubscribeRequest subscribeRequest) {
        this.userService.subscribe(subscribeRequest);
        return ResponseEntity.ok("");
    }
    

}
