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
import { useSelector } from 'react-redux';
import { selectDriverById } from './store/driversSlice';

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

const StyledTableRow = withStyles(theme => ({
  root: {
    td: {
      border: '1px solid lightgrey'
    }
  }
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
];

const useStyles = makeStyles({
  table: {
    minWidth: 700
  },
  tableContainer: {
    margin: '0 24px 24px 24px',
    boxSizing: 'border-box',
    width: 'calc(100% - 48px)',
    overflowX: 'auto'
  }
});

const DriverDetails = ({ id }) => {
  const classes = useStyles();
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Driver Details
      </Typography>
      <Paper square variant="outlined" style={{ display: 'flex', padding: '24px', marginBottom: '24px' }}>
        <Box style={{ flex: 1 }}>
          <Box mb={1}>
            <Typography variant="h4" gutterBottom>
              General Information
            </Typography>
            <Typography style={{ fontSize: '1.5rem' }} variant="body1">
              <strong>Full name: </strong>
              {driver.first_name} {driver.last_name}
            </Typography>
          </Box>
          <Box>
            <Typography style={{ fontSize: '1.5rem' }} variant="body1" gutterBottom>
              <strong>Date of birth:</strong> {driver.birth_date}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography variant="h4" gutterBottom>
              User Information
            </Typography>
            <Typography style={{ fontSize: '1.5rem' }} variant="body1">
              <strong>License number:</strong> {driver.license_number}
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography style={{ fontSize: '1.5rem' }} variant="body1">
              <strong>License class:</strong> {driver.license_class}
            </Typography>
          </Box>
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" gutterBottom>
            {' '}
            Contact Information
          </Typography>
          <Box mb={1}>
            <Typography>
              <strong>Email</strong>
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper square variant="outlined" sx={{ marginBottom: '24px' }} style={{ marginBottom: '24px' }}>
        <Box style={{ display: 'flex', padding: '24px', alignContent: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {' '}
            Recent Trips
          </Typography>
          <Button
            size="medium"
            variant="contained"
            color="inherit"
            square
            style={{ marginLeft: '24px', fontSize: '1.5rem' }}
          >
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
                  <StyledTableRow key={trip.id}>
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
                      <Checkbox checked={trip.completed} sx={{ color: 'blue', padding: '0' }} />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary" sx={{ marginTop: 2 }}>
            This driver has no trips.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DriverDetails;
