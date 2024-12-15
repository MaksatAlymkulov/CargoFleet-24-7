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
import { selectVehiclesById } from './store/vehiclesSlice';

const VehicleDetails = ({ id }) => {
  const vehicle = useSelector(state => selectVehiclesById(state, id));
  const loading = useSelector(state => state.vehiclesApp.vehicles.loading);
  const error = useSelector(state => state.vehiclesApp.vehicles.error);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!vehicle) {
    return <Typography>Vehicle not found.</Typography>;
  }

  return (
    <Box style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Vehicles details
      </Typography>

      <Paper variant="outlined" style={{ display: 'flex', padding: '24px', marginBottom: '24px' }}>
        <Box style={{ flex: 1 }}>
          <Box mb={1}>
            <Typography variant="body1">
              <strong>Status:</strong>
              <span style={{ color: vehicle.active ? 'green' : 'red' }}>
                {vehicle.active ? 'Available' : 'Not Available'}
              </span>
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="body1">
              <strong>Plate number:</strong> {vehicle.plate_number}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="body1">
              <strong>Model:</strong> {vehicle.model}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="body1">
              <strong>Engine number:</strong> {vehicle.engine_number}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="body1">
              <strong>Manufactured year:</strong> {new Date(vehicle.manufacture_year).getFullYear()}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="body1">
              <strong>Fuel type:</strong> {vehicle.fuel_type || 'Unknown'}
            </Typography>
          </Box>
        </Box>
        <img
          src={vehicle.image_url}
          alt="truck"
          style={{
            width: '300px',
            height: '200px'
          }}
        />
      </Paper>

      <Typography variant="h4" gutterBottom>
        Maintenance
      </Typography>

      <TableContainer variant="outlined" style={{ padding: '24px' }} component={Paper}>
        {vehicle.issues.length > 0 ? (
          <Table style={{ minWidth: 650, marginBottom: 20 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Description:</TableCell>
                <TableCell align="right">Priority:</TableCell>
                <TableCell align="right">Due date:</TableCell>
                <TableCell align="right">Completed:</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicle.issues.map((issue, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {issue.description}
                  </TableCell>
                  <TableCell align="right">{issue.priority}</TableCell>
                  <TableCell align="right">{format(new Date(issue.due_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell align="right">
                    <Checkbox color="primary" onChange={() => {}} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table style={{ minWidth: 650, marginBottom: 20 }} aria-label="simple table">
            No issues
          </Table>
        )}
        <Button variant="outlined" color="primary">
          Schedule a maintenance
        </Button>
      </TableContainer>
    </Box>
  );
};

export default VehicleDetails;
