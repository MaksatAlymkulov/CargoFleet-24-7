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
const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
  state => state.projectDashboardApp.widgets
);

const widgetsSlice = createSlice({
  name: 'projectDashboardApp/widgets',
  initialState: widgetsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: widgetsAdapter.setAll
  }
});

export default widgetsSlice.reducer;
