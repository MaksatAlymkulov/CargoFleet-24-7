import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Typography from '@material-ui/core/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import DriversTable from './DriversTable';
import { openNewDriverDialog, openEditDriverDialog, selectDrivers, removeDriver } from './store/driversSlice';

const formatData = drivers =>
  drivers.map(driver => {
    return {
      ...driver
    };
  });

function DriversList(props) {
  const dispatch = useDispatch();
  const drivers = useSelector(selectDrivers);

  const searchText = useSelector(({ driversApp }) => driversApp.drivers.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
        className: 'font-medium ',
        sortable: true
      },
      {
        Header: 'Name',
        accessor: 'first_name',
        sortable: true
      },
      {
        Header: 'Phone Number',
        accessor: 'phone_number',
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
              onClick={() => dispatch(openEditDriverDialog(row.original))}
            >
              Edit
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => dispatch(removeDriver(row.original.id))}
            >
              Delete
            </button>
          </div>
        )
      }
    ],
    [dispatch, drivers]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return drivers;
      }
      return FuseUtils.filterArrayByString(drivers, _searchText);
    }

    if (drivers) {
      setFilteredData(getFilteredArray(drivers, searchText));
    }
  }, [drivers, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no drivers!
        </Typography>
      </div>
    );
  }

  const formattedData = formatData(filteredData);

  return (
    <>
      <Button style={{ width: 200, backgroundColor: 'grey' }} onClick={() => dispatch(openNewDriverDialog())}>
        Add new
      </Button>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
        <DriversTable columns={columns} data={formattedData} />
      </motion.div>
    </>
  );
}

export default DriversList;
