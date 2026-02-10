package com.antananarivo.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret:dev-secret}")
    private String secret;

    @Value("${jwt.exp:3600000}")
    private long expMillis;

    private Key signingKey(){
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        // Ensure key is at least 32 bytes (256 bits) for HS256
        if (bytes.length < 32){
            byte[] padded = new byte[32];
            for (int i = 0; i < padded.length; i++){
                padded[i] = bytes[i % bytes.length];
            }
            bytes = padded;
        }
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(String subject){
        long now = System.currentTimeMillis();
        Key key = signingKey();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expMillis))
                .signWith(key)
                .compact();
    }

    public String getSubjectFromToken(String token){
        try{
            Key key = signingKey();
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return claims.getBody().getSubject();
        } catch (JwtException ex){
            return null;
        }
    }

    public boolean validateToken(String token){
        return getSubjectFromToken(token) != null;
    }
}
