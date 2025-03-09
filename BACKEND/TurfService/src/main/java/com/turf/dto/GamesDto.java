package com.turf.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GamesDto {

	private String name;
    private LocalTime startTime;
    private LocalTime endTime;
    
}
