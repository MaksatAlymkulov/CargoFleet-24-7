import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectProjects } from '../store/projectsSlice';

function Widget3(props) {
  const getDashboardData = useSelector(selectProjects);
  const { id, open, overdue } = getDashboardData[2] || {};

  const capitalize = input => {
    if (typeof input !== 'string' || input.length === 0) {
      return '';
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 pt-8">
        <Typography className="text-16 px-16 font-medium" color="textSecondary">
          {capitalize(id)}
        </Typography>
      </div>
      <div className="text-center py-12">
        <Typography className="text-18 text-blue-800 font-normal mb-8">Issues</Typography>
        <Typography className="text-72 font-semibold leading-none text-orange tracking-tighter my-11">
          {open}
        </Typography>
        <Typography className="text-18 font-normal text-orange-800">{props.widget.data.name}</Typography>
      </div>
      <Typography className="p-20 pt-0 h-56 flex justify-center items-end text-13 font-medium" color="textSecondary">
        <span className="truncate">{props.widget.data.extra.name}</span>:<b className="px-8">{overdue}</b>
      </Typography>
    </Paper>
  );
}

export default memo(Widget3);
