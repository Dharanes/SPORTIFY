	package com.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {
	private static final String SEGMENT = "/${segment}";

	@Bean
	RouteLocator turfManagementRouteConfig(RouteLocatorBuilder routeLocatorBuilder) {
		return routeLocatorBuilder.routes()
				.route(p -> p.path("/turf-service/**")
						.filters(f -> f.rewritePath("/turf-service/(?<segment>.*)", SEGMENT))
						.uri("http://localhost:8080"))
				.route(p -> p.path("/customer-service/**")
						.filters(f -> f.rewritePath("/customer-service/(?<segment>.*)", SEGMENT))
						.uri("http://localhost:8081"))
				.route(p -> p.path("/booking-service/**")
						.filters(f -> f.rewritePath("/booking-service/(?<segment>.*)", SEGMENT))
						.uri("http://localhost:8083"))
				.route(p -> p.path("/payment-service/**")
						.filters(f -> f.rewritePath("/payment-service/(?<segment>.*)", SEGMENT))
						.uri("http://localhost:8084"))
				.build();
	}
}
