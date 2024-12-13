import { combineReducers } from '@reduxjs/toolkit';
import drivers from './driversSlice';

const reducer = combineReducers({
  drivers
});

export default reducer;
