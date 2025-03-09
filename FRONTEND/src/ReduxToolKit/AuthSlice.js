// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie"
import { BASE_URL, api, setAuthHeader } from "../Api/api";
import { act } from "react";


const setRefreshToken = (token) => {
  Cookies.set('refreshToken', token, { secure: true, httpOnly: true, sameSite: 'Strict' });
}

const getRefreshToken = () => {
  return Cookies.get('refreshToken');
}

const removeRefreshToken = () => {
  Cookies.remove('refreshToken');
}

export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customer-service/public/login`,
      userData
    );
    setAuthHeader(response.data.token, api);
    return response.data;
  } catch (error) {

    // Backend returned an error response
    const { status, data } = error.response;
    
    if (status === 401) {
      return rejectWithValue(data.error || "Invalid Credentials. Please try again.");
    }
    return rejectWithValue(data.error || "An unexpected error occurred.");
  }
});


export const register = createAsyncThunk("auth/register", async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customer-service/public/register`,
      userData
    );
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    localStorage.clear();
    setAuthHeader(null, api);
  } catch (error) {
    throw Error(error.response.data.error);
  }
});

export const getUserData = createAsyncThunk(
  "user/profile",
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
    } catch (error) {}
  }
);
export const refreshJwtToken = createAsyncThunk(
  "jwt/refreshToken",
  async(_,{getState}) => {
    try {
      const state = getState();
      const token = state.auth.jwt;
      const response = await axios.get(
        `${BASE_URL}/refresh-token`,
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
)
export const updateProfile = createAsyncThunk(
  "user/imageUpdate",
  async (formData, { getState }) => {
    const state = getState();
    const token = state.auth.jwt;
    try {
      const response = await axios.put(
        `${BASE_URL}/customer-service/updateImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      return response.data;
    } catch (error) {}
  }
)
export const getImage = createAsyncThunk(
  "get/image",
  async(token)=>{
    try {
      const response = await axios.get(`${BASE_URL}/customer-service/getImage`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      return response.data;
    } catch (error) { }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    loggedIn: false,
    loading: false,
    error: null,
    jwt: null,
    users: [],
    imageUpdate: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.token;
        state.role = action.payload.role;
        state.loggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;               
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }) 
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.loggedIn = false;
        state.role = null;
        state.jwt = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUpdate = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUpdate = action.payload;
      })
      .addCase(getImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshJwtToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshJwtToken.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.newToken;
      })
      .addCase(refreshJwtToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;