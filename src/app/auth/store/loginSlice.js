import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

export const submitLoginWithFireBase =
  ({ email, password }) =>
  async dispatch => {
    if (!firebaseService.auth) {
      console.warn("Firebase Service didn't initialize, check your configuration");

      return () => false;
    }
    return firebaseService.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        return dispatch(loginSuccess());
      })
      .catch(error => {
        const emailErrorCodes = [
          'auth/email-already-in-use',
          'auth/invalid-email',
          'auth/operation-not-allowed',
          'auth/user-not-found',
          'auth/user-disabled'
        ];
        const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];
        const response = [];

        if (emailErrorCodes.includes(error.code)) {
          response.push({
            type: 'email',
            message: error.message
          });
        }

        if (passwordErrorCodes.includes(error.code)) {
          response.push({
            type: 'password',
            message: error.message
          });
        }

        if (error.code === 'auth/invalid-api-key') {
          dispatch(showMessage({ message: error.message }));
        }

        return dispatch(loginError(response));
      });
  };

export const resetPassword = email => async dispatch => {
  if (!firebaseService.auth) {
    console.warn("Firebase Service didn't initialize, check your configuration");
    return () => false;
  }

  return firebaseService.auth
    .sendPasswordResetEmail(email)
    .then(() => {
      return dispatch(resetPasswordSuccess(`Reset link sent to ${email}`));
    })
    .catch(error => {
      return dispatch(resetPasswordError(error.message));
    });
};

const initialState = {
  success: false,
  message: null,
  errors: []
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    loginSuccess: state => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
    resetPasswordSuccess: (state, action) => {
      state.success = true;
      state.message = action.payload;
    },
    resetPasswordError: (state, action) => {
      state.success = false;
      state.message = action.payload;
    },
    clearMessage: state => {
      state.message = null;
      state.success = false;
    }
  }
});

export const { loginSuccess, loginError, resetPasswordSuccess, resetPasswordError, clearMessage } = loginSlice.actions;

export default loginSlice.reducer;
