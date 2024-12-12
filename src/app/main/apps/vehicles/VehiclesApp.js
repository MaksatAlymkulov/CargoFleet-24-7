import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import VehicleDialog from './VehicleDialog';
import VehiclesHeader from './VehiclesHeader';
import VehiclesList from './VehiclesList';
// import VehiclesSidebarContent from './VehiclesSidebarContent';
import reducer from './store';
import { getVehicle, getVehicles } from './store/vehiclesSlice';
import VehicleDetails from './VehicleDetails';
// import { getUserData } from './store/userSlice';

function VehiclesApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const { id } = routeParams;

  useDeepCompareEffect(() => {
    dispatch(getVehicles(routeParams));
    dispatch(getVehicle(id));
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
        header={<VehiclesHeader pageLayout={pageLayout} />}
        content={id === 'all' ? <VehiclesList /> : <VehicleDetails id={id} />}
        // leftSidebarContent={<VehiclesSidebarContent />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <VehicleDialog />
    </>
  );
}

export default withReducer('vehiclesApp', reducer)(VehiclesApp);
