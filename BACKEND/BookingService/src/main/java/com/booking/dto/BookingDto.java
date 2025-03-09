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
public class BookingDto {


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

String userName;
String imageUrl;
String courtName;


}