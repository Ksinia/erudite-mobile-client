import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from "@/reducer";
import { Game as GameType } from '../reducer/types';
import { errorFromServer } from "@/thunkActions/errorHandling";
import { enterLobby } from "@/reducer/outgoingMessages";
import Lobby from './Lobby';
import TranslationContainer from './Translation/TranslationContainer';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppDispatch } from "@/hooks/redux";
import config from "@/config"

const backendUrl = config.backendUrl;

// Convert interface locale (e.g., 'ru_RU') to game language (e.g., 'ru')
const localeToGameLanguage = (locale: string): string => {
  return locale.startsWith('ru') ? 'ru' : 'en';
};

const LobbyContainer: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const lobby = useSelector((state: RootState) => state.lobby);
  const user = useSelector((state: RootState) => state.user);
  const socketConnectionState = useSelector((state: RootState) => state.socketConnectionState);
  const interfaceLocale = useSelector((state: RootState) => state.translation.locale);

  // Default game language from interface language
  const defaultGameLanguage = localeToGameLanguage(interfaceLocale);

  const [formState, setFormState] = useState<{
    maxPlayers: number;
    language: string;
    sendingFormEnabled: boolean;
  }>({
    maxPlayers: 2,
    language: defaultGameLanguage,
    sendingFormEnabled: true,
  });
  
  const handleChange = (name: string, value: string): void => {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
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
      } finally {
        // Re-enable the form
        setFormState(prev => ({ ...prev, sendingFormEnabled: true }));
      }
    }
  };
  
  // Initialize component
  useEffect(() => {
    // Load stored language preference, or use interface language as default
    AsyncStorage.getItem('language').then(storedLanguage => {
      if (storedLanguage) {
        setFormState(prev => ({ ...prev, language: storedLanguage }));
      }
      // If no stored preference, defaultGameLanguage is already set from interface locale
    }).catch(error => {
      console.error('Error getting language from AsyncStorage:', error);
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