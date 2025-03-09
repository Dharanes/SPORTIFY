package com.turf.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.turf.model.Booking;

@FeignClient(name="BookingService",url = "http://localhost:8083")
public interface BookingClient {

	@GetMapping("/admin/getBookingByTurfName/{turfName}")
	public List<Booking> getBookingByTurfName(@PathVariable String turfName);
}
