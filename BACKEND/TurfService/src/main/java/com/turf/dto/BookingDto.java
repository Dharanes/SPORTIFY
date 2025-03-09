package com.turf.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDto {

	Long bookingId;
	Long userId;
	String courtName;
	Long timeSlotId;
	LocalDateTime bookedOn;
	String bookingStatus;
	LocalDate slotDate;
	LocalTime slotTime;
	int duration;
	double cost;
	
}
