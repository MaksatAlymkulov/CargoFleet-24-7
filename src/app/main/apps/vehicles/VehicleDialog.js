import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import {
  removeVehicle,
  updateVehicle,
  addVehicle,
  closeNewVehicleDialog,
  closeEditVehicleDialog,
  getVehicles
} from './store/vehiclesSlice';

const defaultValues = {
  id: '',
  model: '',
  plate_number: '',
  engine_number: '',
  manufacture_year: '',
  fuel_type: '',
  image_url: ''
};
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  model: yup.string().required('You must enter a model'),
  plate_number: yup.string().required('You must enter a plate number'),
  engine_number: yup.string().required('You must enter an engine number'),
  manufacture_year: yup
    .date()
    .required('You must enter a manufacture year')
    .typeError('Invalid date format, use YYYY-MM-DD'),
  fuel_type: yup
    .string()
    .required('You must select a fuel type')
    .oneOf(['gasoline', 'propane', 'diesel', 'natural_gas'], 'Invalid fuel type'),
  image_url: yup.string().required('You must enter an image URL').url('Must be a valid URL')
});

function VehicleDialog(props) {
  const dispatch = useDispatch();
  const vehicleDialog = useSelector(({ vehiclesApp }) => vehiclesApp.vehicles.vehicleDialog);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const model = watch('model');

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (vehicleDialog.type === 'edit' && vehicleDialog.data) {
      reset({ ...vehicleDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (vehicleDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...vehicleDialog.data,
        id: FuseUtils.generateGUID()
      });
    }
  }, [vehicleDialog.data, vehicleDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (vehicleDialog.props.open) {
      initDialog();
    }
  }, [vehicleDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return vehicleDialog.type === 'edit' ? dispatch(closeEditVehicleDialog()) : dispatch(closeNewVehicleDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (vehicleDialog.type === 'new') {
      dispatch(addVehicle(data)).then(() => dispatch(getVehicles()));
    } else {
      dispatch(updateVehicle({ ...vehicleDialog.data, ...data })).then(() => dispatch(getVehicles()));
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeVehicle(id)).then(() => dispatch(getVehicles()));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24'
      }}
      {...vehicleDialog.props}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {vehicleDialog.type === 'new' ? 'New Vehicle' : 'Edit Vehicle'}
          </Typography>
          <IconButton onClick={closeComposeDialog} style={{ marginLeft: 'auto', color: 'white' }}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          <Avatar className="w-96 h-96" alt="vehicle avatar" src={getValues('image_url')} />
          {vehicleDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {model}
            </Typography>
          )}
        </div>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <Controller
              control={control}
              name="model"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Model"
                  id="model"
                  error={!!errors.model}
                  helperText={errors?.model?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={control}
              name="plate_number"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Plate Number"
                  id="plate_number"
                  error={!!errors.plate_number}
                  helperText={errors?.plate_number?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={control}
              name="engine_number"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Engine Number"
                  id="engine_number"
                  error={!!errors.engine_number}
                  helperText={errors?.engine_number?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={control}
              name="manufacture_year"
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  className="mb-24"
                  label="Manufacture Year"
                  id="manufacture_year"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.manufacture_year}
                  helperText={errors?.manufacture_year?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={control}
              name="fuel_type"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  className="mb-24"
                  label="Fuel Type"
                  id="fuel_type"
                  error={!!errors.fuel_type}
                  helperText={errors?.fuel_type?.message}
                  variant="outlined"
                  required
                  fullWidth
                >
                  <MenuItem value="gasoline">Gasoline</MenuItem>
                  <MenuItem value="propane">Propane</MenuItem>
                  <MenuItem value="diesel">Diesel</MenuItem>
                  <MenuItem value="natural_gas">Natural Gas</MenuItem>
                </TextField>
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={control}
              name="image_url"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Image URL"
                  id="image_url"
                  error={!!errors.image_url}
                  helperText={errors?.image_url?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions className="justify-between p-4 pb-16">
          <div className="px-16">
            <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
              {vehicleDialog.type === 'new' ? 'Add' : 'Save'}
            </Button>
          </div>
          {vehicleDialog.type === 'edit' && (
            <IconButton onClick={handleRemove}>
              <Icon>delete</Icon>
            </IconButton>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default VehicleDialog;
