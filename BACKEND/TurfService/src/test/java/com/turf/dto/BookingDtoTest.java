package com.turf.dto;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

class BookingDtoTest {

    // Test Default Constructor
    @Test
    void testBookingDtoDefaultConstructor() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act & Assert
        assertNull(bookingDto.getBookingId());
        assertNull(bookingDto.getUserId());
        assertNull(bookingDto.getCourtName());
        assertNull(bookingDto.getTimeSlotId());
        assertNull(bookingDto.getBookedOn());
        assertNull(bookingDto.getBookingStatus());
        assertNull(bookingDto.getSlotDate());
        assertNull(bookingDto.getSlotTime());
        assertEquals(0, bookingDto.getDuration());
        assertEquals(0.0, bookingDto.getCost(), 0.0);
    }

    // Test Constructor with Arguments
    @Test
    void testBookingDtoAllArgsConstructor() {
        // Arrange
        Long bookingId = 1L;
        Long userId = 2L;
        String courtName = "Tennis Court";
        Long timeSlotId = 3L;
        LocalDateTime bookedOn = LocalDateTime.now();
        String bookingStatus = "Confirmed";
        LocalDate slotDate = LocalDate.of(2025, 1, 20);
        LocalTime slotTime = LocalTime.of(10, 30);
        int duration = 60;
        double cost = 200.0;

        // Act
        BookingDto bookingDto = new BookingDto(bookingId, userId, courtName, timeSlotId, bookedOn, bookingStatus, slotDate, slotTime, duration, cost);

        // Assert
        assertEquals(bookingId, bookingDto.getBookingId());
        assertEquals(userId, bookingDto.getUserId());
        assertEquals(courtName, bookingDto.getCourtName());
        assertEquals(timeSlotId, bookingDto.getTimeSlotId());
        assertEquals(bookedOn, bookingDto.getBookedOn());
        assertEquals(bookingStatus, bookingDto.getBookingStatus());
        assertEquals(slotDate, bookingDto.getSlotDate());
        assertEquals(slotTime, bookingDto.getSlotTime());
        assertEquals(duration, bookingDto.getDuration());
        assertEquals(cost, bookingDto.getCost(), 0.0);
    }

    // Test Setter and Getter for Booking ID
    @Test
    void testBookingIdSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setBookingId(2L);

        // Assert
        assertEquals(2L, bookingDto.getBookingId());
    }

    // Test Setter and Getter for User ID
    @Test
    void testUserIdSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setUserId(3L);

        // Assert
        assertEquals(3L, bookingDto.getUserId());
    }

    // Test Setter and Getter for Court Name
    @Test
    void testCourtNameSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setCourtName("Basketball Court");

        // Assert
        assertEquals("Basketball Court", bookingDto.getCourtName());
    }

    // Test Setter and Getter for Slot Date
    @Test
    void testSlotDateSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setSlotDate(LocalDate.of(2025, 1, 21));

        // Assert
        assertEquals(LocalDate.of(2025, 1, 21), bookingDto.getSlotDate());
    }

    // Test Setter and Getter for Slot Time
    @Test
    void testSlotTimeSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setSlotTime(LocalTime.of(14, 0));

        // Assert
        assertEquals(LocalTime.of(14, 0), bookingDto.getSlotTime());
    }

    // Test Setter and Getter for Duration
    @Test
    void testDurationSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setDuration(120);

        // Assert
        assertEquals(120, bookingDto.getDuration());
    }

    // Test Setter and Getter for Cost
    @Test
    void testCostSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setCost(300.0);

        // Assert
        assertEquals(300.0, bookingDto.getCost(), 0.0);
    }

    // Test Setter and Getter for Booking Status
    @Test
    void testBookingStatusSetterAndGetter() {
        // Arrange
        BookingDto bookingDto = new BookingDto();

        // Act
        bookingDto.setBookingStatus("Pending");

        // Assert
        assertEquals("Pending", bookingDto.getBookingStatus());
    }

    // Test toString Method
    @Test
    void testBookingDtoToString() {
        // Arrange
        BookingDto bookingDto = new BookingDto(1L, 2L, "Tennis Court", 3L, LocalDateTime.now(), "Confirmed", LocalDate.of(2025, 1, 20), LocalTime.of(10, 30), 60, 200.0);

        // Act
        String toStringResult = bookingDto.toString();

        // Assert
        assertTrue(toStringResult.contains("Tennis Court"));
        assertTrue(toStringResult.contains("Confirmed"));
        assertTrue(toStringResult.contains("200.0"));
    }
}
