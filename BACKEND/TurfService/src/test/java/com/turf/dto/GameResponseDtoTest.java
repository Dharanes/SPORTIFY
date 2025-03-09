package com.turf.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class GameResponseDtoTest {

    @Test
    public void testConstructorAndGetters() {
        // Given
        String name = "Football Match";
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(15, 0);
        Double price = 100.0;
        Map<String, String> availableSlot = Map.of("slot1", "10:00 - 11:00", "slot2", "11:00 - 12:00");

        // When
        GameResponseDto gameResponse = new GameResponseDto(name, startTime, endTime, price, availableSlot);

        // Then
        assertNotNull(gameResponse);
        assertEquals(name, gameResponse.getName());
        assertEquals(startTime, gameResponse.getStartTime());
        assertEquals(endTime, gameResponse.getEndTime());
        assertEquals(price, gameResponse.getPrice());
        assertEquals(availableSlot, gameResponse.getAvailableSlot());
    }

    @Test
    public void testSetters() {
        // Given
        GameResponseDto gameResponse = new GameResponseDto();

        // When
        gameResponse.setName("Football Match");
        gameResponse.setStartTime(LocalTime.of(14, 0));
        gameResponse.setEndTime(LocalTime.of(15, 0));
        gameResponse.setPrice(100.0);
        gameResponse.setAvailableSlot(Map.of("slot1", "10:00 - 11:00", "slot2", "11:00 - 12:00"));

        // Then
        assertEquals("Football Match", gameResponse.getName());
        assertEquals(LocalTime.of(14, 0), gameResponse.getStartTime());
        assertEquals(LocalTime.of(15, 0), gameResponse.getEndTime());
        assertEquals(100.0, gameResponse.getPrice());
        assertEquals(Map.of("slot1", "10:00 - 11:00", "slot2", "11:00 - 12:00"), gameResponse.getAvailableSlot());
    }

    @Test
    public void testAvailableSlotMap() {
        // Given
        Map<String, String> availableSlot = Map.of("slot1", "10:00 - 11:00", "slot2", "11:00 - 12:00");
        GameResponseDto gameResponse = new GameResponseDto("Football Match", LocalTime.of(14, 0), LocalTime.of(15, 0), 100.0, availableSlot);

        // When
        Map<String, String> slots = gameResponse.getAvailableSlot();

        // Then
        assertNotNull(slots);
        assertEquals(2, slots.size());
        assertTrue(slots.containsKey("slot1"));
        assertTrue(slots.containsValue("10:00 - 11:00"));
    }
    @Test
    public void testEmptyAvailableSlotMap() {
        // Given
        Map<String, String> emptySlot = Map.of();
        GameResponseDto gameResponse = new GameResponseDto("Football Match", LocalTime.of(14, 0), LocalTime.of(15, 0), 100.0, emptySlot);

        // When
        Map<String, String> slots = gameResponse.getAvailableSlot();

        // Then
        assertNotNull(slots);
        assertTrue(slots.isEmpty());
    }

    // 2. Test null values for fields
    @Test
    public void testNullValues() {
        // Given
        GameResponseDto gameResponse = new GameResponseDto();

        // When
        gameResponse.setName(null);
        gameResponse.setStartTime(null);
        gameResponse.setEndTime(null);
        gameResponse.setPrice(null);
        gameResponse.setAvailableSlot(null);

        // Then
        assertNull(gameResponse.getName());
        assertNull(gameResponse.getStartTime());
        assertNull(gameResponse.getEndTime());
        assertNull(gameResponse.getPrice());
        assertNull(gameResponse.getAvailableSlot());
    }

    // 3. Test price as 0.0
    @Test
    public void testPriceZero() {
        // Given
        Map<String, String> availableSlot = Map.of("slot1", "10:00 - 11:00", "slot2", "11:00 - 12:00");
        GameResponseDto gameResponse = new GameResponseDto("Football Match", LocalTime.of(14, 0), LocalTime.of(15, 0), 0.0, availableSlot);

        // When
        Double price = gameResponse.getPrice();

        // Then
        assertNotNull(price);
        assertEquals(0.0, price);
    }

    // 4. Test equal objects
    @Test
    public void testEqualObjects() {
        // Given
        Map<String, String> availableSlot1 = Map.of("slot1", "10:00 - 11:00", "slot2", "11:00 - 12:00");
        GameResponseDto gameResponse1 = new GameResponseDto("Football Match", LocalTime.of(14, 0), LocalTime.of(15, 0), 100.0, availableSlot1);

        Map<String, String> availableSlot2 = Map.of("slot1", "10:00 - 11:00", "slot2", "11:00 - 12:00");
        GameResponseDto gameResponse2 = new GameResponseDto("Football Match", LocalTime.of(14, 0), LocalTime.of(15, 0), 100.0, availableSlot2);

        // When & Then
        assertEquals(gameResponse1, gameResponse2);
    }

    // 5. Test availableSlot map with a single entry
    @Test
    public void testAvailableSlotWithSingleEntry() {
        // Given
        Map<String, String> availableSlot = Map.of("slot1", "10:00 - 11:00");
        GameResponseDto gameResponse = new GameResponseDto("Football Match", LocalTime.of(14, 0), LocalTime.of(15, 0), 100.0, availableSlot);

        // When
        Map<String, String> slots = gameResponse.getAvailableSlot();

        // Then
        assertNotNull(slots);
        assertEquals(1, slots.size());
        assertTrue(slots.containsKey("slot1"));
        assertTrue(slots.containsValue("10:00 - 11:00"));
    }

    // 6. Test invalid availableSlot data
    @Test
    public void testInvalidAvailableSlotData() {
        // Given
        Map<String, String> availableSlot = Map.of("slot1", "invalid time range");
        GameResponseDto gameResponse = new GameResponseDto("Football Match", LocalTime.of(14, 0), LocalTime.of(15, 0), 100.0, availableSlot);

        // When
        Map<String, String> slots = gameResponse.getAvailableSlot();

        // Then
        assertNotNull(slots);
        assertEquals(1, slots.size());
        assertTrue(slots.containsKey("slot1"));
        assertEquals("invalid time range", slots.get("slot1"));
    }
}
