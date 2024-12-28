import React from 'react';
import {
  Box,
  Button,
  Paper,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox
} from '@material-ui/core';
import { format } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { selectDriverById } from './store/driversSlice';

const DriverDetails = ({ id }) => {
  const driver = useSelector(state => selectDriverById(state, id));
  const loading = useSelector(state => state.driversApp.drivers.loading);
  const error = useSelector(state => state.driversApp.drivers.error);

  console.log('driver', driver);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!driver) {
    return <Typography>Driver not found.</Typography>;
  }

  return <div>drivers{id}</div>;
};

export default DriverDetails;
