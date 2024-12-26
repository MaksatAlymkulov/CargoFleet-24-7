import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FuseUtils from '@fuse/utils';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import { addIssue, closeNewVehicleIssueDialog, getVehicle, selectVehiclesById } from './store/vehiclesSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  description: yup.string().required('You must enter a description'),
  priority: yup.string().required('You must select a priority').oneOf(['low', 'medium', 'high'], 'Invalid priority'),
  due_date: yup.string().required('You must enter a due date')
});

function VehicleIssueDialog({ id }) {
  const dispatch = useDispatch();
  const vehicleIssueDialog = useSelector(({ vehiclesApp }) => vehiclesApp.vehicles.vehicleIssueDialog);

  const defaultValues = {
    description: '',
    priority: '',
    due_date: ''
  };

  const { control, reset, handleSubmit, formState, getValues, watch } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;
  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    if (vehicleIssueDialog.type === 'issue') {
      reset({
        ...defaultValues,
        ...vehicleIssueDialog.data,
        vehicle_id: id
      });
    }
  }, [vehicleIssueDialog.data, vehicleIssueDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (vehicleIssueDialog.props.open) {
      initDialog();
    }
  }, [vehicleIssueDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return dispatch(closeNewVehicleIssueDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (vehicleIssueDialog.type === 'issue') {
      dispatch(addIssue(data)).then(dispatch(getVehicle(data.vehicle_id)));
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  // function handleRemove() {
  //   dispatch(removeVehicle(id)).then(() => dispatch(getVehicles()));
  //   closeComposeDialog();
  // }

  return (
    <Dialog
      classes={{
        paper: 'm-24'
      }}
      {...vehicleIssueDialog.props}
      fullWidth
      maxWidth="xs"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Description"
                  id="description"
                  error={!!errors.description}
                  helperText={errors?.description?.message}
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
              name="priority"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  className="mb-24"
                  label="Priority"
                  id="priority"
                  error={!!errors.priority}
                  helperText={errors?.priority?.message}
                  variant="outlined"
                  required
                  fullWidth
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
              )}
            />
          </div>

          <div className="flex">
            <Controller
              control={control}
              name="due_date"
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  className="mb-24"
                  label="Due Date"
                  id="due_date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.due_date}
                  helperText={errors?.due_date?.message}
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
              Add
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default VehicleIssueDialog;
