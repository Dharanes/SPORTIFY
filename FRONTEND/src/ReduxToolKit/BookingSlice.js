import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, api, setAuthHeader } from "../Api/api";

export const getNumberOfCustomers = createAsyncThunk(
  "admin/numberofcustomers",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/customer-service/admin/numberofusers`,
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
export const getNumberOfTurfs = createAsyncThunk(
  "admin/numberofturfs",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/numberofturf`,
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
export const getMostBookedTurf = createAsyncThunk(
  "admin/mostbookedturfs",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/booking-service/admin/mostbookedturf`,
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
export const getAllBookings = createAsyncThunk(
  "admin/allbookings",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/booking-service/admin/getAllBookings`,
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
export const getAllTurfs = createAsyncThunk(
  "admin/allbookings",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/booking-service/admin/getAllBookings`,
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

export const getPendingTurf = createAsyncThunk(
  "admin/pendingTurfs",
  async (_,{ getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/getPendingRequests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("turf approval",response.data);
      
      return response.data;
    } catch (error) {}
  }
);
export const getApprovedTurf = createAsyncThunk(
  "admin/approvedTurf",
  async (_,{ getState }) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/turf-service/getApprovedRequests`,
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
export const updateStatus = createAsyncThunk(
  "admin/updateStatus",
  async({id,status},{getState}) =>{
    try {
      console.log(id,status,`${BASE_URL}/turf-service/updateStatus/${id}/${status}`)
      const state = getState()
      const token = state.auth.jwt;
      const response = await axios.put(
        `${BASE_URL}/turf-service/updateStatus/${id}/${status}`,null,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      
    }
  }
)

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    numberOfCustomers: null,
    numberOfTurfs: null,
    mostBookedTurf: null,
    allBookings: null,
    pending: [],
    approved: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNumberOfCustomers.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(getNumberOfCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.numberOfCustomers = action.payload;
      })
      .addCase(getNumberOfCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getNumberOfTurfs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNumberOfTurfs.fulfilled, (state, action) => {
        state.loading = false;
        state.numberOfTurfs = action.payload;
      })
      .addCase(getNumberOfTurfs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMostBookedTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMostBookedTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.mostBookedTurf = action.payload;
      })
      .addCase(getMostBookedTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPendingTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(getPendingTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getApprovedTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApprovedTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.approved = action.payload;
      })
      .addCase(getApprovedTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default bookingSlice.reducer;
