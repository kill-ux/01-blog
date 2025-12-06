package api.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import api.model.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Service for handling JSON Web Tokens (JWT).
 * Provides methods for generating, validating, and extracting claims from JWTs.
 */
@Service
public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    /**
     * Extracts the nickname from a JWT token.
     * @param token The JWT token.
     * @return The nickname from the token.
     */
    public String extractNickname(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts a specific claim from a JWT token.
     * @param <T> The type of the claim.
     * @param token The JWT token.
     * @param claimsResolver A function to extract the claim.
     * @return The extracted claim.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Returns the configured JWT expiration time.
     * @return The JWT expiration time in milliseconds.
     */
    public long getExpirationTime() {
        return jwtExpiration;
    }

    /**
     * Generates a JWT token for a user.
     * @param user The user for whom to generate the token.
     * @return The generated JWT token.
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("role", user.getRole());
        claims.put("email", user.getEmail());
        claims.put("avatar", user.getAvatar());
        return generateToken(claims, user);
    }

    /**
     * Generates a JWT token with extra claims.
     * @param extraClaims Extra claims to include in the token.
     * @param user The user for whom to generate the token.
     * @return The generated JWT token.
     */
    public String generateToken(Map<String, Object> extraClaims, User user) {
        return buildToken(extraClaims, user, jwtExpiration);
    }

    /**
     * Builds a JWT token with the specified claims, subject, and expiration.
     * @param extraClaims Extra claims to include in the token.
     * @param userDetails The user details.
     * @param expiration The expiration time in milliseconds.
     * @return The constructed JWT token.
     */
    public String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration) {
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Extracts all claims from a JWT token.
     * @param token The JWT token.
     * @return The claims from the token.
     */
    public Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token.trim())
                .getPayload();
    }

    /**
     * Returns the signing key for the JWT.
     * @return The SecretKey for signing the JWT.
     */
    public SecretKey getSignInKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
