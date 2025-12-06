package api.config;

import java.io.IOException;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.util.AntPathMatcher;

import api.model.user.User;
import api.service.JwtService;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// @Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    public RateLimiterRegistry rateLimiterRegistry;

    public RateLimiter isAllowedForUser(String IP) {
        return rateLimiterRegistry.rateLimiter(IP);
    }

    public JwtAuthenticationFilter(
            HandlerExceptionResolver handlerExceptionResolver,
            JwtService jwtService,
            UserDetailsService userDetailsService,
            RateLimiterRegistry rateLimiterRegistry) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.rateLimiterRegistry = rateLimiterRegistry;
    }

    // @Override
    protected boolean custemShouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        if (path == null) {
            return false;
        }
        return pathMatcher.match("/api/auth/**", path) ||
                pathMatcher.match("/api/images/**", path) ||
                pathMatcher.match("/api/ws/**", path);
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {

            var userLimiter = isAllowedForUser(request.getRemoteAddr());
            if (!userLimiter.acquirePermission()) {
                throw RequestNotPermitted.createRequestNotPermitted(userLimiter);
            }

            if (custemShouldNotFilter(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            final String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                final String jwt = authHeader.substring(7);
                final String nickname = jwtService.extractNickname(jwt);

                if (nickname != null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(nickname);

                    // var userLimiter = isAllowedForUser(userDetails.getUsername());
                    // if (!userLimiter.acquirePermission()) {
                    // throw RequestNotPermitted.createRequestNotPermitted(userLimiter);
                    // }

                    if (((User) userDetails).isBannedUntil()) {
                        throw new LockedException(String.format("Account is banned"));
                    }

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            handlerExceptionResolver.resolveException(request, response, null, ex);
        }

    }

}