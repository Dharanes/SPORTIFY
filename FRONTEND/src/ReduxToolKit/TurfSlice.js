import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, api } from "../Api/api";

export const fetchTurfsByLocationAndGame = createAsyncThunk(
  "turf/getByLocationAndGame",
  async ({ selectedSport, loc }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/turf-service/public/byLocationAndGame/${loc}/${selectedSport}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching turfs: ", error);
      return rejectWithValue(
        error.response ? error.response.data : "An unexpected error occurred."
      );
    }
  }
);

export const getGamesByTurfId = createAsyncThunk(
  "games/turfName",
  async (turfId, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/public/getGames/${turfId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching turfs: ", error);
    }
  }
);

export const getCourts = createAsyncThunk(
  "courts/getCourts",
  async (
    { selectedGame, selectedDate, selectedTime, hours },
    { getState }
  ) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/getCourtByTimeSlot/${selectedGame}/${selectedDate}/${selectedTime}/${hours}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const bookATurf = createAsyncThunk(
  "turf/book",
  async (
    {
      turfId,
      gameName,
      selectedDate,
      courtId,
      selectedTime,
      hours,
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.post(
        `${BASE_URL}/booking-service/book/${turfId}/${gameName}/${selectedDate}/${courtId}/${selectedTime}/${hours}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching time slots:", error);
      return rejectWithValue(
        error.response ? error.response.data : "An unexpected error occurred."
      );
    }
  }
);

export const getTimeSlot = createAsyncThunk(
  "timeslot/get",
  async (
    { selectedGame, turfId, selectedDate },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = state.auth.jwt;

      const response = await axios.get(
        `${BASE_URL}/turf-service/getTimeSlot/${turfId}/${selectedGame}/${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching time slots:", error);
      return rejectWithValue(
        error.response ? error.response.data : "An unexpected error occurred."
      );
    }
  }
);

export const getBookings = createAsyncThunk(
  "turf/bookings",
  async (turfId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/booking-service/admin/getBookingByTurfId/${turfId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching turfs: ", error);
      return rejectWithValue(
        error.response ? error.response.data : "An unexpected error occurred."
      );
    }
  }
);
export const getPrice = createAsyncThunk(
  "turf/bookings/getPrice",
  async (
    { selectedCourt },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/getPrice/${selectedCourt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching time slots:", error);
      return rejectWithValue(
        error.response ? error.response.data : "An unexpected error occurred."
      );
    }
  }
);

export const updateUserProfile =createAsyncThunk(
  "user/update",
  async(updatedCustomerDto,{getState}) =>{
    try {
      
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.put(
        `${BASE_URL}/customer-service/updateProfile`,updatedCustomerDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      
    }
  }
)

export const deleteCourtById = createAsyncThunk(
  "court/delete",
  async({id},{getState}) =>{
    try {
      
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.delete(
        `${BASE_URL}/turf-service/owner/deleteCourtFromGame/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      
    }
  }
);
export const getGamesDetails = createAsyncThunk(
  "turf/getGameDetails",
  async (turfId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/turf-service/public/getTurfDetailsById/${turfId}`
      );
      return response.data;
    } catch (error) {}
  }
);
export const payment = createAsyncThunk(
  "turf/booking/payment",
  async (paymentData, { getState }) => {
    
    const state = getState();
    const token = state.auth.jwt;
    sessionStorage.setItem("payment", JSON.stringify(paymentData));
    await axios
      .post(
        `${BASE_URL}/payment-service/payment-confirmation`,
        {
          amount: paymentData.price,
          name: `${paymentData.turfName} - ${paymentData.gameName}`,
          currency: "INR",
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        window.location.href = response.data.sessionUrl;
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again later.");
        console.error("Payment error:", error);
      });
  }
);
export const getUserBooking = createAsyncThunk(
  "booking/getUserbookings",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.jwt;
    const response = await axios.get(
      `${BASE_URL}/booking-service/getBookingByUser`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);
export const deleteTurf = createAsyncThunk(
  "turf/delete",
  async (turfName, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.delete(
        `${BASE_URL}/turf-service/owner/deleteTurf/${turfName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {}
  }
);
export const updateCourtData = createAsyncThunk(
  "turf/update",
  async ({ gameName, turfId, court }, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      
      const response = await axios.put(
        `${BASE_URL}/turf-service/owner/updatePrice/${turfId}/${gameName}/${court.name}`,
        {
          courtType: court.name,
          courtStyle: court.description,
          price: court.price.match(/\d+/)[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }
);
export const getTurfId = createAsyncThunk(
  "turf/getTurfId",
  async (turfName, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;      
      const response = await axios.get(
        `${BASE_URL}/turf-service/turfId/${turfName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {}
  }
);
export const registerCourtToGameById = createAsyncThunk(
  "turf/getCourt",
  async ({ id, gameName, court }, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.post(
        `${BASE_URL}/turf-service/owner/addCourtsToGame/${id}/${gameName}`,
        court,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }
);
export const deleteGame = createAsyncThunk(
  "turf/deleteGame",
  async({turfId,gameName},{getState}) => {
    try {
      const state = getState()
      const token = state.auth.jwt;
      const response = await axios.delete(`${BASE_URL}/turf-service/owner/deleteGame/${turfId}/${gameName}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data;
    } catch (error) {
      
    }
  }
)
export const registerGameToTurfById = createAsyncThunk(
  "turf/addGame",
  async ({game,id}, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.post(
        `${BASE_URL}/turf-service/owner/registerGameToTurf/${id}`,
        game,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Handle the error if necessary
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async(id,{getState}) => {
    try{
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.put(
        `${BASE_URL}/booking-service/cancel/${id}`,{},{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data;
    }catch(error){

    }
  }
)

export const submitRatings = createAsyncThunk(
  "turf/rating",
  async({turfId,rating},{getState}) =>{
    try {
      const state = getState()
      const token = state.auth.jwt;
      const response = await axios.put(
        `${BASE_URL}/turf-service/updateRatings/${turfId}/${rating}`,{},{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data;
    } catch (error) {
      
    }
  }
)
export const updateIsRated = createAsyncThunk(
  "turf/rating",
  async(id,{getState}) =>{
    try {
      const state = getState()
      const token = state.auth.jwt;
      const response = await axios.put(
        `${BASE_URL}/booking-service/updateRating/${id}`,{},{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data;
    } catch (error) {
      
    }
  }
)

export const courtDetails = createAsyncThunk(
  "court/details",
  async({turfId,gameId})=>{
    try {
      const response = await axios.get(
        `${BASE_URL}/turf-service/public/courtDetails/${turfId}/${gameId}`
      )
      return response.data;
    } catch (error) {
      
    }
  }
)

// Turf slice
const turfSlice = createSlice({
  name: "turfs",
  initialState: {
    turfs: [],
    games: [],
    timeSlots: [],
    courts: [],
    courtDetail:[],
    booking: [],
    gameDetails: [],
    paymentData: [],
    profileData: [],
    flag: null,
    ratingFlag:null,
    cancelFlag: null,
    id:null,
    paymentRespose: null,
    updateFlag: null,
    price: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurfsByLocationAndGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurfsByLocationAndGame.fulfilled, (state, action) => {
        state.loading = false;
        state.turfs = action.payload;
      })
      .addCase(fetchTurfsByLocationAndGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGamesByTurfId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGamesByTurfId.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(getGamesByTurfId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTimeSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTimeSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlots = action.payload;
      })
      .addCase(getTimeSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCourts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourts.fulfilled, (state, action) => {
        state.loading = false;
        state.courts = action.payload;
      })
      .addCase(getCourts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(courtDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(courtDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.courtDetail = action.payload;
      })
      .addCase(courtDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGamesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGamesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.gameDetails = action.payload;
      })
      .addCase(getGamesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.price = action.payload;
      })
      .addCase(getPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(payment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentRespose = action.payload;
        state.paymentData = action.meta.arg;
      })
      .addCase(payment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(getUserBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTurfId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTurfId.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload;
      })
      .addCase(getTurfId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.loading = false;
        state.gameDetails = state.gameDetails = state.gameDetails.filter(
          (game) => game.gameName !== action.payload
        );
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerGameToTurfById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerGameToTurfById.fulfilled, (state, action) => {
        state.loading = false;
        state.flag = true;
      })
      .addCase(registerGameToTurfById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelFlag = true;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIsRated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIsRated.fulfilled, (state, action) => {
        state.loading = false;
        state.ratingFlag = true;
      })
      .addCase(updateIsRated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCourtData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourtData.fulfilled, (state, action) => {
        state.loading = false;
        state.updateFlag = true;
      })
      .addCase(updateCourtData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default turfSlice.reducer;
