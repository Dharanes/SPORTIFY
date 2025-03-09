package com.turf.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

class ApprovedTurfDtoTest {

    @Test
    void testApprovedTurfDtoCreation() {
        // Arrange
        Long id = 1L;
        String name = "Blue Turf";
        String location = "Los Angeles";
        String owner = "Alice";
        LocalDate registeredOn = LocalDate.of(2020, 5, 15);
        double rating = 4.7;
        Long ratingCount = 200L;
        List<String> availableGames = List.of("Soccer", "Basketball");

        // Act
        ApprovedTurfDto approvedTurfDto = new ApprovedTurfDto(id, name, location, owner, registeredOn, rating, ratingCount, availableGames);

        // Assert
        assertEquals(id, approvedTurfDto.getId());
        assertEquals("Blue Turf", approvedTurfDto.getName());
        assertEquals("Los Angeles", approvedTurfDto.getLocation());
        assertEquals("Alice", approvedTurfDto.getOwner());
        assertEquals(LocalDate.of(2020, 5, 15), approvedTurfDto.getRegisteredOn());
        assertEquals(4.7, approvedTurfDto.getRating());
        assertEquals(200L, approvedTurfDto.getRatingCount());
        assertTrue(approvedTurfDto.getAvailableGames().contains("Soccer"));
        assertTrue(approvedTurfDto.getAvailableGames().contains("Basketball"));
    }

    @Test
    void testApprovedTurfDtoSetterAndGetter() {
        // Arrange
        ApprovedTurfDto approvedTurfDto = new ApprovedTurfDto();

        // Act
        approvedTurfDto.setId(2L);
        approvedTurfDto.setName("Green Turf");
        approvedTurfDto.setLocation("New York");
        approvedTurfDto.setOwner("Bob");
        approvedTurfDto.setRegisteredOn(LocalDate.of(2021, 8, 10));
        approvedTurfDto.setRating(4.3);
        approvedTurfDto.setRatingCount(150L);
        approvedTurfDto.setAvailableGames(List.of("Tennis", "Volleyball"));

        // Assert
        assertEquals(2L, approvedTurfDto.getId());
        assertEquals("Green Turf", approvedTurfDto.getName());
        assertEquals("New York", approvedTurfDto.getLocation());
        assertEquals("Bob", approvedTurfDto.getOwner());
        assertEquals(LocalDate.of(2021, 8, 10), approvedTurfDto.getRegisteredOn());
        assertEquals(4.3, approvedTurfDto.getRating());
        assertEquals(150L, approvedTurfDto.getRatingCount());
        assertTrue(approvedTurfDto.getAvailableGames().contains("Tennis"));
        assertTrue(approvedTurfDto.getAvailableGames().contains("Volleyball"));
    }
    

    @Test
    void testRatingSetterAndGetter() {
        // Arrange
        ApprovedTurfDto approvedTurfDto = new ApprovedTurfDto();
        
        // Act
        approvedTurfDto.setRating(5.0);

        // Assert
        assertEquals(5.0, approvedTurfDto.getRating());
    }
    @Test
    void testAvailableGamesSetterAndGetter() {
        // Arrange
        ApprovedTurfDto approvedTurfDto = new ApprovedTurfDto();
        List<String> games = List.of("Badminton", "Football");

        // Act
        approvedTurfDto.setAvailableGames(games);

        // Assert
        assertNotNull(approvedTurfDto.getAvailableGames());
        assertEquals(2, approvedTurfDto.getAvailableGames().size());
        assertTrue(approvedTurfDto.getAvailableGames().contains("Badminton"));
        assertTrue(approvedTurfDto.getAvailableGames().contains("Football"));
    }

    @Test
    void testApprovedTurfDtoToString() {
        // Arrange
        ApprovedTurfDto approvedTurfDto = new ApprovedTurfDto(1L, "Green Turf", "Miami", "OwnerName", LocalDate.now(), 4.8, 100L, List.of("Tennis", "Basketball"));

        // Act
        String toStringResult = approvedTurfDto.toString();

        // Assert
        assertTrue(toStringResult.contains("Green Turf"));
        assertTrue(toStringResult.contains("Miami"));
        assertTrue(toStringResult.contains("OwnerName"));
    }
    @Test
    void testNullRatingAndRatingCount() {
        // Arrange
        ApprovedTurfDto approvedTurfDto = new ApprovedTurfDto();
        
        // Act & Assert
        assertEquals(0.0, approvedTurfDto.getRating()); // Rating should default to 0.0
        assertNull(approvedTurfDto.getRatingCount());  // Rating count should default to null
    }

    @Test
    void testApprovedTurfDtoPartialConstructor() {
        // Arrange
        Long id = 1L;
        String name = "Red Turf";
        String location = "London";
        String owner = "Charlie";
        LocalDate registeredOn = LocalDate.now();

        // Act
        ApprovedTurfDto approvedTurfDto = new ApprovedTurfDto(id, name, location, owner, registeredOn, 4.5, 120L, null); // Available games is null

        // Assert
        assertEquals(id, approvedTurfDto.getId());
        assertEquals(name, approvedTurfDto.getName());
        assertEquals(location, approvedTurfDto.getLocation());
        assertEquals(owner, approvedTurfDto.getOwner());
        assertEquals(4.5, approvedTurfDto.getRating());
        assertEquals(120L, approvedTurfDto.getRatingCount());
        assertNull(approvedTurfDto.getAvailableGames()); // Ensure null is allowed
    }

}
