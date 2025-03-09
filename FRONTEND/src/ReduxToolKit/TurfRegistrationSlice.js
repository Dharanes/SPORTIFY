import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Api/api";

// Define the async thunk for registering turf
export const registerTurf = createAsyncThunk(
  "turf/addTurf",
  async (turf, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.post(
        `${BASE_URL}/turf-service/owner/addTurf`,
        turf,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Catch error: ", error);
      return rejectWithValue(
        error.response ? error.response.data.error : error.message
      );
    }
  }
);

// Define the async thunk for registering a game to the turf
export const registerGameToTurf = createAsyncThunk(
  "turf/addGame",
  async (game, { getState }) => {
    try {
      const state = getState();
      const id = state.turf.turfId;
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

export const registerCourtToGame = createAsyncThunk(
  "turf/addCourtToGame",
  async (court, { getState }) => {
    try {
      const state = getState();
      const gameName = state.turf.gameName;
      const id = state.turf.turfId;

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
    } catch (error) {
      // Handle the error if necessary
    }
  }
);

export const getPendingRequests = createAsyncThunk(
  "turf/getPendingRequests",
  async (_, { getState }) => {
    try {
      const state = getState();

      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/owner/getPendingRequests`,
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

export const getTurfs = createAsyncThunk(
  "turf/getTurfs",
  async (_, { getState }) => {
    try {
      const state = getState();

      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/owner/getTurfs`,
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

export const getUsername = createAsyncThunk(
  "turf/getUserName",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/customer-service/getUserName`,
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

      console.log(response.data);
      return response.data;
    } catch (error) {}
  }
);

const turfSlice = createSlice({
  name: "turf",
  initialState: {
    gotData: false,
    loading: false,
    error: null,
    turfId: null,
    gameName: null,
    courtInfo: null,
    ownersTurfs: [],
    pendingTurfs: [],
    ownerName: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.gotData = true;
        state.turfId = action.payload;
      })
      .addCase(registerTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerGameToTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerGameToTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.gameName = action.payload;
      })
      .addCase(registerGameToTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerCourtToGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCourtToGame.fulfilled, (state, action) => {
        state.loading = false;
        state.courtInfo = action.payload;
        state.gameName = action.payload;
        state.gotData = true;
      })
      .addCase(registerCourtToGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTurfs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTurfs.fulfilled, (state, action) => {
        state.loading = false;
        state.ownersTurfs = action.payload;
      })
      .addCase(getTurfs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTurfs = action.payload;
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerName = action.payload;
      })
      .addCase(getUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.ownersTurfs = state.ownersTurfs.filter(
          (turf) => turf.turfName !== action.payload
        );
      })
      .addCase(deleteTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default turfSlice.reducer;
