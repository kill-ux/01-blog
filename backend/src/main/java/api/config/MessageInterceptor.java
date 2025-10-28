package api.config;


import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import api.service.JwtService;

@Configuration
@RequiredArgsConstructor
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE + 99) /// ensure its used before spring securities interceptor
public class MessageInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    /// this interceptor is used to intercept all STOMP connect frames
    /// we validate the users token sent in the headers of the connect frame and
    /// sets the principal in the ws context,
    /// this way we associate the websocket session with this specific user.
    /// other frames like SEND,SUBSCRIBE use this same principal as the
    /// authenticated user

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        assert accessor != null;
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            /// this checks if the command being sent is a CONNECT command
            /// a user will not be able to send any frames unless they are connected to a
            /// STOMP protocol
            var authHeaderList = accessor.getNativeHeader("Authorization");

            assert authHeaderList != null;
            /// header returns a list of strings
            String authHeader = authHeaderList.get(0);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String jwt = authHeader.substring(7);
                String username = jwtService.extractNickname(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authenticatedUser = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                accessor.setUser(authenticatedUser); /// setting the context of the user as the principal

            } else {
                log.info("Authorization header not present");
            }

        }

        /// if any other frames are being sent they don't need authentication as it is
        /// already set
        return message;
    }
}