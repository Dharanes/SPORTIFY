package com.booking.feign;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.booking.dto.TimeSlotDto;
import com.booking.model.TurfDto;

@FeignClient(name="TurfService",url = "http://localhost:8080")
public interface TurfClient {

@GetMapping("/getAvailableSlots/{turfId}/{gameName}/{date}/{courtId}/{duration}")
public List<TimeSlotDto> getAvailableSlots(@PathVariable Long turfId, @PathVariable String gameName,
		@PathVariable Long courtId,@PathVariable int duration,@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date);

@PutMapping("/admin/bookASlot/{turfId}/{gameName}/{date}/{courtId}/{timeSlotId}/{duration}")
public void bookASlot(@PathVariable Long turfId, @PathVariable String gameName,
		@PathVariable Long courtId,@PathVariable Long timeSlotId,@PathVariable int duration,@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date);

@PutMapping("/freeACourt/{turfId}/{gameName}/{courtId}/{timeSlotId}/{duration}")
public String freeACourt(@PathVariable Long turfId, @PathVariable String gameName, @PathVariable Long courtId,
		@PathVariable Long timeSlotId,@PathVariable Integer duration);

@GetMapping("/turfImage/{turfName}")
public String getTurfImage(@PathVariable String turfName);

@GetMapping("/turfName/{turfId}")
public String getTurfName(@PathVariable Long turfId);

@GetMapping("/turf/{turfId}")
public TurfDto getTurf(@PathVariable Long turfId);

@GetMapping("/getCourtName/{courtId}")
public String getCourtName(@PathVariable Long courtId);



}