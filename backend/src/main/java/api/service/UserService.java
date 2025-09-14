package api.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.hibernate.Hibernate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.model.subscription.SubscribeRequest;
import api.model.user.LoginRequest;
import api.model.user.LoginResponse;
import api.model.user.User;
import api.model.user.UserRecord;
import api.repository.UserRepository;
import jakarta.validation.Valid;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public UserRepository getUserRepository() {
        return this.userRepository;
    }

    public List<UserRecord> getAllUsers() {
        return this.userRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Optional<UserRecord> getUserById(long id) {
        return this.userRepository
                .findById(id)
                .map(this::convertToDTO);
    }

    public UserRecord saveUser(@Valid UserRecord userRecord) {

        User user = convertToEntity(userRecord);
        user.setRole("ROLE_USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        User savedUser;
        try {
            savedUser = this.userRepository.save(user);
            return convertToDTO(savedUser);
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            String err = "Data conflict - please check your input";
            if (errorMessage.contains("nickname") && errorMessage.contains("unique")) {
                err = "Username already exists";
            } else if (errorMessage.contains("email") && errorMessage.contains("unique")) {
                err = "Email already registered";
            }
            throw new IllegalStateException(err);
        }
    }

    public void deleteUser(long id) {
        this.userRepository.deleteById(id);
    }

    private User convertToEntity(UserRecord userRecord) {
        User user = new User();
        user.setId(userRecord.id());
        user.setNickname(userRecord.nickname());
        user.setEmail(userRecord.email());
        user.setPassword(userRecord.password());
        user.setRole(userRecord.role());
        user.setAvatar(userRecord.avatar());
        user.setBannedUntil(userRecord.bannedUntil());
        user.setBirthDate(userRecord.birthDate());
        user.setCreatedAt(userRecord.createdAt());
        user.setUpdatedAt(userRecord.updatedAt());
        return user;
    }

    private UserRecord convertToDTO(User user) {
        return new UserRecord(user.getId(), user.getNickname(), user.getEmail(), user.getPassword(), user.getRole(),
                user.getAvatar(), user.getBannedUntil(), user.getBirthDate(), user.getCreatedAt(), user.getUpdatedAt());
    }

    public LoginResponse login(@Valid LoginRequest loginRequest) {
        try {
            // Authenticate credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.nickname(), loginRequest.password()));
            // Load the full user details after successful authentication
            User user = (User) authentication.getPrincipal();
            // Generate token with user details (not just nickname)
            String jwtToken = jwtService.generateToken(user);
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(jwtToken);
            loginResponse.setExpiresIn(jwtService.getExpirationTime());
            return loginResponse;

        } catch (Exception e) {
            // This covers both wrong password and non-existent user
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public void subscribe(@Valid SubscribeRequest subscribeRequest) {
        // Get username from security context
        long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        // Fetch the user from database within the transaction
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User target = userRepository.findById(subscribeRequest.subscriberToId())
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        boolean isSubscribed = new HashSet<>(user.getSubscribers()).contains(target);

        if (isSubscribed) {
            user.getSubscribers().remove(target);
            // target.getSubscribed_to().remove(user);
        } else {
            user.getSubscribers().add(target);
            // target.getSubscribed_to().add(user);
        }

        userRepository.save(user);
        // userRepository.save(target);
    }

}
