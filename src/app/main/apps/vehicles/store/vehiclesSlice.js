import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { Token } from 'prismjs';
import { getUserData } from './userSlice';

const TOKEN = 'Zb84MzAROCrhmF6t';

export const getVehicles = createAsyncThunk(
  'vehicle-list-app/vehicles/getVehicles',
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().vehiclesApp.vehicles.routeParams;
    const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/vehicles', {
      params: routeParams,
      headers: {
        Authorization: TOKEN
      }
    });
    const data = await response.data.data;

    return { data, routeParams };
  }
);

export const addVehicle = createAsyncThunk('vehiclesApp/vehicles/addVehicle', async vehicle => {
  const response = await axios.post('https://cargofleet-api.fly.dev/team1/api/vehicles', vehicle, {
    headers: { Authorization: TOKEN }
  });
  return response.data;
});

export const updateVehicle = createAsyncThunk('vehiclesApp/vehicles/updateVehicle', async vehicle => {
  const response = await axios.put(`https://cargofleet-api.fly.dev/team1/api/vehicles/${vehicle.id}`, vehicle, {
    headers: { Authorization: TOKEN }
  });
  return response.data;
});

export const removeVehicle = createAsyncThunk('vehiclesApp/vehicles/removeVehicle', async vehicleId => {
  await axios.delete(`https://cargofleet-api.fly.dev/team1/api/vehicles/${vehicleId}`, {
    headers: { Authorization: TOKEN }
  });
  return vehicleId;
});

// export const removeVehicles = createAsyncThunk(
//   'vehiclesApp/vehicles/removeVehicles',
//   async (vehicleIds, { dispatch, getState }) => {
//     await axios.post('/api/vehicles-app/remove-vehicles', { vehicleIds });

//     return vehicleIds;
//   }
// );

// export const toggleStarredVehicle = createAsyncThunk(
//   'vehiclesApp/vehicles/toggleStarredVehicle',
//   async (vehicleId, { dispatch, getState }) => {
//     const response = await axios.post('/api/vehicles-app/toggle-starred-vehicle', { vehicleId });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

// export const toggleStarredVehicles = createAsyncThunk(
//   'vehiclesApp/vehicles/toggleStarredVehicles',
//   async (vehicleIds, { dispatch, getState }) => {
//     const response = await axios.post('/api/vehicles-app/toggle-starred-vehicles', { vehicleIds });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

// export const setVehiclesStarred = createAsyncThunk(
//   'vehiclesApp/vehicles/setVehiclesStarred',
//   async (vehicleIds, { dispatch, getState }) => {
//     const response = await axios.post('/api/vehicles-app/set-vehicles-starred', { vehicleIds });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

// export const setVehiclesUnstarred = createAsyncThunk(
//   'vehiclesApp/vehicles/setVehiclesUnstarred',
//   async (vehicleIds, { dispatch, getState }) => {
//     const response = await axios.post('/api/vehicles-app/set-vehicles-unstarred', { vehicleIds });
//     const data = await response.data;

//     dispatch(getUserData());

//     dispatch(getVehicles());

//     return data;
//   }
// );

const vehiclesAdapter = createEntityAdapter({});

export const { selectAll: selectVehicles, selectById: selectVehiclesById } = vehiclesAdapter.getSelectors(
  state => state.vehiclesApp.vehicles
);

const vehiclesSlice = createSlice({
  name: 'vehiclesApp/vehicles',
  initialState: vehiclesAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    vehicleDialog: {
      type: 'new',
      props: {
        open: false
      },
      data: null
    }
  }),
  reducers: {
    setVehiclesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: event => ({ payload: event.target.value || '' })
    },
    openNewVehicleDialog: (state, action) => {
      state.vehicleDialog = {
        type: 'new',
        props: {
          open: true
        },
        data: null
      };
    },
    closeNewVehicleDialog: (state, action) => {
      state.vehicleDialog = {
        type: 'new',
        props: {
          open: false
        },
        data: null
      };
    },
    openEditVehicleDialog: (state, action) => {
      state.vehicleDialog = {
        type: 'edit',
        props: {
          open: true
        },
        data: action.payload
      };
    },
    closeEditVehicleDialog: (state, action) => {
      state.vehicleDialog = {
        type: 'edit',
        props: {
          open: false
        },
        data: null
      };
    }
  },
  extraReducers: {
    // [updateVehicle.fulfilled]: vehiclesAdapter.upsertOne,
    // [addVehicle.fulfilled]: vehiclesAdapter.addOne,
    // [removeVehicles.fulfilled]: (state, action) => vehiclesAdapter.removeMany(state, action.payload),
    // [removeVehicle.fulfilled]: (state, action) => vehiclesAdapter.removeOne(state, action.payload),
    [getVehicles.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      vehiclesAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    }
  }
});

export const {
  setVehiclesSearchText,
  openNewVehicleDialog,
  closeNewVehicleDialog,
  openEditVehicleDialog,
  closeEditVehicleDialog
} = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
