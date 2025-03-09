package com.turf.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class PendingTurfDtoTest {

    // Test Default Constructor
    @Test
    void testPendingTurfDtoDefaultConstructor() {
        // Arrange
        PendingTurfDto pendingTurfDto = new PendingTurfDto();

        // Act & Assert
        assertNull(pendingTurfDto.getId());
        assertNull(pendingTurfDto.getTurfName());
        assertNull(pendingTurfDto.getLocation());
        assertNull(pendingTurfDto.getStatus());
    }

    // Test Constructor with Arguments
    @Test
    void testPendingTurfDtoAllArgsConstructor() {
        // Arrange
        Long id = 1L;
        String turfName = "Green Turf";
        String location = "New York";
        String status = "Pending";

        // Act
        PendingTurfDto pendingTurfDto = new PendingTurfDto(id, turfName, location, status);

        // Assert
        assertEquals(id, pendingTurfDto.getId());
        assertEquals(turfName, pendingTurfDto.getTurfName());
        assertEquals(location, pendingTurfDto.getLocation());
        assertEquals(status, pendingTurfDto.getStatus());
    }

    // Test Setter and Getter for Turf Name
    @Test
    void testTurfNameSetterAndGetter() {
        // Arrange
        PendingTurfDto pendingTurfDto = new PendingTurfDto();

        // Act
        pendingTurfDto.setTurfName("Blue Turf");

        // Assert
        assertEquals("Blue Turf", pendingTurfDto.getTurfName());
    }

    // Test Setter and Getter for Location
    @Test
    void testLocationSetterAndGetter() {
        // Arrange
        PendingTurfDto pendingTurfDto = new PendingTurfDto();

        // Act
        pendingTurfDto.setLocation("Los Angeles");

        // Assert
        assertEquals("Los Angeles", pendingTurfDto.getLocation());
    }

    // Test Setter and Getter for Status
    @Test
    void testStatusSetterAndGetter() {
        // Arrange
        PendingTurfDto pendingTurfDto = new PendingTurfDto();

        // Act
        pendingTurfDto.setStatus("Approved");

        // Assert
        assertEquals("Approved", pendingTurfDto.getStatus());
    }

    // Test toString Method
    @Test
    void testPendingTurfDtoToString() {
        // Arrange
        PendingTurfDto pendingTurfDto = new PendingTurfDto(1L, "Green Turf", "New York", "Pending");

        // Act
        String toStringResult = pendingTurfDto.toString();

        // Assert
        assertTrue(toStringResult.contains("Green Turf"));
        assertTrue(toStringResult.contains("New York"));
        assertTrue(toStringResult.contains("Pending"));
    }

    // Test Null Location and Status
    @Test
    void testNullLocationAndStatus() {
        // Arrange
        PendingTurfDto pendingTurfDto = new PendingTurfDto(1L, "Red Turf", null, null);

        // Act & Assert
        assertEquals("Red Turf", pendingTurfDto.getTurfName());
        assertNull(pendingTurfDto.getLocation());  // Location should default to null
        assertNull(pendingTurfDto.getStatus());    // Status should default to null
    }

    // Test Setter and Getter for ID
    @Test
    void testIdSetterAndGetter() {
        // Arrange
        PendingTurfDto pendingTurfDto = new PendingTurfDto();

        // Act
        pendingTurfDto.setId(2L);

        // Assert
        assertEquals(2L, pendingTurfDto.getId());
    }
}
