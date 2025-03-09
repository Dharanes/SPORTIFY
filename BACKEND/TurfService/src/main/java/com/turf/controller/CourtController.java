package com.turf.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.turf.dto.CourtDto;
import com.turf.dto.CourtIdDto;
import com.turf.model.Court;
import com.turf.service.TurfService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CourtController {

	private final TurfService turfService;
	
	@PostMapping("/owner/addCourtsToGame/{id}/{gameName}")
	public ResponseEntity<List<CourtDto>> addCourtsToGame(@PathVariable Long id, @PathVariable String gameName,
			@RequestBody Court courts) {
		return ResponseEntity.status(HttpStatus.OK).body(turfService.addCourtToGame(id, gameName, courts));
	}

	@PutMapping("/freeACourt/{turfId}/{gameName}/{courtId}/{timeSlotId}/{duration}")
	public String freeACourt(@PathVariable Long turfId, @PathVariable String gameName, @PathVariable Long courtId,
			@PathVariable Long timeSlotId, @PathVariable Integer duration) {
		turfService.freeACourt(turfId, gameName, courtId, timeSlotId, duration);
		return "Updated";
	}

	@GetMapping("/getTimeSlot/{turfId}/{gameId}/{selectedDate}")
	public List<LocalTime> getTimeSlot(@PathVariable Long turfId, @PathVariable Long gameId,
			@PathVariable LocalDate selectedDate) {
		return turfService.getTimeSlot(turfId, gameId, selectedDate);
	}

	@GetMapping("/getCourtByTimeSlot/{gameId}/{selectedDate}/{selectedTimeSlot}/{duration}")
	public List<CourtIdDto> getCourtNames(@PathVariable Long gameId,
			@PathVariable LocalDate selectedDate, @PathVariable String selectedTimeSlot, @PathVariable int duration) {
		return turfService.getCourtName(gameId, selectedDate, selectedTimeSlot, duration);
	}
	
	@GetMapping("/getPrice/{courtId}")
	public double getPrice(@PathVariable Long courtId) {
		return turfService.getPrice(courtId);
	}
	
	@GetMapping("/getCourtName/{courtId}")
	public String getCourtName(@PathVariable Long courtId) {
		return turfService.courtName(courtId);
	}

}
