package com.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.gateway.exception.TokenExpiredException;
import com.gateway.util.JwtUtil;

import reactor.core.publisher.Mono;

import java.util.Arrays;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            try {
                // Validate and parse token
                Claims claims = JwtUtil.extractClaims(token);
                if (JwtUtil.isTokenExpired(claims)) {
                    throw new TokenExpiredException("Token has expired");
                }

                String username = JwtUtil.getUsername(claims);
                String r = JwtUtil.getRoles(claims);
                String[] roles = { r };
                var authorities = Arrays.stream(roles)
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .toList();

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        username, null, authorities);

                SecurityContext context = new SecurityContextImpl(authenticationToken);
                request = exchange.getRequest().mutate().header("loggedInUser", username).build();

                return chain.filter(exchange)
                        .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(context)));

            } catch (TokenExpiredException ex) {
                return handleException(exchange, "Token has expired", HttpStatus.UNAUTHORIZED);
            } catch (SignatureException | MalformedJwtException ex) {
                return handleException(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
            } catch (Exception ex) {
                return handleException(exchange, "Authentication error", HttpStatus.BAD_REQUEST);
            }
        }

        return chain.filter(exchange);
    }

    private Mono<Void> handleException(ServerWebExchange exchange, String message, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        byte[] bytes = ("{\"error\": \"" + message + "\"}").getBytes();
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse().bufferFactory().wrap(bytes)));
    }
}
