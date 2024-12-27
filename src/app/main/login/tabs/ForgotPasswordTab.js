import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import TextField from '@material-ui/core/TextField';
import { clearMessage, resetPassword } from 'app/auth/store/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter an email address')
});

function ForgotPasswordTab(props) {
  const dispatch = useDispatch();
  const message = useSelector(state => state.auth.login.message);
  const success = useSelector(state => state.auth.login.success);

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: { email: '' },
    resolver: yupResolver(schema)
  });

  const { isValid, dirtyFields, errors } = formState;

  const onForgotPassword = ({ email }) => {
    dispatch(resetPassword(email));
    reset();
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [message, dispatch]);

  return (
    <div className="w-full">
      <form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onForgotPassword)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              type="text"
              label="Email"
              error={!!errors.email}
              helperText={errors?.email?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      email
                    </Icon>
                  </InputAdornment>
                )
              }}
              variant="outlined"
              required
            />
          )}
        />
        {message && (
          <div
            style={{
              color: success ? 'green' : 'red',
              marginBottom: '16px'
            }}
          >
            {message}
          </div>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16"
          aria-label="RESET PASSWORD"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          value="firebase"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordTab;
