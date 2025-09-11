package api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.user.LoginRequest;
import api.model.user.UserRecord;
import api.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserRecord> createUser(@RequestBody UserRecord user) {
        UserRecord savedUser = this.userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // @PostMapping("/login")
    // public String postMethodName(@RequestBody LoginRequest entity) {
    //     //TODO: process POST request
        
    //     return entity;
    // }
    
}
