package com.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import com.gateway.filter.JwtAuthenticationFilter;


@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
	
	private static final String ROLE_USER = "ROLE_USER";
	private static final String ROLE_ADMIN = "ROLE_ADMIN";
	private static final String ROLE_OWNER = "ROLE_OWNER";

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
        		.cors(cors->cors.configurationSource(corsConfiguration()))
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/customer-service/public/**").permitAll()
                .pathMatchers("/turf-service/public/**").permitAll()
                .pathMatchers("/swagger-ui/**").permitAll()
                .pathMatchers("/v3/api-docs/**").permitAll()
                .pathMatchers("/actuator/**").permitAll() 
//                .pathMatchers(HttpMethod.GET,"customer-service/admin/**").hasRole(ROLE_ADMIN)
                .pathMatchers(HttpMethod.POST,"turf-service/owner/**").hasRole(ROLE_OWNER)
                .pathMatchers(HttpMethod.PUT,"turf-service/owner/**").hasRole(ROLE_OWNER)
                .pathMatchers(HttpMethod.PUT,"turf-service/admin/**").hasRole(ROLE_ADMIN)
                .pathMatchers("booking-service/admin/**").hasRole(ROLE_ADMIN)
                .pathMatchers("booking-service/**").hasRole(ROLE_USER)
                .anyExchange().authenticated()
            )
            .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .csrf(CsrfSpec::disable)
            .build();
    }
    
    
    @Bean
    public CorsConfigurationSource corsConfiguration() {
    	CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173");  
        config.addAllowedMethod("*");  
        config.addAllowedHeader("*");  
        config.setAllowCredentials(true);  
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
