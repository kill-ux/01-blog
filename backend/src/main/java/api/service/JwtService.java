package api.service;

import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    public String extractNickname(String token) {
        
    }

    public <T> T extractClaim(String token,Function<Claims , T> claimsResolver) {
        final Claims claims = 
    }

    public Claims extractAllClaims(String token){
        return Jwts
            .parser()
            .verifyWith(getSignInKey)
            
    }

}
