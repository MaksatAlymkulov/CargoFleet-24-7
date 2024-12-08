import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjects } from '../store/projectsSlice';

function Widget1(props) {
  const getDashboardData = useSelector(selectProjects);
  const [currentRange, setCurrentRange] = useState('active');

  const vehiclesData = getDashboardData[1] || {};

  function handleChangeRange(ev) {
    setCurrentRange(ev.target.value);
  }

  const capitalize = input => {
    if (typeof input !== 'string' || input.length === 0) {
      return '';
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-start">
      <div className="flex items-center justify-between px-4 pt-8">
        <Select
          native
          className="mx-16"
          classes={{ root: 'py-8 font-medium opacity-75' }}
          value={currentRange}
          onChange={handleChangeRange}
          inputProps={{
            name: 'currentRange'
          }}
          disableUnderline
          variant="standard"
        >
          {Object.keys(vehiclesData)
            .filter(key => key !== 'id' && key !== 'assigned' && key !== 'unassigned')
            .map(key => {
              return (
                <option key={key} value={key}>
                  {capitalize(key)}
                </option>
              );
            })}
        </Select>
        {/* <IconButton aria-label="more">
          <Icon>more_vert</Icon>
        </IconButton> */}
      </div>
      <div className="text-center py-12">
        <Typography className="text-18 text-blue-800 font-normal mb-8">
          {props.widget?.data?.name || 'Vehicles Status'}
        </Typography>
        <Typography className="text-72 font-semibold leading-none text-blue tracking-tighter">
          {vehiclesData[currentRange] || 0}
        </Typography>
      </div>
      {/* <Typography className="p-20 pt-0 h-56 flex justify-center items-end text-13 font-medium" color="textSecondary">
        <span className="truncate">{props.widget.data.extra.name}</span>:
        <b className="px-8">{props.widget.data.extra.count[currentRange]}</b>
      </Typography> */}
    </Paper>
  );
}

export default memo(Widget1);
