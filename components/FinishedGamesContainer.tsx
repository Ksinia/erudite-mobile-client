import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from 'expo-router';
import { RootState } from '@/reducer';
import { useAppDispatch } from '@/hooks/redux';
import { loadFinishGames } from '@/thunkActions/user';
import GamesList from './GamesList';

interface OwnProps {
  jwt: string;
}

export default function FinishedGamesContainer({ jwt }: OwnProps) {
  const dispatch = useAppDispatch();
  const gamesList = useSelector((state: RootState) => state.finishedGames);
  const user = useSelector((state: RootState) => state.user);

  useFocusEffect(
    useCallback(() => {
      dispatch(loadFinishGames(jwt));
    }, [dispatch, jwt])
  );

  return <GamesList gamesList={gamesList} user={user} category="finished" />;
}