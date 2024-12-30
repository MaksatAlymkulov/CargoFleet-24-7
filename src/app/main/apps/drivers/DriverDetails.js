import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { Box, Button, Checkbox } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { completeTrip, selectDriverById } from './store/driversSlice';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#F0F0F0',
    color: theme.palette.common.black,
    border: '1px solid lightgrey'
  },
  body: {
    fontSize: 14,
    border: '1px solid lightgrey',
    padding: '0 0 0 10px'
  }
}))(TableCell);
const CustomCheckbox = withStyles({
  root: {
    color: '#1c54b2',
    '&$checked': {
      color: '#1c54b2'
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

const useStyles = makeStyles({
  table: {
    minWidth: 700
  },
  tableContainer: {
    margin: '0 24px 24px 24px',
    boxSizing: 'border-box',
    width: 'calc(100% - 48px)',
    overflowX: 'auto'
  },
  typography: {
    marginBottom: '30px'
  },
  paper: {
    marginBottom: '30px'
  },
  paper1: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '24px',
    marginBottom: '24px'
  },
  button: {
    width: '180px',
    marginLeft: '3rem',
    borderRadius: '5px',
    fontSize: '1.5rem'
  }
});

const DriverDetails = ({ id }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const driver = useSelector(state => selectDriverById(state, id));
  const loading = useSelector(state => state.driversApp.drivers.loading);
  const error = useSelector(state => state.driversApp.drivers.error);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!driver) {
    return <Typography>Driver not found.</Typography>;
  }
  const driverInfo = [
    { label: 'Email', value: driver.email },
    { label: 'Phone number', value: driver.phone_number },
    { label: 'Address Line 1', value: driver.address1 },
    { label: 'Address Line 2', value: driver.address2 },
    { label: 'City', value: driver.city },
    { label: 'State', value: driver.state },
    { label: 'Postal code', value: driver.postal_code },
    { label: 'Country', value: driver.country }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Driver Details
      </Typography>
      <Paper square variant="outlined" className={classes.paper1}>
        <Box style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              General Information
            </Typography>
            <Typography style={{ fontSize: '1.5rem' }} gutterBottom>
              <strong>Full name: </strong>
              {driver.first_name} {driver.last_name}
            </Typography>

            <Typography style={{ fontSize: '1.5rem' }} gutterBottom>
              <strong>Date of birth:</strong> {driver.birth_date}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="h4" gutterBottom>
              User Information
            </Typography>

            <Typography style={{ fontSize: '1.5rem' }} gutterBottom>
              <strong>License number:</strong> {driver.license_number}
            </Typography>
            <Typography style={{ fontSize: '1.5rem' }} gutterBottom>
              <strong>License class:</strong> {driver.license_class}
            </Typography>
          </Box>
        </Box>
        <Box style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" gutterBottom>
            {' '}
            Contact Information
          </Typography>
          {driverInfo.map(info => (
            <Box mb={1} key={info.label}>
              <Typography style={{ fontSize: '1.5rem' }}>
                <strong>{info.label}: </strong>
                <span>{info.value}</span>
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
      <Paper square variant="outlined" className={classes.paper}>
        <Box style={{ display: 'flex', padding: '24px', alignItems: 'center' }}>
          <Typography variant="h4"> Recent Trips</Typography>
          <Button size="small" variant="contained" color="inherit" className={classes.button}>
            Plan a trip
          </Button>
        </Box>
        {driver.trips.length > 0 ? (
          <TableContainer square component={Paper}>
            <Table className={classes.tableContainer} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Vehicle</StyledTableCell>
                  <StyledTableCell align="left">From - To</StyledTableCell>
                  <StyledTableCell align="left">Start date</StyledTableCell>
                  <StyledTableCell align="left">End date</StyledTableCell>
                  <StyledTableCell align="left">Distance</StyledTableCell>
                  <StyledTableCell align="left">Duration</StyledTableCell>
                  <StyledTableCell align="left">Completed</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {driver.trips.map(trip => (
                  <TableRow key={trip.id}>
                    <StyledTableCell component="th" scope="row">
                      {trip.vehicle_id}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {' '}
                      {trip.departure_location} - {trip.arrival_location}
                    </StyledTableCell>
                    <StyledTableCell align="left"> {new Date(trip.start_date).toLocaleDateString()}</StyledTableCell>
                    <StyledTableCell align="left">{new Date(trip.end_date).toLocaleDateString()}</StyledTableCell>
                    <StyledTableCell align="left">{trip.distance}</StyledTableCell>
                    <StyledTableCell align="left">{trip.duration}</StyledTableCell>
                    <StyledTableCell align="left">
                      <CustomCheckbox
                        className={classes.checkbox}
                        onChange={() => dispatch(completeTrip({ driverId: driver.id, tripId: trip.id }))}
                        checked={trip.completed}
                      />
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary" className={classes.typography}>
            This driver has no trips.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DriverDetails;
