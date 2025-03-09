import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import turfRegistrationReducer from './TurfRegistrationSlice'
import turfsReducer from './TurfSlice'
import locationReducer from "./LocationSlice"
import bookingReducer from "./BookingSlice"
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['jwt', 'loggedIn', 'role','imageUpdate'], 
};

const turfsConfig = {
  key: 'turfs',
  storage,
  whitelist :['turfs','gameDetails','games','ownersTurfs','pendingTurfs']
}

const locationConfig = {
  key: "location",
  storage,
  whitelist: ["location"],
};

const bookingConfig = {
  key: "booking",
  storage,
  whitelist: ["allBookings","numberOfCustomers"],
};

const persistAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistTurfsReducer = persistReducer(turfsConfig, turfsReducer);
const persistLocationReducer = persistReducer(locationConfig, locationReducer);
const persistBookingReducer = persistReducer(bookingConfig, bookingReducer);

const rootReducer = combineReducers({
  auth: persistAuthReducer, 
  turf: turfRegistrationReducer,
  turfs: persistTurfsReducer,
  location: persistLocationReducer,
  booking: persistBookingReducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store); 
export default store;