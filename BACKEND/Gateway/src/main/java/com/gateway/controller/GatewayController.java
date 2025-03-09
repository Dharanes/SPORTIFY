package com.gateway.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.gateway.filter.JwtTokenProvider;
import com.gateway.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import reactor.core.publisher.Mono;

@RestController
public class GatewayController {
	@GetMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Extract claims
            Claims claims = JwtUtil.extractClaims(token);

            // Check if token is expired
            if (JwtUtil.isTokenExpired(claims)) {
                // Token is still valid
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Token is still valid.");
                response.put("token", token);
                return ResponseEntity.ok(response);
            }

            // If expired, issue a new token
            String username = JwtUtil.getUsername(claims);
            String roles = JwtUtil.getRoles(claims);

            // Create new token with extended expiration
            String newToken = createToken(username, roles);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Token refreshed successfully.");
            response.put("newToken", newToken);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }
    }
	private String createToken(String username, String roles) {
        long expirationMillis = 1000 * 60 * 60;
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
            .setSubject(username)
            .claim("role", roles)
            .setIssuedAt(now)
            .setExpiration(expiration)
            .signWith(JwtUtil.getSignKey())
            .compact();
    }
}
