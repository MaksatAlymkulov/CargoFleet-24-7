import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const TOKEN = 'Zb84MzAROCrhmF6t';

export const getDrivers = createAsyncThunk('driver-list-app/drivers/getDrivers', async (routeParams, { getState }) => {
  routeParams = routeParams || getState().driversApp.drivers.routeParams;
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/drivers', {
    params: routeParams,
    headers: {
      Authorization: TOKEN
    }
  });
  const data = await response.data.data;

  return { data, routeParams };
});

export const getDriver = createAsyncThunk('driver-list-app/drivers/getDriver', async driverId => {
  const response = await axios.get(`https://cargofleet-api.fly.dev/team1/api/drivers/${driverId}`, {
    headers: {
      Authorization: TOKEN
    }
  });
  return response.data;
});

export const addDriver = createAsyncThunk('driversApp/drivers/addDriver', async driver => {
  const response = await axios.post('https://cargofleet-api.fly.dev/team1/api/drivers', driver, {
    headers: { Authorization: TOKEN }
  });
  return response.data;
});

export const updateDriver = createAsyncThunk('driversApp/drivers/updateDriver', async driver => {
  const response = await axios.put(`https://cargofleet-api.fly.dev/team1/api/drivers/${driver.id}`, driver, {
    headers: { Authorization: TOKEN }
  });
  return response.data;
});

export const removeDriver = createAsyncThunk('driversApp/drivers/removeDriver', async driverId => {
  await axios.delete(`https://cargofleet-api.fly.dev/team1/api/drivers/${driverId}`, {
    headers: { Authorization: TOKEN }
  });
  return driverId;
});

export const completeTrip = createAsyncThunk('driversApp/drivers/removeDriver', async ({ driverId, tripId }) => {
  await axios.patch(
    `https://cargofleet-api.fly.dev/team1/api/drivers/${driverId}/trips/${tripId}/complete`,
    {},
    {
      headers: { Authorization: TOKEN }
    }
  );
  return { driverId, tripId };
});
export const addTrip = createAsyncThunk('driversApp/drivers/addTrip', async ({ driverId, tripData }) => {
  const response = await axios.post(`https://cargofleet-api.fly.dev/team1/api/drivers/${driverId}/trips`, tripData, {
    headers: { Authorization: TOKEN }
  });
  return response.data;
});
const driversAdapter = createEntityAdapter({});

export const { selectAll: selectDrivers, selectById: selectDriverById } = driversAdapter.getSelectors(
  state => state.driversApp.drivers
);

const driversSlice = createSlice({
  name: 'driversApp/drivers',
  initialState: driversAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    driverDialog: {
      type: 'new',
      props: {
        open: false
      },
      data: null
    },
    driverTripDialog: {
      type: 'trip',
      props: {
        open: false
      },
      data: null
    }
  }),
  reducers: {
    setDriversSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: event => ({ payload: event.target.value || '' })
    },
    openNewDriverDialog: (state, action) => {
      state.driverDialog = {
        type: 'new',
        props: {
          open: true
        },
        data: null
      };
    },
    closeNewDriverDialog: (state, action) => {
      state.driverDialog = {
        type: 'new',
        props: {
          open: false
        },
        data: null
      };
    },
    openEditDriverDialog: (state, action) => {
      state.driverDialog = {
        type: 'edit',
        props: {
          open: true
        },
        data: action.payload
      };
    },
    closeEditDriverDialog: (state, action) => {
      state.driverDialog = {
        type: 'edit',
        props: {
          open: false
        },
        data: null
      };
    },
    openNewDriverTripDialog: (state, action) => {
      state.driverTripDialog = {
        type: 'trip',
        props: {
          open: true
        },
        data: action.payload?.data || null
      };
    },
    closeNewDriverTripDialog: (state, action) => {
      state.driverTripDialog = {
        type: 'trip',
        props: {
          open: false
        },
        data: null
      };
    }
  },
  extraReducers: {
    [updateDriver.fulfilled]: driversAdapter.upsertOne,
    [addDriver.fulfilled]: driversAdapter.addOne,
    [removeDriver.fulfilled]: (state, action) => driversAdapter.removeOne(state, action.payload),
    [getDrivers.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      driversAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    },
    [getDriver.fulfilled]: (state, action) => {
      const driver = action.payload;
      driversAdapter.upsertOne(state, driver);
    },
    [completeTrip.fulfilled]: (state, action) => {
      const { driverId, tripId } = action.payload;

      const driver = state.entities[driverId];
      if (driver) {
        driver.trips = driver.trips.map(trip => (trip.id === tripId ? { ...trip, completed: true } : trip));
      }
    },
    [addTrip.fulfilled]: (state, action) => {
      const trip = action.payload;
      const driver = state.entities[trip.driverId];
      if (driver) {
        driver.trips = [...(driver.trips || []), trip];
      }
    }
  }
});

export const {
  setDriversSearchText,
  openNewDriverDialog,
  closeNewDriverDialog,
  openEditDriverDialog,
  closeEditDriverDialog,
  closeNewDriverTripDialog,
  openNewDriverTripDialog
} = driversSlice.actions;

export default driversSlice.reducer;
