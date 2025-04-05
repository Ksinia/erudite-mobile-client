import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import { loginSignupFunction } from '../thunkActions/authorization';
import { RootState } from '../reducer';
import { clearError } from '../reducer/error';
import LoginSignup from './LoginSignup';

const SignupContainer: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    password: '',
    email: '',
  });
  
  const router = useRouter();
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.error);
  
  const handleChange = (name: string, value: string): void => {
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (): void => {
    dispatch(
      loginSignupFunction(
        'signup',
        formState.name,
        formState.password,
        router,
        formState.email
      )
    );
  };

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <LoginSignup
      onChange={handleChange}
      onSubmit={handleSubmit}
      values={formState}
      error={error}
      isSignUp={true}
    />
  );
};

export default SignupContainer;