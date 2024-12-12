import React, { useEffect, useState } from 'react';
import { Box, Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { selectVehiclesById } from './store/vehiclesSlice';

const VehicleDetails = ({ id }) => {
  const vehicle = useSelector(state => selectVehiclesById(state, id));
  const loading = useSelector(state => state.vehiclesApp.vehicles.loading);
  const error = useSelector(state => state.vehiclesApp.vehicles.error);

  console.log('vehicle', vehicle);

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
              <strong>Manufactured year:</strong> {vehicle.manufacture_year}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="body1">
              <strong>Fuel type:</strong> {vehicle.fuel_type || 'Unknown'}
            </Typography>
          </Box>
          <Box sx={{ border: '1px grey' }}>
            <Typography variant="body1">
              <strong>Issues:</strong>
              {vehicle.issues.length > 0 ? (
                vehicle.issues.map((issue, index) => (
                  <div key={index}>
                    <div>
                      <strong>Description:</strong> {issue.description}
                    </div>
                    <div>
                      <strong>Priority:</strong> {issue.priority}
                    </div>
                    <div>
                      <strong>Due date:</strong> {issue.due_date}
                    </div>
                  </div>
                ))
              ) : (
                <div>No issues</div>
              )}
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

      {/* Maintenance Section */}
      <Typography variant="h4" gutterBottom>
        Maintenance
      </Typography>
      <Paper variant="outlined" style={{ padding: '24px' }}>
        {/* If no maintenances: */}
        <Typography variant="body1" color="textSecondary" paragraph>
          No maintenances yet...
        </Typography>
        <Button variant="outlined" color="primary">
          Schedule a maintenance
        </Button>
      </Paper>
    </Box>
  );
};

export default VehicleDetails;
