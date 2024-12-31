import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Icon,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { closeNewDriverTripDialog, addTrip } from './store/driversSlice';

const schema = yup.object().shape({
  vehicle_id: yup.string().required('Vehicle ID is required'),
  departure_location: yup.string().required('Departure location is required'),
  arrival_location: yup.string().required('Arrival location is required'),
  start_date: yup.date().required('Start date is required').typeError('Start date is invalid'),
  end_date: yup
    .date()
    .min(yup.ref('start_date'), 'End date must be after start date')
    .required('End date is required')
    .typeError('End date is invalid'),
  distance: yup.string().required('Distance is required'),
  duration: yup.string().required('Duration is required')
});

function DriverTripDialog({ vehicleIds, driverFirstName, driverLastName, driverId }) {
  const dispatch = useDispatch();
  const dialogProps = useSelector(state => state.driversApp.drivers.driverTripDialog.props);

  // Default Form Values
  const defaultValues = {
    vehicle_id: '',
    departure_location: '',
    arrival_location: '',
    start_date: '',
    end_date: '',
    distance: '',
    duration: ''
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors, dirtyFields }
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const initDialog = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  useEffect(() => {
    if (dialogProps?.open) {
      initDialog();
    }
  }, [dialogProps, initDialog]);

  const onSubmit = async formData => {
    try {
      if (!driverId) throw new Error('Driver ID is missing!');
      console.log('Submitting trip:', { driverId, tripData: formData });
      const result = await dispatch(addTrip({ driverId, tripData: formData }));
      if (addTrip.fulfilled.match(result)) {
        console.log('Trip successfully added!');
        dispatch(closeNewDriverTripDialog());
      } else {
        console.error('Failed to add trip:', result.error.message);
      }
    } catch (error) {
      console.error('Failed to submit trip:', error.message);
    }
  };

  const handleClose = () => {
    dispatch(closeNewDriverTripDialog());
  };

  return (
    <Dialog open={dialogProps?.open || false} onClose={handleClose} fullWidth maxWidth="xs">
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Plan a Trip
          </Typography>
          <IconButton onClick={handleClose} style={{ marginLeft: 'auto', color: 'white' }}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="Driver Name"
            value={`${driverFirstName} ${driverLastName}`}
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true
            }}
          />
          <Controller
            control={control}
            name="vehicle_id"
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Vehicle ID"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.vehicle_id}
                helperText={errors.vehicle_id?.message}
              >
                {vehicleIds.length > 0 ? (
                  vehicleIds.map(id => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No Vehicles Available
                  </MenuItem>
                )}
              </TextField>
            )}
          />
          {[
            { name: 'departure_location', label: 'Departure Location' },
            { name: 'arrival_location', label: 'Arrival Location' },
            { name: 'start_date', label: 'Start Date', type: 'date' },
            { name: 'end_date', label: 'End Date', type: 'date' },
            { name: 'distance', label: 'Distance' },
            { name: 'duration', label: 'Duration' }
          ].map(field => (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label={field.label}
                  type={field.type || 'text'}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                />
              )}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid || !Object.keys(dirtyFields).length}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default DriverTripDialog;
