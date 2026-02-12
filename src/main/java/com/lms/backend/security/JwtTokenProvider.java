package com.lms.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    // For development, use a fixed secret to keep tokens valid after restart
    private final String secretString = "9a4f2c8d3b7a1e5f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b1c0d9e8f7g6h5i4j3k2l1";
    private final Key jwtSecret = Keys.hmacShaKeyFor(secretString.getBytes());
    private final long jwtExpiration = 86400000; // 24 hours

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        // Extract roles from authentication
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Include role in JWT claims
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("roles", roles);

        // Get the first role as main role
        if (!roles.isEmpty()) {
            claims.put("role", roles.get(0));
        }

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecret, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        return getUsernameFromToken(token);
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(jwtSecret)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException ex) {
            System.err.println("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            System.err.println("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            System.err.println("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            System.err.println("JWT claims string is empty");
        } catch (Exception ex) {
            System.err.println("JWT validation error: " + ex.getMessage());
        }
        return false;
    }

    // Extract role from token
    public String getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecret)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Try to get role from claims
            String role = (String) claims.get("role");
            if (role != null) {
                return role;
            }

            // Fallback to roles list
            List<String> roles = (List<String>) claims.get("roles");
            if (roles != null && !roles.isEmpty()) {
                return roles.get(0);
            }

            return "ROLE_STUDENT"; // Default fallback
        } catch (Exception ex) {
            System.err.println("Error extracting role from token: " + ex.getMessage());
            return "ROLE_STUDENT";
        }
    }
}