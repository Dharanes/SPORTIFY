package com.turf.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.turf.model.Customer;
import com.turf.model.CustomerSendDto;


@FeignClient(name="customerservice", url="http://localhost:8081")
public interface OwnerClient {
	
	@GetMapping("/admin/fetchUserByEmail/{email}")
	CustomerSendDto getCustomerByEmail(@PathVariable String email); 
	
	@GetMapping("/byId/{id}")
	public Customer getById(@PathVariable Long id);

}
