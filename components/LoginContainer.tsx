import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { loginSignupFunction } from '../thunkActions/authorization';
import { RootState } from '../reducer';
import { clearError } from '../reducer/error';
import LoginSignup from './LoginSignup';
import { useAppDispatch } from "@/hooks/redux";

const LoginContainer: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    password: '',
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const error = useSelector((state: RootState) => state.error);

  useFocusEffect(
    useCallback(() => {
      setFormState({ name: '', password: '' });
      dispatch(clearError());
    }, [dispatch])
  );

  const handleChange = (name: string, value: string): void => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (): void => {
    dispatch(
      loginSignupFunction(
        'login',
        formState.name,
        formState.password,
        router
      )
    );

    setFormState({
      name: formState.name,
      password: '',
    });
  };

  return (
    <LoginSignup
      onChange={handleChange}
      onSubmit={handleSubmit}
      values={formState}
      error={error}
      isSignUp={false}
    />
  );
};

export default LoginContainer;