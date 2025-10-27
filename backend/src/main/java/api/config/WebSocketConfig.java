// WebSocketConfig.java
package api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final MessageInterceptor messageInterceptor;

    /**
     * this is the endpoint that clients will use to initiate a web socket
     * connection and a header upgrade
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:4200"); // <-- ADD THIS LINE
                // .addInterceptors(new WebSocketAuthInterceptor());
                // .withSockJS();
    }

    /**
     * these are destination prefixes
     * the /app is similar to request mapping meaning it routes all request paths to
     * the correct
     * method with the @MessageMapping annotation.
     * /user represents the prefix for one to one messaging
     * the broker essentially distributes any updates it receives to any clients
     * that are subscribed to it
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // This is the part you are missing.
        // It enables a simple in-memory broker to send messages back to clients
        // on destinations prefixed with "/queue" and "/user"
        registry.enableSimpleBroker("/queue");

        // This sets the prefix for user-specific destinations
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * assuming you want to send credentials for every subsequent frame over the
     * STOMP protocol, we can implement a
     * channel interceptor, the channel interceptor intercepts each and every
     * request
     * 
     * @param registration - allows us to set the interceptor
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(messageInterceptor);
    }

}
