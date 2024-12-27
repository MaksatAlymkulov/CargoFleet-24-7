import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '../store/widgetsSlice';

function WidgetWeather(props) {
  const dispatch = useDispatch();
  const weatherData = useSelector(state => state.projectDashboardApp.widgets.additionalWeather);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchWeatherData({ latitude, longitude }));
        },
        error => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [dispatch]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  console.log(weatherData);

  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 pt-8">
        <div className="flex items-center px-16">
          <Icon color="action">location_on</Icon>
          <Typography className="text-16 mx-8 font-medium" color="textSecondary">
            {weatherData.name}
          </Typography>
        </div>
        {/* <IconButton aria-label="more">
          <Icon>more_vert</Icon>
        </IconButton> */}
      </div>
      <div className="flex items-center justify-center p-20 pb-32">
        <Icon className="meteocons text-40 ltr:mr-8 rtl:ml-8" color="action">
          weather
        </Icon>
        <Typography className="text-44 mx-8 font-medium tracking-tighter" color="textSecondary">
          {Math.round(weatherData.main.temp)}
        </Typography>
        <Typography className="text-48" color="textSecondary">
          °
        </Typography>
        <Typography className="text-44" color="textSecondary">
          C
        </Typography>
      </div>

      <Divider />

      <div className="flex justify-between items-center p-16">
        <div className="flex items-center">
          <Icon className="meteocons text-14" color="action">
            windy
          </Icon>
          <Typography className="mx-4 font-semibold"> {weatherData.wind.speed} m/s</Typography>
        </div>

        <div className="flex items-center">
          <Icon className="meteocons text-14" color="action">
            compass
          </Icon>
          <Typography className="mx-4 font-semibold"> {weatherData.wind.deg}°</Typography>
        </div>

        <div className="flex items-center">
          <Icon className="meteocons text-14" color="action">
            water_drop
          </Icon>
          <Typography className="mx-4 font-semibold">{weatherData.main.humidity}%</Typography>
        </div>
      </div>
    </Paper>
  );
}

export default memo(WidgetWeather);
