import React, { useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { backendUrl } from '@/runtime';
import { RootState } from '@/reducer';
import { errorFromServer } from '@/thunkActions/errorHandling';
import { useAppDispatch } from '@/hooks/redux';
import Room from './Room';
import TranslationContainer from './Translation/TranslationContainer';
import { Game } from "@/reducer/types";

interface Props {
  game: Game;
}

const RoomContainer: React.FC<Props> = ({ game }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const onClickStart = async (): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/start/${game.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      dispatch(errorFromServer(error, 'onClickStart'));
    } finally {
      setLoading(false);
    }
  };
  
  const onClickJoin = async (): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/join/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      dispatch(errorFromServer(error, 'onClickJoin'));
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={{ marginTop: 10 }}>
          <TranslationContainer translationKey="loading" />
        </Text>
      </View>
    );
  }
  
  if (!game) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          <TranslationContainer translationKey="game_not_found" />
        </Text>
      </View>
    );
  }
  
  return <Room room={game} user={user} onClickStart={onClickStart} onClickJoin={onClickJoin} />;
};

export default RoomContainer;