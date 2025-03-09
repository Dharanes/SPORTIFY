package com.turf.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

	Long bookingId;
	Long userId;
	String turfName;
	String gameName;
	String courtName;
	Long timeSlotId;
	String status;
	LocalDateTime bookedOn;
	LocalDate slotDate;
	LocalTime slotTime;

	int duration;
	double cost;
}
