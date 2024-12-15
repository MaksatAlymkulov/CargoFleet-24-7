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
  id: '',
  first_name: '',
  phone_number: '',
  email: ''
};
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  first_name: yup.string().required('You must enter a name'),
  phone_number: yup.string().required('You must enter a phone number'),
  email: yup.string().required('You must enter an email').email('Invalid email format')
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
                  error={!!errors.name}
                  helperText={errors?.name?.message}
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
