package com.booking.dto;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDto {
	Long timeSlotId;
	LocalTime openingSlot;
	LocalTime closingSlot;
	double price;
}