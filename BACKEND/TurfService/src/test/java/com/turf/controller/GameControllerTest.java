package com.turf.controller;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import com.turf.dto.CourtsDto;
import com.turf.exception.CannotAccessOtherTurf;
import com.turf.exception.GameAlreadyExistsException;
import com.turf.exception.TurfNotFoundException;
import com.turf.model.Game;
import com.turf.service.TurfService;

class GameControllerTest {

    @InjectMocks
    private GameController gameController;

    @Mock
    private TurfService turfService;

    private Long turfId;
    private Long courtId;
    private String authorizationHeader;
    private String turfName;
    private String gameName;
    private Game game;
    private LocalTime updatedStartTime;
    private LocalTime updatedEndTime;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        turfId = 1L;
        courtId = 101L;
        authorizationHeader = "Bearer token";
        turfName = "Turf1";
        gameName = "Football";
        updatedStartTime = LocalTime.of(10, 0);
        updatedEndTime = LocalTime.of(12, 0);

        game = new Game();
        game.setGame(gameName);
    }

    @Test
    void registerGame_ShouldRegisterGameSuccessfully() throws TurfNotFoundException, GameAlreadyExistsException, CannotAccessOtherTurf {
        // Arrange
        when(turfService.registerGameToTurf(authorizationHeader, turfId, game)).thenReturn(game);

        // Act
        ResponseEntity<String> response = gameController.registerGame(authorizationHeader, turfId, game);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(gameName, response.getBody());
        verify(turfService, times(1)).registerGameToTurf(authorizationHeader, turfId, game);
    }

    @Test
    void registerGame_ShouldThrowTurfNotFoundException() throws TurfNotFoundException, GameAlreadyExistsException, CannotAccessOtherTurf {
        // Arrange
        when(turfService.registerGameToTurf(authorizationHeader, turfId, game)).thenThrow(new TurfNotFoundException("Turf not found"));

        // Act & Assert
        TurfNotFoundException exception = assertThrows(TurfNotFoundException.class, () -> {
            gameController.registerGame(authorizationHeader, turfId, game);
        });

        assertEquals("Turf not found", exception.getMessage());
    }

    @Test
    void updateTurfGameStartTiming_ShouldUpdateStartTimingSuccessfully() {
        // Act
        ResponseEntity<?> response = gameController.updateTurfGameStartTiming(turfName, gameName, updatedStartTime);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Game deleted", response.getBody());
        verify(turfService, times(1)).updateTurfGameStartTiming(turfName, gameName, updatedStartTime);
    }

    @Test
    void updateTurfGameEndTiming_ShouldUpdateEndTimingSuccessfully() {
        // Act
        ResponseEntity<?> response = gameController.updateTurfGameEndTiming(turfName, gameName, updatedEndTime);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Game deleted", response.getBody());
        verify(turfService, times(1)).updateTurfGameEndTiming(turfName, gameName, updatedEndTime);
    }

    @Test
    void deleteGame_ShouldDeleteGameSuccessfully() {
        // Act
        ResponseEntity<?> response = gameController.deleteGame(turfId, gameName);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(gameName, response.getBody());
        verify(turfService, times(1)).deleteGame(turfId, gameName);
    }

    @Test
    void deleteCourtFromGame_ShouldDeleteCourtSuccessfully() {
        // Act
        ResponseEntity<?> response = gameController.deleteCourtFromGame(courtId);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Game deleted", response.getBody());
        verify(turfService, times(1)).deleteCourtFromGame(courtId);
    }
    
    @Test
    void registerGame_ShouldThrowCannotAccessOtherTurfException() throws TurfNotFoundException, GameAlreadyExistsException, CannotAccessOtherTurf {
        // Arrange
        when(turfService.registerGameToTurf(authorizationHeader, turfId, game))
            .thenThrow(new CannotAccessOtherTurf("Unauthorized access to turf"));

        // Act & Assert
        CannotAccessOtherTurf exception = assertThrows(CannotAccessOtherTurf.class, () -> {
            gameController.registerGame(authorizationHeader, turfId, game);
        });

        assertEquals("Unauthorized access to turf", exception.getMessage());
    }

    @Test
    void updateTurfGameStartTiming_ShouldThrowGameNotFoundException() {
        // Arrange
        doThrow(new IllegalArgumentException("Game not found")).when(turfService).updateTurfGameStartTiming(turfName, "InvalidGame", updatedStartTime);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            gameController.updateTurfGameStartTiming(turfName, "InvalidGame", updatedStartTime);
        });

        assertEquals("Game not found", exception.getMessage());
    }

    

    @Test
    void deleteCourtFromGame_ShouldThrowCourtNotFoundException() {
        // Arrange
        doThrow(new IllegalArgumentException("Court not found")).when(turfService).deleteCourtFromGame(999L);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            gameController.deleteCourtFromGame(999L);
        });

        assertEquals("Court not found", exception.getMessage());
    }

    @Test
    void courtDetails_ShouldReturnEmptyListWhenNoCourtsFound() {
        // Arrange
        when(turfService.courtDetails(turfId, 2L)).thenReturn(List.of());

        // Act
        List<CourtsDto> result = gameController.courtDetails(turfId, 2L);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(turfService, times(1)).courtDetails(turfId, 2L);
    }

    

    

    

    

    @Test
    void courtDetails_ShouldPropagateServiceLayerException() {
        // Arrange
        when(turfService.courtDetails(turfId, 1L)).thenThrow(new RuntimeException("Unexpected error"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gameController.courtDetails(turfId, 1L);
        });

        assertEquals("Unexpected error", exception.getMessage());
    }

    


}