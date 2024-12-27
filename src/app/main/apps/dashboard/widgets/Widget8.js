import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { memo } from 'react';
import ReactApexChart from 'react-apexcharts';
import _ from '@lodash';
import { useSelector } from 'react-redux';
import { selectProjects } from '../store/projectsSlice';

function Widget8(props) {
  const widget = _.merge({}, props.widget);
  const theme = useTheme();
  const dashboardData = useSelector(selectProjects);

  const issuesByPriority = dashboardData[2] || {};

  const completeIssuesByPriority =
    issuesByPriority.completed_by_priority && issuesByPriority.completed_by_priority.every(value => value === 0)
      ? [15, 16, 15]
      : issuesByPriority.completed_by_priority || [15, 16, 15];

  widget.mainChart.series = completeIssuesByPriority;
  widget.mainChart.options.labels = ['Low Priority', 'Medium Priority', 'High Priority'];
  widget.title = 'Completed issues by priority';

  _.setWith(widget, 'mainChart.options.theme.monochrome.color', theme.palette.primary.main);

  return (
    <Paper className="w-full rounded-20 shadow">
      <div className="flex items-center justify-between p-20 h-64">
        <Typography className="text-16 font-medium">{widget.title}</Typography>
      </div>
      <div className="h-420 w-full">
        <ReactApexChart
          options={widget.mainChart.options}
          series={widget.mainChart.series}
          type={widget.mainChart.options.chart.type}
          height={widget.mainChart.options.chart.height}
        />
      </div>
    </Paper>
  );
}

export default memo(Widget8);
