package com.booking.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.booking.dto.BookingDto;
import com.booking.dto.BookingResponse;
import com.booking.dto.BookingUserTurfDto;
import com.booking.service.BookingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BookingController {
private final BookingService bookingService;

@PostMapping("/book/{turfId}/{gameName}/{date}/{courtId}/{timeSlot}/{duration}")
public ResponseEntity<?> bookATurf(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,@PathVariable Long turfId, @PathVariable String gameName,
		@PathVariable Long courtId, @PathVariable String timeSlot,@PathVariable int duration, @PathVariable LocalDate date) {
	bookingService.bookATurf(authorizationHeader, turfId, gameName, courtId, timeSlot, duration, date);
	return ResponseEntity.status(200).body("Booking success");
}

@PutMapping("/cancel/{id}")
public void cancel(@PathVariable Long id) {
	bookingService.cancelBooking(id);
}

@GetMapping("/getBookingByUser")
public List<BookingResponse> getBookingByUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
	return bookingService.getBookingByUser(authorizationHeader);
}

@GetMapping("/admin/getBookingByTurfId/{turfId}")
public List<BookingDto> getBookingByTurfId(@PathVariable Long turfId) {
	return bookingService.getBookingByTurfId(turfId);
}

@GetMapping("/admin/numberofbookings")
public Long numberOfBookings() {
	return bookingService.numberOfBookings();
}

@GetMapping("/admin/mostbookedturf")
public String mostBookedTurf() {
	return bookingService.mostBookedTurf();
}

@GetMapping("/admin/getAllBookings")
public List<BookingUserTurfDto> getAllBookings(){
	return bookingService.getAllBookings();
}

@PutMapping("/updateRating/{id}")
public String updateRating(@PathVariable Long id) {
	return bookingService.updateRating(id);
}


}