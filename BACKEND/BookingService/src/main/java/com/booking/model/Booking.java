package com.booking.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long bookingId;

	Long userId;
	Long turfId;
	String gameName;
	Long courtId;
	Long timeSlotId;
	String status;
	LocalDateTime bookedOn;
	LocalDate slotDate;
	LocalTime slotTime;

	int duration;
	double cost;

	Boolean isRated;

}