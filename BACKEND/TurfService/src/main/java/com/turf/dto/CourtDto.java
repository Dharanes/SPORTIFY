package com.turf.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourtDto {
	Long courtId;
	String courtType;
	String courtStyle;
	Double price;
}
