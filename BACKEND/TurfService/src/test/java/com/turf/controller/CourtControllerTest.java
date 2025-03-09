package com.turf.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.turf.dto.CourtDto;
import com.turf.dto.CourtIdDto;
import com.turf.model.Court;
import com.turf.service.TurfService;

class CourtControllerTest {

    @InjectMocks
    private CourtController courtController;

    @Mock
    private TurfService turfService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void addCourtsToGame_ShouldReturnListOfCourtDto_WhenCourtsAreAdded() {
        // Arrange
        Long turfId = 1L;
        String gameName = "Football";
        Court court = new Court();
        List<CourtDto> mockCourtDtos = List.of(new CourtDto());

        when(turfService.addCourtToGame(turfId, gameName, court)).thenReturn(mockCourtDtos);

        // Act
        ResponseEntity<List<CourtDto>> response = courtController.addCourtsToGame(turfId, gameName, court);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockCourtDtos, response.getBody());
        verify(turfService, times(1)).addCourtToGame(turfId, gameName, court);
    }
    @Test
    void freeACourt_ShouldReturnUpdatedMessage_WhenCourtIsFreed() {
        // Arrange
        Long turfId = 1L;
        String gameName = "Football";
        Long courtId = 1L;
        Long timeSlotId = 1L;
        Integer duration = 60;

        doNothing().when(turfService).freeACourt(turfId, gameName, courtId, timeSlotId, duration);

        // Act
        String response = courtController.freeACourt(turfId, gameName, courtId, timeSlotId, duration);

        // Assert
        assertEquals("Updated", response);
        verify(turfService, times(1)).freeACourt(turfId, gameName, courtId, timeSlotId, duration);
    }

    @Test
    void getTimeSlot_ShouldReturnListOfLocalTime_WhenCalled() {
        // Arrange
        Long turfId = 1L;
        Long gameId = 2L;
        LocalDate selectedDate = LocalDate.now();
        List<LocalTime> mockTimeSlots = List.of(LocalTime.of(10, 0), LocalTime.of(11, 0));

        when(turfService.getTimeSlot(turfId, gameId, selectedDate)).thenReturn(mockTimeSlots);

        // Act
        List<LocalTime> result = courtController.getTimeSlot(turfId, gameId, selectedDate);

        // Assert
        assertEquals(mockTimeSlots, result);
        verify(turfService, times(1)).getTimeSlot(turfId, gameId, selectedDate);
    }

    @Test
    void getCourtNames_ShouldReturnListOfCourtIdDto_WhenCalled() {
        // Arrange
        Long gameId = 2L;
        LocalDate selectedDate = LocalDate.now();
        String selectedTimeSlot = "10:00";
        int duration = 60;
        List<CourtIdDto> mockCourtIds = List.of(new CourtIdDto());

        when(turfService.getCourtName(gameId, selectedDate, selectedTimeSlot, duration)).thenReturn(mockCourtIds);

        // Act
        List<CourtIdDto> result = courtController.getCourtNames(gameId, selectedDate, selectedTimeSlot, duration);

        // Assert
        assertEquals(mockCourtIds, result);
        verify(turfService, times(1)).getCourtName(gameId, selectedDate, selectedTimeSlot, duration);
    }
    @Test
    void getPrice_ShouldReturnPrice_WhenCalled() {
        // Arrange
        Long courtId = 1L;
        double mockPrice = 150.0;

        when(turfService.getPrice(courtId)).thenReturn(mockPrice);

        // Act
        double result = courtController.getPrice(courtId);

        // Assert
        assertEquals(mockPrice, result);
        verify(turfService, times(1)).getPrice(courtId);
    }

    @Test
    void getCourtName_ShouldReturnCourtName_WhenCalled() {
        // Arrange
        Long courtId = 1L;
        String mockCourtName = "Court A";

        when(turfService.courtName(courtId)).thenReturn(mockCourtName);

        // Act
        String result = courtController.getCourtName(courtId);

        // Assert
        assertEquals(mockCourtName, result);
        verify(turfService, times(1)).courtName(courtId);
    }

}
