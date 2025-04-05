import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { backendUrl } from '../runtime';
import { RootState } from '../reducer';
import { Game as GameType, User } from '../reducer/types';
import { errorFromServer } from '../thunkActions/errorHandling';
import { enterLobby } from '../reducer/outgoingMessages';
import Lobby from './Lobby';
import TranslationContainer from './Translation/TranslationContainer';
import { View, Text, ActivityIndicator } from 'react-native';

const LobbyContainer: React.FC = () => {
  const [formState, setFormState] = useState({
    maxPlayers: 2,
    language: 'en',
    sendingFormEnabled: true,
  });
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const lobby = useSelector((state: RootState) => state.lobby);
  const user = useSelector((state: RootState) => state.user);
  const socketConnectionState = useSelector((state: RootState) => state.socketConnectionState);
  
  // Get preferred language (similar to the web version)
  const getLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage) {
        return storedLanguage;
      }
    } catch (error) {
      console.error('Error getting language from AsyncStorage:', error);
    }
    
    // Default language based on device locale
    // This is a simplified version of the web implementation
    return 'en';
  };
  
  // Handle form field changes
  const handleChange = (name: string, value: any): void => {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (): Promise<void> => {
    if (formState.sendingFormEnabled && user) {
      setFormState(prev => ({ ...prev, sendingFormEnabled: false }));
      
      try {
        const response = await fetch(`${backendUrl}/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.jwt}`,
          },
          body: JSON.stringify({
            maxPlayers: formState.maxPlayers,
            language: formState.language,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Save language preference
        await AsyncStorage.setItem('language', formState.language);
        
        // Navigate to game
        router.push(`/game/${data.id}`);
      } catch (error) {
        dispatch(errorFromServer(error, 'create game onSubmit'));
        // Re-enable the form
        setFormState(prev => ({ ...prev, sendingFormEnabled: true }));
      }
    }
  };
  
  // Initialize component
  useEffect(() => {
    // Initialize language
    getLanguage().then(lang => {
      setFormState(prev => ({ ...prev, language: lang || 'en' }));
    });
    
    // Enter lobby via socket
    dispatch(enterLobby());
  }, [dispatch]);
  
  // Re-enter lobby if socket reconnects
  useEffect(() => {
    if (socketConnectionState) {
      dispatch(enterLobby());
    }
  }, [socketConnectionState, dispatch]);
  
  // Process games for the lobby view
  const processGames = () => {
    if (!Array.isArray(lobby)) return null;
    console.log('lobby', lobby);
    return lobby.reduce(
      (allGames: { [key: string]: GameType[] }, game) => {
        if (
          user &&
          game.users.find((u) => u.id === user.id) &&
          (game.phase === 'turn' || game.phase === 'validation')
        ) {
          if (user.id === game.activeUserId) {
            allGames.userTurn.push(game);
          } else {
            allGames.otherTurn.push(game);
          }
        } else if (
          user &&
          (game.phase === 'waiting' || game.phase === 'ready') &&
          game.users.find((u) => u.id === user?.id)
        ) {
          allGames.userWaiting.push(game);
        } else if (game.phase === 'waiting') {
          allGames.otherWaiting.push(game);
        } else {
          allGames.other.push(game);
        }
        return allGames;
      },
      {
        userTurn: [],
        otherTurn: [],
        userWaiting: [],
        otherWaiting: [],
        other: [],
      }
    );
  };
  
  const games = processGames();
  
  if (!Array.isArray(lobby) || !games) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={{ marginTop: 10 }}>
          <TranslationContainer translationKey="loading" />
        </Text>
      </View>
    );
  }
  
  return (
    <Lobby
      onChange={handleChange}
      onSubmit={handleSubmit}
      values={{
        maxPlayers: formState.maxPlayers,
        language: formState.language,
      }}
      userTurnGames={games.userTurn}
      otherTurnGames={games.otherTurn}
      userWaitingGames={games.userWaiting}
      otherWaitingGames={games.otherWaiting}
      otherGames={games.other}
      user={user}
      sendingFormEnabled={formState.sendingFormEnabled}
    />
  );
};

export default LobbyContainer;