package com.customer.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.customer.model.Booking;

@FeignClient(name="BookingService",url = "http://localhost:8083")
public interface BookingFeign {

	@GetMapping("/admin/getBookingByUser/{userId}")
	public List<Booking> getBookingByUser(@PathVariable Long userId);
	
	@PutMapping("/cancel/{id}")
	public void cancel(@PathVariable Long id);
}
