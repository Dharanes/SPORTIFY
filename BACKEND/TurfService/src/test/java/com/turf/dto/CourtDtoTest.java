package com.turf.dto;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

class CourtDtoTest {

    @Test
    void testCourtDtoCreation() {
        // Arrange
        String courtType = "Tennis";
        String courtStyle = "Clay";
        Double price = 1000.0;

        // Act
        CourtDto courtDto = new CourtDto(1l,courtType, courtStyle, price);

        // Assert
        assertEquals("Tennis", courtDto.getCourtType());
        assertEquals("Clay", courtDto.getCourtStyle());
        assertEquals(1000.0, courtDto.getPrice());
    }

    @Test
    void testCourtDtoSetterAndGetter() {
        // Arrange
        CourtDto courtDto = new CourtDto();
        
        // Act
        courtDto.setCourtType("Basketball");
        courtDto.setCourtStyle("Indoor");
        courtDto.setPrice(1500.0);

        // Assert
        assertEquals("Basketball", courtDto.getCourtType());
        assertEquals("Indoor", courtDto.getCourtStyle());
        assertEquals(1500.0, courtDto.getPrice());
    }
}
