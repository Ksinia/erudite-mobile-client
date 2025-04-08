import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';

import { backendUrl } from '@/runtime';
import { RootState } from '@/reducer';
import { User, Game } from '@/reducer/types';
import { errorFromServer } from '@/thunkActions/errorHandling';
import { addGameToSocket, enterLobby } from '@/reducer/outgoingMessages'; 
import Room from './Room';
import TranslationContainer from './Translation/TranslationContainer';

interface Props {
  gameId: number;
}

const RoomContainer: React.FC<Props> = ({ gameId }) => {
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.user);
  const lobby = useSelector((state: RootState) => state.lobby);
  const games = useSelector((state: RootState) => state.games);
  
  // Get the game from state - either from lobby or games reducer
  const game = games[gameId] || (Array.isArray(lobby) ? lobby.find(g => g.id === gameId) : null);
  
  // On component mount, subscribe to game updates
  useEffect(() => {
    // Subscribe to game updates via socket
    dispatch(addGameToSocket(gameId));
    
    // If we don't have the game data yet, fetch it
    if (!game) {
      fetchGame();
    } else {
      setLoading(false);
    }
    
    return () => {
      // We could unsubscribe here if needed
    };
  }, []);
  
  // When the game state changes in Redux, update our loading state
  // This is the key effect that responds to GAME_UPDATED socket messages
  useEffect(() => {
    if (game) {
      console.log('Game updated:', gameId, game);
      setLoading(false);
    }
  }, [games, lobby, gameId]);
  
  const fetchGame = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${backendUrl}/game/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${user.jwt}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The data will be processed by socket middleware
    } catch (error) {
      dispatch(errorFromServer(error, 'fetchGame'));
    } finally {
      setLoading(false);
    }
  };
  
  const onClickStart = async (): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/start/${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The game state will be updated through socket
      
      // Explicitly re-enter the lobby to refresh the games list
      // This ensures the lobby state is updated when we navigate back
      dispatch(enterLobby());
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
      const response = await fetch(`${backendUrl}/join/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The backend will emit GAME_UPDATED to the socket
      // Redux will automatically update the games state
      // Our useEffect hook above will react to this change
      
      // Explicitly re-enter the lobby to refresh the games list
      // This ensures the lobby state is updated when we navigate back
      dispatch(enterLobby());
    } catch (error) {
      dispatch(errorFromServer(error, 'onClickJoin'));
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