package com.booking.service;

import java.time.LocalDate;
import java.util.List;

import com.booking.dto.BookingDto;
import com.booking.dto.BookingResponse;
import com.booking.dto.BookingUserTurfDto;

public interface BookingService {
void bookATurf(String authHeader, Long turfId, String gameName, Long courtId, String timeSlot, int duration, LocalDate date);

void cancelASlot(Long userId, Long turfId, String gameName, Long courtId, Long timeSlotId,Integer duration);

List<BookingResponse> getBookingByUser(String authorizationHeader);

List<BookingDto> getBookingByTurfId(Long turfId);

void cancelBooking(Long bookingId);

Long numberOfBookings();

String mostBookedTurf();

List<BookingUserTurfDto> getAllBookings();

String updateRating(Long id);


}