import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import DriverDialog from './DriverDialog';
import DriversHeader from './DriversHeader';
import DriversList from './DriversList';
import reducer from './store';
import { getDriver, getDrivers } from './store/driversSlice';
import DriverDetails from './DriverDetails';

function DriversApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const { id } = routeParams;

  useDeepCompareEffect(() => {
    dispatch(getDrivers(routeParams));
    dispatch(getDriver(id));
  }, [dispatch, routeParams, id]);

  return (
    <>
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 sm:p-24 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
          wrapper: 'min-h-0'
        }}
        header={<DriversHeader pageLayout={pageLayout} />}
        content={id === 'all' ? <DriversList /> : <DriverDetails id={id} />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <DriverDialog />
    </>
  );
}

export default withReducer('driversApp', reducer)(DriversApp);
