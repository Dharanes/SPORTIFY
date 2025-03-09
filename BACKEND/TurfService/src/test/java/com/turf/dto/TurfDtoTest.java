package com.turf.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class TurfDtoTest {

    // Test Default Constructor
    @Test
    void testTurfDtoDefaultConstructor() {
        // Arrange
        TurfDto turfDto = new TurfDto();

        // Act & Assert
        assertNull(turfDto.getTurfId());
        assertNull(turfDto.getTurfName());
        assertNull(turfDto.getTurfLocation());
        assertNull(turfDto.getImageUrl());
    }

    // Test Constructor with Arguments
    @Test
    void testTurfDtoAllArgsConstructor() {
        // Arrange
        Long turfId = 1L;
        String turfName = "Green Turf";
        String turfLocation = "New York";
        String imageUrl = "imageUrl.jpg";

        // Act
        TurfDto turfDto = new TurfDto(turfId, turfName, turfLocation, imageUrl);

        // Assert
        assertEquals(turfId, turfDto.getTurfId());
        assertEquals(turfName, turfDto.getTurfName());
        assertEquals(turfLocation, turfDto.getTurfLocation());
        assertEquals(imageUrl, turfDto.getImageUrl());
    }

    // Test Setter and Getter for Turf ID
    @Test
    void testTurfIdSetterAndGetter() {
        // Arrange
        TurfDto turfDto = new TurfDto();

        // Act
        turfDto.setTurfId(1L);

        // Assert
        assertEquals(1L, turfDto.getTurfId());
    }

    // Test Setter and Getter for Turf Name
    @Test
    void testTurfNameSetterAndGetter() {
        // Arrange
        TurfDto turfDto = new TurfDto();

        // Act
        turfDto.setTurfName("Red Turf");

        // Assert
        assertEquals("Red Turf", turfDto.getTurfName());
    }

    // Test Setter and Getter for Turf Location
    @Test
    void testTurfLocationSetterAndGetter() {
        // Arrange
        TurfDto turfDto = new TurfDto();

        // Act
        turfDto.setTurfLocation("Los Angeles");

        // Assert
        assertEquals("Los Angeles", turfDto.getTurfLocation());
    }

    // Test Setter and Getter for Image URL
    @Test
    void testImageUrlSetterAndGetter() {
        // Arrange
        TurfDto turfDto = new TurfDto();

        // Act
        turfDto.setImageUrl("newImageUrl.jpg");

        // Assert
        assertEquals("newImageUrl.jpg", turfDto.getImageUrl());
    }

    // Test toString Method
    @Test
    void testTurfDtoToString() {
        // Arrange
        TurfDto turfDto = new TurfDto(1L, "Blue Turf", "California", "blueImageUrl.jpg");

        // Act
        String toStringResult = turfDto.toString();

        // Assert
        assertTrue(toStringResult.contains("Blue Turf"));
        assertTrue(toStringResult.contains("California"));
        assertTrue(toStringResult.contains("blueImageUrl.jpg"));
    }

    // Test Null Location and Image URL
    @Test
    void testNullLocationAndImageUrl() {
        // Arrange
        TurfDto turfDto = new TurfDto(1L, "Red Turf", null, null);

        // Act & Assert
        assertEquals("Red Turf", turfDto.getTurfName());
        assertNull(turfDto.getTurfLocation());  // Location should default to null
        assertNull(turfDto.getImageUrl());     // Image URL should default to null
    }

    // Test Setter and Getter for ID
    @Test
    void testTurfIdSetterAndGetter1() {
        // Arrange
        TurfDto turfDto = new TurfDto();

        // Act
        turfDto.setTurfId(2L);

        // Assert
        assertEquals(2L, turfDto.getTurfId());
    }
}
