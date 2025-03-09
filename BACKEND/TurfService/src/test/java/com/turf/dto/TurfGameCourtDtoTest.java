package com.turf.dto;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

class TurfGameCourtDtoTest {

    // Test Default Constructor
    @Test
    void testTurfGameCourtDtoDefaultConstructor() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();

        // Act & Assert
        assertNull(turfGameCourtDto.getGameID());
        assertNull(turfGameCourtDto.getGameName());
        assertNull(turfGameCourtDto.getStartTime());
        assertNull(turfGameCourtDto.getEndTime());
        assertNull(turfGameCourtDto.getCourts());
    }

    // Test Constructor with Arguments
    @Test
    void testTurfGameCourtDtoAllArgsConstructor() {
        // Arrange
        Long gameID = 1L;
        String gameName = "Football";
        LocalTime startTime = LocalTime.of(10, 0);
        LocalTime endTime = LocalTime.of(12, 0);
        List<CourtDto> courts = Arrays.asList(new CourtDto(1L, "Court 1", "Grass", 500.0), new CourtDto(2L, "Court 2", "Hard", 600.0));

        // Act
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto(gameID, gameName, startTime, endTime, courts);

        // Assert
        assertEquals(gameID, turfGameCourtDto.getGameID());
        assertEquals(gameName, turfGameCourtDto.getGameName());
        assertEquals(startTime, turfGameCourtDto.getStartTime());
        assertEquals(endTime, turfGameCourtDto.getEndTime());
        assertEquals(courts, turfGameCourtDto.getCourts());
    }

    // Test Setter and Getter for Game ID
    @Test
    void testGameIDSetterAndGetter() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();

        // Act
        turfGameCourtDto.setGameID(2L);

        // Assert
        assertEquals(2L, turfGameCourtDto.getGameID());
    }

    // Test Setter and Getter for Game Name
    @Test
    void testGameNameSetterAndGetter() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();

        // Act
        turfGameCourtDto.setGameName("Tennis");

        // Assert
        assertEquals("Tennis", turfGameCourtDto.getGameName());
    }

    // Test Setter and Getter for Start Time
    @Test
    void testStartTimeSetterAndGetter() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();
        LocalTime startTime = LocalTime.of(14, 0);

        // Act
        turfGameCourtDto.setStartTime(startTime);

        // Assert
        assertEquals(startTime, turfGameCourtDto.getStartTime());
    }

    // Test Setter and Getter for End Time
    @Test
    void testEndTimeSetterAndGetter() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();
        LocalTime endTime = LocalTime.of(16, 0);

        // Act
        turfGameCourtDto.setEndTime(endTime);

        // Assert
        assertEquals(endTime, turfGameCourtDto.getEndTime());
    }

    // Test Setter and Getter for Courts
    @Test
    void testCourtsSetterAndGetter() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();
        List<CourtDto> courts = Arrays.asList(new CourtDto(1L, "Court 1", "Grass", 500.0));

        // Act
        turfGameCourtDto.setCourts(courts);

        // Assert
        assertEquals(courts, turfGameCourtDto.getCourts());
    }

    // Test toString Method
    @Test
    void testTurfGameCourtDtoToString() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto(1L, "Football", LocalTime.of(10, 0), LocalTime.of(12, 0),
            Arrays.asList(new CourtDto(1L, "Court 1", "Grass", 500.0), new CourtDto(2L, "Court 2", "Hard", 600.0)));

        // Act
        String toStringResult = turfGameCourtDto.toString();

        // Assert
        assertTrue(toStringResult.contains("Football"));
        assertTrue(toStringResult.contains("10:00"));
        assertTrue(toStringResult.contains("12:00"));
        assertTrue(toStringResult.contains("Court 1"));
        assertTrue(toStringResult.contains("Court 2"));
    }

    // Test Courts List Being Null
    @Test
    void testCourtsListNull() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();

        // Act
        turfGameCourtDto.setCourts(null);

        // Assert
        assertNull(turfGameCourtDto.getCourts());
    }

    // Test Courts List Being Empty
    @Test
    void testCourtsListEmpty() {
        // Arrange
        TurfGameCourtDto turfGameCourtDto = new TurfGameCourtDto();

        // Act
        turfGameCourtDto.setCourts(Arrays.asList());

        // Assert
        assertTrue(turfGameCourtDto.getCourts().isEmpty());
    }
}
