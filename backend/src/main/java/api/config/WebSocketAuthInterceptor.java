// WebSocketAuthInterceptor.java
package api.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;

            // Get JWT token from query parameters or headers
            String token = extractToken(servletRequest);

            if (token != null && validateToken(token)) {
                String username = extractUsernameFromToken(token);
                attributes.put("username", username);
                System.out.println("WebSocket authenticated for user: " + username);
                return true;
            }
        }
        return false; // Reject handshake if not authenticated
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Exception exception) {
        // Optional: post-handshake logic
    }

    private String extractToken(ServletServerHttpRequest request) {
        // Try to get token from query parameters
        String token = request.getServletRequest().getParameter("token");
        if (token != null)
            return token;

        // Or from headers
        String authHeader = request.getServletRequest().getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        return null;
    }

    private boolean validateToken(String token) {
        // Implement your JWT validation logic
        // Return true if valid, false otherwise
        return true; // Simplified for example
    }

    private String extractUsernameFromToken(String token) {
        // Extract username from JWT token
        // This is a simplified example
        return "user_from_token"; // Replace with actual extraction
    }
}