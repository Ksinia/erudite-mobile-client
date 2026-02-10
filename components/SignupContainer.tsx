import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { loginSignupFunction } from "@/thunkActions/authorization";
import { RootState } from "@/reducer";
import { clearError } from "@/reducer/error";
import LoginSignup from './LoginSignup';
import { useAppDispatch } from "@/hooks/redux";

const SignupContainer: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    password: '',
    email: '',
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const error = useSelector((state: RootState) => state.error);

  useFocusEffect(
    useCallback(() => {
      setFormState({ name: '', password: '', email: '' });
      dispatch(clearError());
    }, [dispatch])
  );

  const handleChange = (name: string, value: string): void => {
    setFormState(prev => ({ ...prev, [name]: value }));
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

    setFormState({
      name: formState.name,
      email: formState.email,
      password: '',
    });
  };

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