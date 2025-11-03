import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducer';
import { useAppDispatch } from '@/hooks/redux';
import { loadArchivedGames } from '@/thunkActions/user';
import GamesList from './GamesList';

interface OwnProps {
  jwt: string;
}

export default function ArchivedGamesContainer({ jwt }: OwnProps) {
  const dispatch = useAppDispatch();
  const gamesList = useSelector((state: RootState) => state.archivedGames);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(loadArchivedGames(jwt));
  }, [dispatch, jwt]);

  return <GamesList gamesList={gamesList} user={user} category="archived" />;
}