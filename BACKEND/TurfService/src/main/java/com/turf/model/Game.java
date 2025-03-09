package com.turf.model;

import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Game {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY )
	Long gameID;
	String game;
	LocalTime startTime;
	LocalTime endTime;
	
	@ManyToOne
	@JoinColumn(name="turf_id")
	@JsonBackReference
	Turf turf;
	
	@OneToMany(mappedBy = "game",cascade = CascadeType.ALL,orphanRemoval = true)
	@JsonManagedReference
	List<Court> courts;
	
	@Override
	public boolean equals(Object o) {
		if(this == o ) return true;
		
		if(o == null || getClass() != o.getClass()) return false;
		
		Game g = (Game) o;
		
		return Objects.equals(game, g.getGame());
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(game);
	}
	
}
