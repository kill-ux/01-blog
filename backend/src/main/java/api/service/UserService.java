package api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.hibernate.Hibernate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import api.model.subscription.SubscribeRequest;
import api.model.user.LoginRequest;
import api.model.user.LoginResponse;
import api.model.user.User;
import api.model.user.UserDto;
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

    public List<UserRecord> getAllUsers(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC, "id");
        return this.userRepository
                .findAll(pageable)
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

    // @Transactional
    public void banUser(long id, LocalDateTime until) {
        User user = this.userRepository.findById(id).get();
        user.setBannedUntil(until);
        userRepository.save(user);
    }

    public void unBanUser(long id) {
        User user = this.userRepository.findById(id).get();
        user.setBannedUntil(null);
        userRepository.save(user);
    }

    public String adminify(long id) {
        User user = this.userRepository.findById(id).get();
        user.setRole("ROLE_ADMIN");
        userRepository.save(user);
        return String.format("%s successfully promoted to admin", user.getNickname());
    }

    public String deadminify(long id) {
        User user = this.userRepository.findById(id).get();
        user.setRole("ROLE_USER");
        userRepository.save(user);
        return String.format("%s successfully demoted to user", user.getNickname());
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

    private UserDto convertToDTO2(User user) {
        return new UserDto(user.getId(), user.getNickname(), user.getEmail(), user.getRole(),
                user.getAvatar(), user.getBannedUntil(), user.getBirthDate(), user.getCreatedAt(), user.getUpdatedAt());
    }

    public LoginResponse login(@Valid LoginRequest loginRequest) {
        try {
            // Authenticate credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.nickname(), loginRequest.password()));
            // Load the full user details after successful authentication
            User user = (User) authentication.getPrincipal();

            LocalDateTime until = user.getBannedUntil();
            if (until != null && until.isAfter(LocalDateTime.now())) {
                throw new DisabledException(String.format("Account is banned until ", until.toString()));
            }
            // Generate token with user details (not just nickname)
            String jwtToken = jwtService.generateToken(user);
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(jwtToken);
            loginResponse.setExpiresIn(jwtService.getExpirationTime());
            return loginResponse;

        } catch (DisabledException e) {
            throw e;
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public String subscribe(@Valid SubscribeRequest subscribeRequest) {
        long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        if (userId == subscribeRequest.subscriberToId()) {
            throw new IllegalArgumentException("you can't subscribe yourself");
        }

        User user = userRepository.findById(userId).get();
        User target = userRepository.findById(subscribeRequest.subscriberToId())
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        boolean isSubscribed = target.getSubscribers().contains(user);
        String operation = "subscribed";
        if (isSubscribed) {
            target.getSubscribers().remove(user);
            operation = "unsubscribed";
        } else {
            target.getSubscribers().add(user);
        }

        userRepository.save(target);
        return operation;
    }

    public List<UserDto> getSubscribers(long userId, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC, "id");
        return this.userRepository
                .findSubscribersBySubscribedToId(userId, pageable)
                .stream()
                .map(this::convertToDTO2)
                .toList();
    }

    public List<UserDto> getSubscriptions(long userId, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC, "id");
        return this.userRepository
                .findSubscriptionsBySubscribedId(userId, pageable)
                .stream()
                .map(this::convertToDTO2)
                .toList();
    }

}
