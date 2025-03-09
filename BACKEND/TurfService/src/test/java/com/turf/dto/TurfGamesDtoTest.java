package com.turf.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

class TurfGamesDtoTest {

    // Test Default Constructor
    @Test
    void testTurfGamesDtoDefaultConstructor() {
        // Arrange
        TurfGamesDto turfGamesDto = new TurfGamesDto();

        // Act & Assert
        assertNull(turfGamesDto.getTurfName());
        assertNull(turfGamesDto.getTurfLocation());
        assertNull(turfGamesDto.getAvailableGames());
        assertNull(turfGamesDto.getNumberOfAvailableGames());
    }

    // Test Constructor with Arguments
    @Test
    void testTurfGamesDtoAllArgsConstructor() {
        // Arrange
        String turfName = "Green Turf";
        String turfLocation = "New York";
        List<GamesDto> availableGames = Arrays.asList(new GamesDto("Football", LocalTime.of(10, 0), LocalTime.of(12, 0)),
                                                      new GamesDto("Tennis", LocalTime.of(12, 30), LocalTime.of(14, 0)));
        Integer numberOfAvailableGames = 2;

        // Act
        TurfGamesDto turfGamesDto = new TurfGamesDto(turfName, turfLocation, availableGames, numberOfAvailableGames);

        // Assert
        assertEquals(turfName, turfGamesDto.getTurfName());
        assertEquals(turfLocation, turfGamesDto.getTurfLocation());
        assertEquals(availableGames, turfGamesDto.getAvailableGames());
        assertEquals(numberOfAvailableGames, turfGamesDto.getNumberOfAvailableGames());
    }

    // Test Setter and Getter for Turf Name
    @Test
    void testTurfNameSetterAndGetter() {
        // Arrange
        TurfGamesDto turfGamesDto = new TurfGamesDto();

        // Act
        turfGamesDto.setTurfName("Red Turf");

        // Assert
        assertEquals("Red Turf", turfGamesDto.getTurfName());
    }

    // Test Setter and Getter for Turf Location
    @Test
    void testTurfLocationSetterAndGetter() {
        // Arrange
        TurfGamesDto turfGamesDto = new TurfGamesDto();

        // Act
        turfGamesDto.setTurfLocation("Los Angeles");

        // Assert
        assertEquals("Los Angeles", turfGamesDto.getTurfLocation());
    }

    // Test Setter and Getter for Available Games
    @Test
    void testAvailableGamesSetterAndGetter() {
        // Arrange
        TurfGamesDto turfGamesDto = new TurfGamesDto();
        List<GamesDto> availableGames = Arrays.asList(new GamesDto("Football", LocalTime.of(10, 0), LocalTime.of(12, 0)),
                                                      new GamesDto("Cricket", LocalTime.of(12, 30), LocalTime.of(14, 0)));

        // Act
        turfGamesDto.setAvailableGames(availableGames);

        // Assert
        assertEquals(availableGames, turfGamesDto.getAvailableGames());
    }

    // Test Setter and Getter for Number of Available Games
    @Test
    void testNumberOfAvailableGamesSetterAndGetter() {
        // Arrange
        TurfGamesDto turfGamesDto = new TurfGamesDto();

        // Act
        turfGamesDto.setNumberOfAvailableGames(5);

        // Assert
        assertEquals(5, turfGamesDto.getNumberOfAvailableGames());
    }

    // Test toString Method
    @Test
    void testTurfGamesDtoToString() {
        // Arrange
        TurfGamesDto turfGamesDto = new TurfGamesDto("Blue Turf", "California", 
            Arrays.asList(new GamesDto("Football", LocalTime.of(10, 0), LocalTime.of(12, 0)),
                          new GamesDto("Tennis", LocalTime.of(12, 30), LocalTime.of(14, 0))), 2);

        // Act
        String toStringResult = turfGamesDto.toString();

        // Assert
        assertTrue(toStringResult.contains("Blue Turf"));
        assertTrue(toStringResult.contains("California"));
        assertTrue(toStringResult.contains("Football"));
        assertTrue(toStringResult.contains("Tennis"));
        assertTrue(toStringResult.contains("2"));
    }

    // Test Available Games List being Null
    @Test
    void testAvailableGamesNull() {
        // Arrange
        TurfGamesDto turfGamesDto = new TurfGamesDto();

        // Act
        turfGamesDto.setAvailableGames(null);

        // Assert
        assertNull(turfGamesDto.getAvailableGames());
    }

    // Test Number of Available Games with Null List
    
}
