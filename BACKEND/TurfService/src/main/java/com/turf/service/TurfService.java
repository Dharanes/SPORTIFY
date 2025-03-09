package com.turf.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.turf.dto.ApprovedTurfDto;
import com.turf.dto.BookingDto;
import com.turf.dto.CourtDto;
import com.turf.dto.CourtIdDto;
import com.turf.dto.CourtsDto;
import com.turf.dto.GamesIdDto;
import com.turf.dto.TimeSlotDto;
import com.turf.dto.TimeSlotIdDto;
import com.turf.dto.TurfDto;
import com.turf.dto.TurfGameCourtDto;
import com.turf.dto.TurfGamesDto;
import com.turf.dto.PendingTurfDto;
import com.turf.dto.RatingDto;
import com.turf.exception.CannotAccessOtherTurf;
import com.turf.exception.GameAlreadyExistsException;
import com.turf.exception.TurfNameAlreadyExistsException;
import com.turf.exception.TurfNotFoundException;
import com.turf.model.Court;
import com.turf.model.Game;
import com.turf.model.Turf;

public interface TurfService {
	
	Long addTurf(String email,Turf turf) throws TurfNameAlreadyExistsException;
	
	Game registerGameToTurf(String authHeader,Long id,Game games) throws TurfNotFoundException, GameAlreadyExistsException, CannotAccessOtherTurf;

	List<CourtDto> addCourtToGame(Long id, String gameName, Court courts);

	TurfGamesDto getTurfGamesByTurfId(Long id);

	List<TurfGamesDto> getTurfGames();

	List<TurfDto> getAllTurfsByOwnerId(Long id);

	List<TurfDto> filterTurfByName(String name) throws TurfNotFoundException;

	List<TurfDto> filterTurfByLocation(String loc) throws TurfNotFoundException;

	void updateTurfGameStartTiming(String turfName, String gameName, LocalTime updatedStartTime);

	void updateTurfGameEndTiming(String turfName, String gameName, LocalTime updatedEndTime);

	void updateGameCourtTypePrice(Long turfId, String gameName, String courtType, CourtDto court);

	List<TimeSlotDto> getAvailableSlot(Long turfId, String gameName, Long courtId, int duration,LocalDate date);

	void bookATurf(Long turfId, String gameName, Long courtId, Long timeSlotId, int duration, LocalDate date);

	void freeACourt(Long turfId, String gameName, Long courtId, Long timeSlotId, Integer duration);

	String deleteTurf(String turfName) throws TurfNotFoundException;

	void deleteGame(Long turfId, String gameName);
	
	void deleteCourtFromGame(Long courtId);

	Map<String, Map<String, List<BookingDto>>> getBookings(String authorizationHeader);

	List<TurfDto> getAllTurfs();

	String getTurfName(Long turfId);

	List<GamesIdDto> getGames(Long turfId);

	List<LocalTime> getTimeSlot(Long turfId, Long gameId, LocalDate selectedDate);

	List<CourtIdDto> getCourtName(Long gameId, LocalDate selectedDate, String selectedTimeSlot,int duration);

	List<TurfDto> getTurfs(String authorizationHeader);
	
	List<TurfDto> getPendingTurfs(String authorizationHeader);

	List<Map<String, Object>> filterByLocationAndGame(String location, String gameName);

	List<TurfGameCourtDto> getTurfByTurfName(Long turfId);

	double getPrice(Long courtId);

	String getTurfImage(String turfName);

	Long numberOfTurf();

	List<PendingTurfDto> getPendingRequests();

	List<ApprovedTurfDto> getApprovedRequests();

	String updateStatus(Long id, String status);

	TurfDto getTurf(Long turfId);

	String courtName(Long courtId);

	ResponseEntity<String> submitRating(Long turfId, Double rating);

	RatingDto getRating(Long turfId);

	List<CourtsDto> courtDetails(Long turfId, Long gameId);

	
}
