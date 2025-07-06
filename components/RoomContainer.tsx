import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { backendUrl } from '@/runtime';
import { RootState } from '@/reducer';
import { errorFromServer } from '@/thunkActions/errorHandling';
import { addGameToSocket, enterLobby } from "@/reducer/outgoingMessages";
import { fetchGame } from '@/thunkActions/game';
import { useAppDispatch } from '@/hooks/redux';
import Room from './Room';
import TranslationContainer from './Translation/TranslationContainer';

interface Props {
  gameId: number;
}

const RoomContainer: React.FC<Props> = ({ gameId }) => {
  const [loading, setLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  
  const user = useSelector((state: RootState) => state.user);
  const lobby = useSelector((state: RootState) => state.lobby);
  const games = useSelector((state: RootState) => state.games);
  const socketConnectionState = useSelector((state: RootState) => state.socketConnectionState);

  // Get the game from state - either from lobby or games reducer
  const game = games[gameId] || (Array.isArray(lobby) ? lobby.find(g => g.id === gameId) : null);
  
  // Fetch game data when component mounts or gameId changes
  useEffect(() => {
    console.log("useEffect in game");
    if (socketConnectionState && gameId) {
      console.log("fetching game and adding game to socket");
      dispatch(fetchGame(gameId, user?.jwt ?? null));
      dispatch(addGameToSocket(gameId));
    }
  }, [gameId, user?.jwt, dispatch, socketConnectionState]);

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
      // Make sure this game is being monitored via socket
      dispatch(addGameToSocket(gameId));
      
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
      // Make sure this game is being monitored via socket
      dispatch(addGameToSocket(gameId));
      
      // Explicitly re-enter the lobby to refresh the games list
      // This ensures the lobby state is updated when we navigate back
      dispatch(enterLobby());
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