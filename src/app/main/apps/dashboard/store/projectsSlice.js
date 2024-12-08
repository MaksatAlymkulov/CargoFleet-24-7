import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// export const getProjects = createAsyncThunk('projectDashboardApp/projects/getProjects', async () => {
//   const response = await axios.get('/api/project-dashboard-app/projects');
//   return response.data;
// });
export const getProjects = createAsyncThunk('projectDashboardApp/projects/getProjects', async () => {
  const response = await axios.get('https://cargofleet-api.fly.dev/team1/api/dashboard', {
    headers: {
      Authorization: 'Zb84MzAROCrhmF6t'
    }
  });
  const data = await response.data;

  return Object.entries(data).map(([key, value], index) => ({
    id: key, // Use the key (e.g., 'active', 'inactive') as the unique ID
    ...value // Spread the actual data
  }));
});

const projectsAdapter = createEntityAdapter({ selectId: widget => widget.id });

export const {
  selectAll: selectProjects,
  selectEntities: selectProjectsEntities,
  selectById: selectProjectById
} = projectsAdapter.getSelectors(state => state.projectDashboardApp.projects);

const projectsSlice = createSlice({
  name: 'projectDashboardApp/projects',
  initialState: projectsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getProjects.fulfilled]: projectsAdapter.setAll
  }
});

export default projectsSlice.reducer;
