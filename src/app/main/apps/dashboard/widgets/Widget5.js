import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import { memo, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { selectProjects } from '../store/projectsSlice';

function Widget5(props) {
  const dashboardData = useSelector(selectProjects);
  const theme = useTheme();
  const [awaitRender, setAwaitRender] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const widget = _.merge({}, props.widget);
  
  const currentRange = Object.keys(widget.ranges)[tabValue];

  _.setWith(widget, 'mainChart.options.colors', [theme.palette.primary.main, theme.palette.secondary.main]);
  const tripsData = dashboardData[3] || {};

  useEffect(() => {
    setAwaitRender(false);
    if (!tripsData?.monthly_completed?.length) {
      console.error('No data found in trips.monthly_completed');
    }
  }, []);

  if (awaitRender) {
    return null;
  }

  const monthlyCompletedData = tripsData?.monthly_completed || [];
  widget.mainChart[currentRange].series = [
    {
      name: 'Trips Completed',
      data: monthlyCompletedData
    }
  ];

  return (
    <Paper className="w-full rounded-20 shadow">
      <div className="flex items-center justify-between p-20">
        <Typography className="text-16 font-medium">Completed Trips Over the Past 12 Months</Typography>
        <Tabs
          value={tabValue}
          onChange={(ev, value) => setTabValue(value)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="off"
          className="-mx-4 min-h-40"
          classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
          TabIndicatorProps={{
            children: <Divider className="w-full h-full rounded-full opacity-50" />
          }}
        >
          <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4" disableRipple label="Trips" />
        </Tabs>
      </div>
      <div className="w-full p-16 min-h-420 h-420">
        <ReactApexChart
          options={widget.mainChart.options}
          series={widget.mainChart[currentRange].series}
          type={widget.mainChart.options.chart.type}
          height={widget.mainChart.options.chart.height}
        />
      </div>
    </Paper>
  );
}

export default memo(Widget5);
