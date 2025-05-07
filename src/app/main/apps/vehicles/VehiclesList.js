import { useHistory } from 'react-router';
import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Typography from '@material-ui/core/Typography';
import { GridCloseIcon } from '@material-ui/data-grid';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, Snackbar } from '@material-ui/core';
import VehiclesTable from './VehiclesTable';
import {
  // openEditContactDialog,
  openNewVehicleDialog,
  openEditVehicleDialog,
  selectVehicles,
  removeVehicle
} from './store/vehiclesSlice';

const formatData = vehicles =>
  vehicles.map(vehicle => {
    return {
      ...vehicle
    };
  });

function VehiclesList(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const vehicles = useSelector(selectVehicles);

  const searchText = useSelector(({ vehiclesApp }) => vehiclesApp.vehicles.searchText);

  const [filteredData, setFilteredData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = useCallback(
    async rowData => {
      try {
        const resultAction = await dispatch(removeVehicle(rowData.id));

        if (removeVehicle.rejected.match(resultAction)) {
          const errorMsg = resultAction.payload.error;
          setErrorMessage(errorMsg || 'Failed to delete vehicle. Please try again.');
          setSuccessMessage('');
          setOpenSnackbar(true);
        } else {
          setSuccessMessage('Vehicle successfully deleted.');
          setErrorMessage('');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setErrorMessage(error.message);
        setSuccessMessage('');
        setOpenSnackbar(true);
      }
    },
    [dispatch]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Active',
        accessor: 'active',
        className: 'font-medium',
        sortable: true,
        Cell: ({ row }) => {
          return row.original.active ? 'True' : 'False';
        }
      },
      {
        Header: 'Model',
        accessor: 'model',
        className: 'font-medium',
        sortable: true
      },
      {
        Header: 'Plate Number',
        accessor: 'plate_number',
        sortable: true
      },
      {
        Header: 'Engine number',
        accessor: 'engine_number',
        sortable: true
      },
      {
        Header: 'Year',
        accessor: row => row.manufacture_year?.split('T')[0],
        sortable: true
      },
      {
        Header: 'Issues',
        accessor: row => row.issues.length,
        sortable: true
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        sortable: true,
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => dispatch(openEditVehicleDialog(row.original))}
            >
              Edit
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => handleDelete(row.original)}
            >
              Delete
            </button>
          </div>
        )
      }
    ],
    [dispatch, handleDelete]
  );

  const handleEdit = rowData => {
    console.log('Edit clicked for row:', rowData);
    // Add logic to open a modal or navigate to an edit page
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return vehicles;
      }
      return FuseUtils.filterArrayByString(vehicles, _searchText);
    }

    if (vehicles) {
      setFilteredData(getFilteredArray(vehicles, searchText));
    }
  }, [vehicles, searchText]);

  const handleRowClick = (event, row) => {
    if (event.target.closest('button')) {
      return;
    }
    const vehicleId = row.original.id;
    history.push(`/apps/vehicles/${vehicleId}`);
  };

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no vehicles!
        </Typography>
      </div>
    );
  }

  const formattedData = formatData(filteredData);

  return (
    <>
      <Button style={{ width: 200, backgroundColor: 'grey' }} onClick={() => dispatch(openNewVehicleDialog())}>
        Add new
      </Button>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
        <VehiclesTable
          columns={columns}
          data={formattedData}
          onRowClick={handleRowClick}
          // onRowClick={(ev, row) => {
          //   if (row) {
          //     dispatch(openEditContactDialog(row.original));
          //   }
          // }}
        />
      </motion.div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={errorMessage || successMessage}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <GridCloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
}

export default VehiclesList;
