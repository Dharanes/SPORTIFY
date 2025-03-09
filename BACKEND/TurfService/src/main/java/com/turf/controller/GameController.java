package com.turf.controller;

import java.time.LocalTime;
import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.turf.dto.CourtsDto;
import com.turf.exception.CannotAccessOtherTurf;
import com.turf.exception.GameAlreadyExistsException;
import com.turf.exception.TurfNotFoundException;
import com.turf.model.Game;
import com.turf.service.TurfService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class GameController {
	
	private final TurfService turfService;

	@PostMapping("/owner/registerGameToTurf/{id}")
	public ResponseEntity<String> registerGame(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,@PathVariable Long id,@RequestBody Game games) throws TurfNotFoundException, GameAlreadyExistsException, CannotAccessOtherTurf{
		Game game = turfService.registerGameToTurf(authorizationHeader,id, games);
		
		return ResponseEntity.status(HttpStatus.OK).body(game.getGame());
	}
	
	@PutMapping("/owner/updateStartTiming/{turfName}/{gameName}")
	public ResponseEntity<?> updateTurfGameStartTiming(@PathVariable String turfName, @PathVariable String gameName,
			@RequestBody LocalTime updatedStartTime) {
		turfService.updateTurfGameStartTiming(turfName,gameName,updatedStartTime);//handle exception
		return ResponseEntity.status(200).body("Game deleted");
	}
	
	@PutMapping("/owner/updateEndTiming/{turfName}/{gameName}")
	public ResponseEntity<?> updateTurfGameEndTiming(@PathVariable String turfName, @PathVariable String gameName,
			@RequestBody LocalTime updatedEndTime) {
		turfService.updateTurfGameEndTiming(turfName,gameName,updatedEndTime);
		return ResponseEntity.status(200).body("Game deleted");
	}
	
	@DeleteMapping("/owner/deleteGame/{turfId}/{gameName}")
	public ResponseEntity<?> deleteGame(@PathVariable Long turfId,@PathVariable String gameName){
		turfService.deleteGame(turfId,gameName);
		return ResponseEntity.status(200).body(gameName);
	}
	@DeleteMapping("/owner/deleteCourtFromGame/{courtId}")
	public ResponseEntity<?> deleteCourtFromGame(@PathVariable Long courtId){
		turfService.deleteCourtFromGame(courtId);
		return ResponseEntity.status(200).body("Game deleted");
	}
	
	@GetMapping("/public/courtDetails/{turfId}/{gameId}")
	public List<CourtsDto> courtDetails(@PathVariable Long turfId, @PathVariable Long gameId){
		return turfService.courtDetails(turfId,gameId);
	}
	

}
