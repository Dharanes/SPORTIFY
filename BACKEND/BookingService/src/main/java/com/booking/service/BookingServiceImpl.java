package com.booking.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.booking.dto.BookingDto;
import com.booking.dto.BookingResponse;
import com.booking.dto.BookingUserTurfDto;
import com.booking.dto.Customer;
import com.booking.dto.TimeSlotDto;
import com.booking.feign.CustomerClient;
import com.booking.feign.TurfClient;
import com.booking.model.Booking;
import com.booking.model.TurfDto;
import com.booking.repository.BookingRepository;

import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

private final BookingRepository bookingRepo;
private final TurfClient turfClient;
private final CustomerClient customerClient;

@Override
public void bookATurf(String authHeader, Long turfId, String gameName, Long courtId, String timeSlot,
		int duration, LocalDate date) {

	String id = null;
	if (authHeader != null && authHeader.startsWith("Bearer ")) {
		String token = authHeader.substring(7);
		Claims claim = JwtService.extractClaims(token);
		id = claim.getSubject();
	}
	List<TimeSlotDto> slots = turfClient.getAvailableSlots(turfId, gameName, courtId, duration, date);

	TimeSlotDto slot = slots.stream().filter(slo -> slo.getOpeningSlot().toString().equals(timeSlot)).findFirst()
			.orElseThrow(() -> new EntityNotFoundException("Slot doesn't available"));

	Booking booking = new Booking();
	booking.setUserId(Long.valueOf(id));
	booking.setTurfId(turfId);
	booking.setGameName(gameName);
	booking.setCourtId(courtId);
	booking.setTimeSlotId(slot.getTimeSlotId());
	booking.setDuration(duration);
	booking.setBookedOn(LocalDateTime.now());
	booking.setCost(slot.getPrice());
	booking.setSlotDate(date);
	booking.setSlotTime(LocalTime.parse(timeSlot));
	booking.setStatus("Booked");
	booking.setIsRated(false);

	bookingRepo.save(booking);

	turfClient.bookASlot(turfId, gameName, courtId, slot.getTimeSlotId(), duration,date);
}

@Override
public void cancelASlot(Long userId, Long turfId, String gameName, Long courtId, Long timeSlotId,
		Integer duration) {
	int updatedRow = bookingRepo.updateBookingStatus(courtId, timeSlotId);
	if (updatedRow > 0) {
		turfClient.freeACourt(turfId, gameName, courtId, timeSlotId, duration);
	}

}

@Override
public List<BookingResponse> getBookingByUser(String authHeader) {
	String userId = null;

	// Extract user ID from the JWT token
	if (authHeader != null && authHeader.startsWith("Bearer ")) {
		String token = authHeader.substring(7);
		Claims claim = JwtService.extractClaims(token);
		userId = claim.getSubject();
	}

	if (userId == null) {
		throw new IllegalArgumentException("Invalid authorization header");
	}

	// Fetch bookings for the user
	List<Booking> bookings = bookingRepo.findByUserId(Long.valueOf(userId));

	// Transform bookings into BookingResponse
	return bookings.stream().map(booking -> {
		// Fetch turf details using Feign client
		TurfDto turf = turfClient.getTurf(booking.getTurfId());
		String turfName = turf.getTurfName();
		String turfImage = turf.getImageUrl();

		// Fetch court name using Feign client
		String courtName = turfClient.getCourtName(booking.getCourtId());

		// Construct and return the response object
		return new BookingResponse(booking.getBookingId(),booking.getUserId(), booking.getTurfId(), turfName, booking.getGameName(),
				courtName, booking.getTimeSlotId(), booking.getStatus(), booking.getBookedOn(),
				booking.getSlotDate(), booking.getSlotTime(), booking.getDuration(), booking.getCost(), turfImage,booking.getIsRated());
	}).toList();
}

@Override
public List<BookingDto> getBookingByTurfId(Long turfId) {
	List<Booking> bookings = bookingRepo.findByTurfId(turfId);
	List<BookingDto> bookingsWithUserData = bookings.stream()
		    .map(booking -> {
		        Customer cust = customerClient.getById(booking.getUserId());
		        String courtName = turfClient.getCourtName(booking.getCourtId());

		        return new BookingDto(
		            booking.getBookingId(),
		            booking.getUserId(),
		            booking.getTurfId(),
		            booking.getGameName(),
		            booking.getCourtId(),
		            booking.getTimeSlotId(),
		            booking.getStatus(),
		            booking.getBookedOn(),
		            booking.getSlotDate(),
		            booking.getSlotTime(),
		            booking.getDuration(),
		            booking.getCost(),
		            cust.getUserName(),
		            cust.getImageUrl(),
		            courtName
		        );
		    })
		    .toList();
	bookingsWithUserData =  bookingsWithUserData.stream()
    .sorted((b2, b1) -> Long.compare(b1.getBookingId(), b2.getBookingId())).toList();
	return bookingsWithUserData;
}

@Override
public void cancelBooking(Long bookingId) {

    Optional<Booking> foundBooking = bookingRepo.findById(bookingId);

    if (foundBooking.isEmpty()) {
        throw new RuntimeException("Booking not found with ID: " + bookingId);
    } else {
        Booking booking = foundBooking.get();
        cancelASlot(booking.getBookingId(), booking.getTurfId(), booking.getGameName(), booking.getCourtId(),
                booking.getTimeSlotId(), booking.getDuration());
    }

    bookingRepo.cancelBooking(bookingId);
}

@Override
public Long numberOfBookings() {
	return (long) bookingRepo.findAll().size();
}

@Override
public String mostBookedTurf() {
    // Fetch the maximum booking count
    Long maxCount = bookingRepo.findMaxBookingCount();

    // Check if maxCount is null or 0, meaning no bookings exist
    if (maxCount == null || maxCount == 0) {
        return "No bookings available";
    }

    // Retrieve the list of most booked turfs based on the maxCount
    List<Long> mostBookedTurfs = bookingRepo.findMostBookedTurfs(maxCount);

    // Check if the list is empty
    if (mostBookedTurfs == null || mostBookedTurfs.isEmpty()) {
        return "No bookings available";
    }

    // Fetch the turf name for the first most booked turf
    String turfName = turfClient.getTurfName(mostBookedTurfs.get(0));

    // Handle potential null return from turfClient
    return turfName != null ? turfName : "Turf name not found";
}

@Override
public List<BookingUserTurfDto> getAllBookings() {
	return bookingRepo.findAll().stream().map(booking -> new BookingUserTurfDto(booking.getBookingId(),
			customerClient.getById(booking.getUserId()).getUserName(), turfClient.getTurfName(booking.getTurfId()),
			booking.getGameName(), booking.getCost(), booking.getSlotDate(), booking.getSlotTime()))
			.sorted(Comparator.comparing(BookingUserTurfDto::getDate).thenComparing(BookingUserTurfDto::getTime)
					.reversed())
			.toList();
}

@Override
public String updateRating(Long id) {
	Booking bkng = bookingRepo.findById(id).get();
	bkng.setIsRated(true);
	bookingRepo.save(bkng);
	return "updated";
}


}