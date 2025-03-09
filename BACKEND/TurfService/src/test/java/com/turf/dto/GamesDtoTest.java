package com.turf.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

public class GamesDtoTest {

    @Test
    public void testConstructorAndGetters() {
        // Given
        String name = "Football Match";
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(15, 0);

        // When
        GamesDto game = new GamesDto(name, startTime, endTime);

        // Then
        assertNotNull(game);
        assertEquals(name, game.getName());
        assertEquals(startTime, game.getStartTime());
        assertEquals(endTime, game.getEndTime());
    }

    @Test
    public void testSetters() {
        // Given
        GamesDto game = new GamesDto();

        // When
        game.setName("Football Match");
        game.setStartTime(LocalTime.of(14, 0));
        game.setEndTime(LocalTime.of(15, 0));

        // Then
        assertEquals("Football Match", game.getName());
        assertEquals(LocalTime.of(14, 0), game.getStartTime());
        assertEquals(LocalTime.of(15, 0), game.getEndTime());
    }
    
    @Test
    public void testEmptyConstructor() {
        // Given
        GamesDto game = new GamesDto();

        // When & Then
        assertNull(game.getName());
        assertNull(game.getStartTime());
        assertNull(game.getEndTime());
    }

    // 2. Test setting null values for setters
    @Test
    public void testSettersWithNullValues() {
        // Given
        GamesDto game = new GamesDto();

        // When
        game.setName(null);
        game.setStartTime(null);
        game.setEndTime(null);

        // Then
        assertNull(game.getName());
        assertNull(game.getStartTime());
        assertNull(game.getEndTime());
    }

    // 3. Test equal objects
    @Test
    public void testEqualObjects() {
        // Given
        String name = "Football Match";
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(15, 0);

        GamesDto game1 = new GamesDto(name, startTime, endTime);
        GamesDto game2 = new GamesDto(name, startTime, endTime);

        // When & Then
        assertEquals(game1, game2);
    }

    // 4. Test startTime equals endTime (edge case)
    @Test
    public void testStartTimeEqualsEndTime() {
        // Given
        String name = "Instant Game";
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(14, 0);

        // When
        GamesDto game = new GamesDto(name, startTime, endTime);

        // Then
        assertNotNull(game);
        assertEquals(startTime, game.getStartTime());
        assertEquals(endTime, game.getEndTime());
    }

    // 5. Test with differing startTime and endTime
    @Test
    public void testStartTimeAndEndTimeDiffer() {
        // Given
        String name = "Football Match";
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(15, 0);

        // When
        GamesDto game = new GamesDto(name, startTime, endTime);

        // Then
        assertNotNull(game);
        assertEquals(startTime, game.getStartTime());
        assertEquals(endTime, game.getEndTime());
    }

    // 6. Test `startTime` and `endTime` with boundary values (midnight and just before midnight)
    @Test
    public void testBoundaryStartTimeAndEndTime() {
        // Given
        String name = "Midnight Game";
        LocalTime startTime = LocalTime.MIDNIGHT;
        LocalTime endTime = LocalTime.MIDNIGHT.minusSeconds(1);  // Just before midnight

        // When
        GamesDto game = new GamesDto(name, startTime, endTime);

        // Then
        assertNotNull(game);
        assertEquals(startTime, game.getStartTime());
        assertEquals(endTime, game.getEndTime());
    }

    // 7. Test `name` with long string input
    @Test
    public void testLongName() {
        // Given
        String name = "Super Long Football Match Name That Could Exceed Usual Length";
        LocalTime startTime = LocalTime.of(14, 0);
        LocalTime endTime = LocalTime.of(16, 0);

        // When
        GamesDto game = new GamesDto(name, startTime, endTime);

        // Then
        assertNotNull(game);
        assertEquals(name, game.getName());
    }

    // 8. Test `GamesDto` when values are set after instantiation
    @Test
    public void testSettersAfterInstantiation() {
        // Given
        GamesDto game = new GamesDto();
        String name = "Basketball Match";
        LocalTime startTime = LocalTime.of(18, 0);
        LocalTime endTime = LocalTime.of(20, 0);

        // When
        game.setName(name);
        game.setStartTime(startTime);
        game.setEndTime(endTime);

        // Then
        assertEquals(name, game.getName());
        assertEquals(startTime, game.getStartTime());
        assertEquals(endTime, game.getEndTime());
    }

    // 9. Test invalid startTime (startTime after endTime)
    @Test
    public void testInvalidStartTimeAfterEndTime() {
        // Given
        String name = "Invalid Time Game";
        LocalTime startTime = LocalTime.of(16, 0);
        LocalTime endTime = LocalTime.of(14, 0);  // Invalid: endTime is before startTime

        // When
        GamesDto game = new GamesDto(name, startTime, endTime);

        // Then
        assertNotNull(game);
        assertEquals(startTime, game.getStartTime());
        assertEquals(endTime, game.getEndTime());
    }
}
