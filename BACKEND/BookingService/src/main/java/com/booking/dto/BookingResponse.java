package com.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {


Long bookingId;

Long userId;
Long turfId;
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

String imageUrl;

boolean isRated;


}