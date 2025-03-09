package com.turf.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.turf.dto.*;
import com.turf.exception.TurfNameAlreadyExistsException;
import com.turf.exception.TurfNotFoundException;
import com.turf.model.Turf;
import com.turf.service.TurfService;

class TurfControllerTest {

    @InjectMocks
    private TurfController turfController;

    @Mock
    private TurfService turfService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void addTurf_ShouldReturnTurfId_WhenTurfIsAdded() throws Exception {
        // Arrange
        String authorizationHeader = "Bearer token";
        String turfName = "GreenField";
        String location = "Downtown";
        MultipartFile imageFile = mock(MultipartFile.class);
        Turf turf = new Turf();
        turf.setTurfName(turfName);
        turf.setLocation(location);
        turf.setImageUrl("encodedImage");

        when(imageFile.getBytes()).thenReturn("dummyImage".getBytes());
        when(turfService.addTurf(eq(authorizationHeader), any(Turf.class))).thenReturn(1L);

        // Act
        ResponseEntity<?> response = turfController.addTurf(authorizationHeader, turfName, location, imageFile);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1L, response.getBody());
        verify(turfService, times(1)).addTurf(eq(authorizationHeader), any(Turf.class));
    }
    @Test
    void getBookings_ShouldReturnBookings_WhenCalled() {
        // Arrange
        String authorizationHeader = "Bearer token";
        Map<String, Map<String, List<BookingDto>>> mockBookings = Map.of(
            "Turf1", Map.of("Game1", List.of(new BookingDto()))
        );

        when(turfService.getBookings(authorizationHeader)).thenReturn(mockBookings);

        // Act
        Map<String, Map<String, List<BookingDto>>> result = turfController.getBookings(authorizationHeader);

        // Assert
        assertEquals(mockBookings, result);
        verify(turfService, times(1)).getBookings(authorizationHeader);
    }
    @Test
    void getTurfs_ShouldReturnTurfList_WhenCalled() {
        // Arrange
        String authorizationHeader = "Bearer token";
        List<TurfDto> mockTurfs = List.of(new TurfDto());

        when(turfService.getTurfs(authorizationHeader)).thenReturn(mockTurfs);

        // Act
        List<TurfDto> result = turfController.getTurfs(authorizationHeader);

        // Assert
        assertEquals(mockTurfs, result);
        verify(turfService, times(1)).getTurfs(authorizationHeader);
    }

    @Test
    void getAvailableSlots_ShouldReturnTimeSlots() {
        // Arrange
        Long turfId = 1L;
        String gameName = "Football";
        Long courtId = 1L;
        int duration = 60;
        LocalDate date = LocalDate.now();
        List<TimeSlotDto> mockSlots = List.of(new TimeSlotDto());

        when(turfService.getAvailableSlot(turfId, gameName, courtId, duration, date)).thenReturn(mockSlots);

        // Act
        List<TimeSlotDto> result = turfController.getAvailableSlots(turfId, gameName, courtId, duration, date);

        // Assert
        assertEquals(mockSlots, result);
        verify(turfService, times(1)).getAvailableSlot(turfId, gameName, courtId, duration, date);
    }

    @Test
    void deleteTurf_ShouldReturnSuccessMessage_WhenTurfIsDeleted() throws TurfNotFoundException {
        // Arrange
        String turfName = "GreenField";
        String successMessage = "Turf deleted successfully";

        when(turfService.deleteTurf(turfName)).thenReturn(successMessage);

        // Act
        String result = turfController.deleteTurf(turfName);

        // Assert
        assertEquals(successMessage, result);
        verify(turfService, times(1)).deleteTurf(turfName);
    }

    @Test
    void filterTurfByName_ShouldReturnFilteredTurfList() throws TurfNotFoundException {
        // Arrange
        String name = "GreenField";
        List<TurfDto> mockFilteredTurfs = List.of(new TurfDto());

        when(turfService.filterTurfByName(name)).thenReturn(mockFilteredTurfs);

        // Act
        ResponseEntity<List<TurfDto>> response = turfController.filterTurfByName(name);
    }
    
    @Test
    void updateGameCourtTypePrice_ShouldUpdatePrice_WhenCalled() {
        // Arrange
        Long turfId = 1L;
        String gameName = "Football";
        String courtType = "Grass";
        CourtDto courtDto = new CourtDto();

        doNothing().when(turfService).updateGameCourtTypePrice(turfId, gameName, courtType, courtDto);

        // Act
        ResponseEntity<?> response = turfController.updateGameCourtTypePrice(turfId, gameName, courtType, courtDto);

        // Assert
        assertEquals(null, response); //
    }
    
}
