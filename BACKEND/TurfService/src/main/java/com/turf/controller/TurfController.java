package com.turf.controller;

import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.turf.dto.ApprovedTurfDto;
import com.turf.dto.BookingDto;
import com.turf.dto.CourtDto;
import com.turf.dto.GamesIdDto;
import com.turf.dto.TimeSlotDto;
import com.turf.dto.TurfDto;
import com.turf.dto.TurfGameCourtDto;
import com.turf.dto.TurfGamesDto;
import com.turf.dto.PendingTurfDto;
import com.turf.dto.RatingDto;
import com.turf.exception.TurfNameAlreadyExistsException;
import com.turf.exception.TurfNotFoundException;
import com.turf.model.Turf;
import com.turf.service.TurfService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TurfController {

	private final TurfService turfService;

	@PostMapping("/owner/addTurf")
	public ResponseEntity<?> addTurf(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
			@RequestParam("turfName") String turfName,
		    @RequestParam("location") String location,
		    @RequestParam("imageUrl") MultipartFile imageUrl) throws TurfNameAlreadyExistsException {

		try {
	        Turf turf = new Turf();
	        turf.setTurfName(turfName);
	        turf.setLocation(location);
	        turf.setImageUrl(Base64.getEncoder().encodeToString(imageUrl.getBytes()));

	        Long id = turfService.addTurf(authorizationHeader,turf);

	        return ResponseEntity.ok(id);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
	    }
	}
	
	@GetMapping("/owner/getBookings")
	public Map<String, Map<String, List<BookingDto>>> getBookings(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader){
		
		return turfService.getBookings(authorizationHeader);
	}
	
	@GetMapping("/owner/getTurfs")
	public List<TurfDto> getTurfs(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
		return turfService.getTurfs(authorizationHeader); 
	}
	
	@GetMapping("/owner/getPendingRequests")
	public List<TurfDto> getPendingTurfs(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
		return turfService.getPendingTurfs(authorizationHeader); 
	}

	@GetMapping("/games")
	public ResponseEntity<List<TurfGamesDto>> getTurfGames() {

		List<TurfGamesDto> turfGames = turfService.getTurfGames();

		return ResponseEntity.status(HttpStatus.OK).body(turfGames);
	}

	@GetMapping("/byOwner/{id}")
	public List<TurfDto> getAllTurfsByOwnerId(@PathVariable Long id) {
		// used to map owner id with number of turfs
		return turfService.getAllTurfsByOwnerId(id);
	}

	@GetMapping("/byName/{name}")
	public ResponseEntity<List<TurfDto>> filterTurfByName(@PathVariable String name) throws TurfNotFoundException {
		List<TurfDto> filterByName = turfService.filterTurfByName(name);
		return ResponseEntity.status(200).body(filterByName);
	}

	@GetMapping("/byLocation/{loc}")
	public ResponseEntity<?> filterTurfByLocation(@PathVariable String loc) throws TurfNotFoundException {
		List<TurfDto> filterByLocation = turfService.filterTurfByLocation(loc);
		return ResponseEntity.status(200).body(filterByLocation);

	}
	@GetMapping("/public/byLocationAndGame/{location}/{gameName}")
	public List<Map<String, Object>> filterByLocationAndGame(@PathVariable String location,@PathVariable String gameName){
		return turfService.filterByLocationAndGame(location,gameName);
	}
	
	@PutMapping("/owner/updatePrice/{turfId}/{gameName}/{courtType}")
	public ResponseEntity<?> updateGameCourtTypePrice(@PathVariable Long turfId, @PathVariable String gameName,
			@PathVariable String courtType, @RequestBody CourtDto court) {		
		turfService.updateGameCourtTypePrice(turfId,gameName,courtType,court);
		
		return null;
	}

	@GetMapping("/getAvailableSlots/{turfId}/{gameName}/{date}/{courtId}/{duration}")
	public List<TimeSlotDto> getAvailableSlots(@PathVariable Long turfId, @PathVariable String gameName,
			@PathVariable Long courtId,@PathVariable int duration,@PathVariable LocalDate date){
		return turfService.getAvailableSlot(turfId,gameName,courtId,duration, date);
	}
	
	@PutMapping("/admin/bookASlot/{turfId}/{gameName}/{date}/{courtId}/{timeSlotId}/{duration}")
	public void bookASlot(@PathVariable Long turfId, @PathVariable String gameName,
			@PathVariable Long courtId,@PathVariable Long timeSlotId,@PathVariable int duration,@PathVariable LocalDate date) {
		
		turfService.bookATurf(turfId,gameName,courtId,timeSlotId,duration,date);
	}

	@DeleteMapping("/owner/deleteTurf/{turfName}")
	public String deleteTurf(@PathVariable String turfName) throws TurfNotFoundException {
		return turfService.deleteTurf(turfName);

	}
	
	@GetMapping("/public/getAllTurfs")
	public ResponseEntity<?> getAllTurfs(){
		List<TurfDto> turf = turfService.getAllTurfs();
		
		return ResponseEntity.status(200).body(turf);
	}
	
	@GetMapping("/turfName/{turfId}")
	public String getTurfName(@PathVariable Long turfId) {
		return turfService.getTurfName(turfId);
	}
	
	@GetMapping("/public/getTurfDetailsById/{turfId}")
	public List<TurfGameCourtDto> getTurfByName(@PathVariable Long turfId) {
		return turfService.getTurfByTurfName(turfId);
	}
	
	@GetMapping("/public/getGames/{turfId}")
	public List<GamesIdDto> getGames(@PathVariable Long turfId){
		return turfService.getGames(turfId);
	}
	
	@GetMapping("/turfImage/{turfName}")
	public String getTurfImage(@PathVariable String turfName) {
		return turfService.getTurfImage(turfName);
	}
	@GetMapping("/turf/{turfId}")
	public TurfDto getTurf(@PathVariable Long turfId) {
		return turfService.getTurf(turfId);
	}
	
	@GetMapping("/numberofturf")
	public Long numberOfTurf() {
		return turfService.numberOfTurf();
	}
	
	@GetMapping("/getPendingRequests")
	public List<PendingTurfDto> getPendingRequests(){
		return turfService.getPendingRequests();
	}
	@GetMapping("/getApprovedRequests")
	public List<ApprovedTurfDto> getApprovedRequests(){
		return turfService.getApprovedRequests();
	}
	
	@PutMapping("/updateStatus/{id}/{status}")
	public String updateStatus(@PathVariable Long id,@PathVariable String status) {
		return  turfService.updateStatus(id,status);
	}
	
	@PutMapping("/updateRatings/{turfId}/{rating}")
	public ResponseEntity<String> submitRating(
            @PathVariable Long turfId, 
            @PathVariable Double rating) {
		
		return turfService.submitRating(turfId,rating);
	}
	
	@GetMapping("/getRating/{turfId}")
	public RatingDto getRating(@PathVariable Long turfId) {
		return turfService.getRating(turfId);
	}
	
}
