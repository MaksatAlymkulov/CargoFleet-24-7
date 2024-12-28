import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// export const getWidgets = createAsyncThunk('projectDashboardApp/widgets/getWidgets', async () => {
//   const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/dashboard', {
//     headers: {
//       Authorization: 'Zb84MzAROCrhmF6t'
//     }
//   });
//   const data = await response.data;

//   return Object.entries(data).map(([key, value], index) => ({
//     id: key, // Use the key (e.g., 'active', 'inactive') as the unique ID
//     ...value // Spread the actual data
//   }));
// });
export const getWidgets = createAsyncThunk('projectDashboardApp/widgets/getWidgets', async () => {
  const response = await axios.get('/api/project-dashboard-app/widgets');
  const data = await response.data;
  return data;
});

export const fetchWeatherData = createAsyncThunk(
  'projectDashboardApp/widgets/fetchWeatherData',
  async ({ latitude, longitude }) => {
    const apiKey = '07be8dba2453f7df3552fced080f306a';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    );
    const data = await response.data;
    return data;
  }
);

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
  state => state.projectDashboardApp.widgets
);

const widgetsSlice = createSlice({
  name: 'projectDashboardApp/widgets',
  initialState: widgetsAdapter.getInitialState({ additionalWeather: null }),
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: widgetsAdapter.setAll,
    [fetchWeatherData.fulfilled]: (state, action) => {
      state.additionalWeather = action.payload;
    }
  }
});

export default widgetsSlice.reducer;
