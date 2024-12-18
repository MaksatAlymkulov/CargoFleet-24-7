import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import * as yup from 'yup';

import {
  removeDriver,
  updateDriver,
  addDriver,
  closeNewDriverDialog,
  closeEditDriverDialog,
  getDrivers
} from './store/driversSlice';

const defaultValues = {
  // id: '',
  first_name: '',
  last_name: '',
  birth_date: '',
  phone_number: '',
  email: '',
  address1: '',
  city: '',
  state: '',
  postal_code: '',
  license_number: ''
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  first_name: yup.string().required('You must enter a name'),
  last_name: yup.string().required('You must enter your last name'),
  phone_number: yup.string().required('You must enter a phone number'),
  email: yup.string().required('You must enter an email').email('Invalid email format'),
  address1: yup.string().required('You must enter your address'),
  city: yup.string().required('You must enter city'),
  state: yup.string().required('You must enter state'),
  postal_code: yup.string().required('You must enter a zip code'),
  license_number: yup.string().required('You must enter your license number'),
  birth_date: yup.string().required('You must enter your birth date')
});

function DriverDialog(props) {
  const dispatch = useDispatch();
  const driverDialog = useSelector(({ driversApp }) => driversApp.drivers.driverDialog);

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  console.log('######## ', dirtyFields);

  const id = watch('id');
  const first_name = watch('first_name');

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (driverDialog.type === 'edit' && driverDialog.data) {
      reset({ ...driverDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (driverDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...driverDialog.data,
        id: FuseUtils.generateGUID()
      });
    }
  }, [driverDialog.data, driverDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (driverDialog.props.open) {
      initDialog();
    }
  }, [driverDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return driverDialog.type === 'edit' ? dispatch(closeEditDriverDialog()) : dispatch(closeNewDriverDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (driverDialog.type === 'new') {
      dispatch(addDriver(data)).then(() => dispatch(getDrivers()));
    } else {
      dispatch(updateDriver({ ...driverDialog.data, ...data })).then(() => dispatch(getDrivers()));
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeDriver(id)).then(() => dispatch(getDrivers()));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24'
      }}
      {...driverDialog.props}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {driverDialog.type === 'new' ? 'New Driver' : 'Edit Driver'}
          </Typography>
          <IconButton onClick={closeComposeDialog} style={{ marginLeft: 'auto', color: 'white' }}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <Controller
              control={control}
              name="first_name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="First Name"
                  id="first_name"
                  error={!!errors.first_name}
                  helperText={errors?.first_name?.message}
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
              name="last_name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Last Name"
                  id="last_name"
                  error={!!errors.last_name}
                  helperText={errors?.last_name?.message}
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
              name="phone_number"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Phone Number"
                  id="phone_number"
                  error={!!errors.phone_number}
                  helperText={errors?.phone_number?.message}
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
              name="email"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  id="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
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
              name="birth_date"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  type="date"
                  id="birth_date"
                  error={!!errors.birth_date}
                  helperText={errors?.birth_date?.message}
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
              name="address1"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="address1"
                  id="address1"
                  error={!!errors.address1}
                  helperText={errors?.address1?.message}
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
              name="city"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="city"
                  id="city"
                  error={!!errors.city}
                  helperText={errors?.city?.message}
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
              name="state"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="state"
                  id="state"
                  error={!!errors.state}
                  helperText={errors?.state?.message}
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
              name="postal_code"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="postal_code"
                  id="postal_code"
                  error={!!errors.postal_code}
                  helperText={errors?.postal_code?.message}
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
              name="license_number"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="license_number"
                  id="license_number"
                  error={!!errors.license_number}
                  helperText={errors?.license_number?.message}
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
              {driverDialog.type === 'new' ? 'Add' : 'Save'}
            </Button>
          </div>
          {driverDialog.type === 'edit' && (
            <IconButton onClick={handleRemove}>
              <Icon>delete</Icon>
            </IconButton>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default DriverDialog;