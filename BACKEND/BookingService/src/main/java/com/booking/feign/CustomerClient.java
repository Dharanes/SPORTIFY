package com.booking.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.booking.dto.Customer;

@FeignClient(name = "customerservice", url = "http://localhost:8081")
public interface CustomerClient {

	@GetMapping("/byId/{id}")
	public Customer getById(@PathVariable Long id);

}