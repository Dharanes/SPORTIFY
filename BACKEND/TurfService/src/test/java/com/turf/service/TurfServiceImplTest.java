package com.turf.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.turf.dto.CourtsDto;
import com.turf.dto.RatingDto;
import com.turf.dto.TurfDto;
import com.turf.dto.TurfGamesDto;
import com.turf.exception.TurfNameAlreadyExistsException;
import com.turf.model.*;
import com.turf.repository.*;


class TurfServiceImplTest {

	@Mock
	private TurfRepo turfRepo;

	@Mock
	private GameRepo gameRepo;

	@Mock
	private CourtRepo courtRepo;

	@Mock
	private TimeSlotRepo timeSlotRepo;

	@Mock
	private TurfApprovalRepo approvalRepo;

	@Mock
	private RatingRepo ratingRepo;

	@InjectMocks
	private TurfServiceImpl turfService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	

	@Test
	void getTurfGamesByTurfId_ShouldReturnTurfGames() {
		// Arrange
		Long turfId = 1L;
		Turf turf = new Turf();
		turf.setTurfId(turfId);
		turf.setTurfName("Soccer Turf");

		Game game = new Game();
		game.setGame("Football");
		game.setStartTime(LocalTime.of(9, 0));
		game.setEndTime(LocalTime.of(12, 0));

		when(turfRepo.findById(turfId)).thenReturn(Optional.of(turf));
		when(gameRepo.findByTurf_TurfId(turfId)).thenReturn(Collections.singletonList(game));

		// Act
		TurfGamesDto result = turfService.getTurfGamesByTurfId(turfId);

		// Assert
		assertNotNull(result);
		assertEquals("Soccer Turf", result.getTurfName());
		assertEquals(1, result.getAvailableGames().size());
		assertEquals("Football", result.getAvailableGames().get(0).getName());
	}

	@Test
	void getTurfGamesByTurfId_ShouldThrowException_WhenTurfNotFound() {
		// Arrange
		Long turfId = 1L;

		when(turfRepo.findById(turfId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(RuntimeException.class, () -> turfService.getTurfGamesByTurfId(turfId));
	}
	
	@Test
    void updateStatus_ShouldUpdateStatusSuccessfully() {
        // Arrange
        Long turfId = 1L;
        String status = "Approved";
        TurfApproval approval = new TurfApproval();
        approval.setId(turfId);

        when(approvalRepo.findByTurfId(turfId)).thenReturn(approval);

        // Act
        String result = turfService.updateStatus(turfId, status);

        // Assert
        assertEquals("Updated", result);
        assertEquals(status, approval.getStatus());
        verify(approvalRepo, times(1)).save(approval);
    }

    @Test
    void getTurf_ShouldReturnTurfDto() {
        // Arrange
        Long turfId = 1L;
        Turf turf = new Turf();
        turf.setTurfId(turfId);
        turf.setTurfName("Soccer Turf");
        turf.setLocation("Downtown");
        turf.setImageUrl("image_url");

        when(turfRepo.findById(turfId)).thenReturn(Optional.of(turf));

        // Act
        TurfDto result = turfService.getTurf(turfId);

        // Assert
        assertNotNull(result);
        assertEquals(turfId, result.getTurfId());
        assertEquals("Soccer Turf", result.getTurfName());
        assertEquals("Downtown", result.getTurfLocation());
        assertEquals("image_url", result.getImageUrl());
    }

    @Test
    void courtName_ShouldReturnCourtName() {
        // Arrange
        Long courtId = 1L;
        Court court = new Court();
        court.setCourtId(courtId);
        court.setCourtName("Court 1");

        when(courtRepo.findById(courtId)).thenReturn(Optional.of(court));

        // Act
        String result = turfService.courtName(courtId);

        // Assert
        assertEquals("Court 1", result);
    }

    @Test
    void submitRating_ShouldUpdateRatingSuccessfully() {
        // Arrange
        Long turfId = 1L;
        Double newRating = 4.5;

        Ratings ratings = new Ratings();
        ratings.setRating(4.0);
        ratings.setNumberOfRatings(10L);

        when(ratingRepo.findByTurf_TurfId(turfId)).thenReturn(Optional.of(ratings));

        // Act
        ResponseEntity<String> response = turfService.submitRating(turfId, newRating);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("updated", response.getBody());
        assertEquals(4.045, ratings.getRating(), 0.001);
        assertEquals(11L, ratings.getNumberOfRatings());
        verify(ratingRepo, times(1)).save(ratings);
    }

    @Test
    void getRating_ShouldReturnRatingDto() {
        // Arrange
        Long turfId = 1L;
        Ratings ratings = new Ratings();
        ratings.setRating(4.2);
        ratings.setNumberOfRatings(15L);

        when(ratingRepo.findByTurf_TurfId(turfId)).thenReturn(Optional.of(ratings));

        // Act
        RatingDto result = turfService.getRating(turfId);

        // Assert
        assertNotNull(result);
        assertEquals(4.2, result.getRating());
        assertEquals(15L, result.getNumberOfRatings());
    }

    
}
