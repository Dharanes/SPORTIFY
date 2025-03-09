package com.customer.model;

import java.time.LocalDateTime;

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
	Long courtId;
	Long timeSlotId;
	String status;
	LocalDateTime bookedOn;

	int duration;
	double cost;
}
