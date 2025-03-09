package com.customer.feign;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.customer.dto.TurfDto;
import com.customer.dto.BookingDto;

@FeignClient(name="turf-service",url="http://localhost:8080")
public interface TurfFeing {

	@GetMapping("/byOwner/{id}")
	public List<TurfDto> getAllTurfsByOwnerId(@PathVariable Long id);
	
	@GetMapping("/owner/getBookings")
	public Map<String, Map<String, List<BookingDto>>> getBookings(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader);
}
