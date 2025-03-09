package com.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.booking.model.Booking;

import feign.Param;
import jakarta.transaction.Transactional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {


@Transactional
@Modifying
@Query("UPDATE Booking b SET b.status = 'CANCELLED' " +
       "WHERE b.courtId = :courtId " +
       "AND b.timeSlotId = :timeSlotId " +
       "AND b.status = 'booked'")
int updateBookingStatus(@Param("courtId") Long courtId,@Param("timeSlotId") Long timeSlotId);

List<Booking> findByUserId(Long userId);



//	List<Booking> findByTurfName(String turfName);


List<Booking> findByTurfId(Long turfId);

@Transactional
@Modifying
@Query("UPDATE Booking b SET b.status = 'CANCELLED' " +
		 "WHERE b.bookingId = :bookingId ")
int cancelBooking(Long bookingId);

// Step 1: Find the maximum booking count
@Query("SELECT MAX(count) " +
       "FROM (SELECT COUNT(b) AS count " +
       "      FROM Booking b " +
       "      GROUP BY b.turfId) AS counts")
Long findMaxBookingCount();

// Step 2: Find the turfs with the maximum booking count
@Query("SELECT b.turfId " +
       "FROM Booking b " +
       "GROUP BY b.turfId " +
       "HAVING COUNT(b) = :maxCount")
List<Long> findMostBookedTurfs(@Param("maxCount") Long maxCount);



}