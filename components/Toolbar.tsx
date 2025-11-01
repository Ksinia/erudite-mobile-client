import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Href, useRouter } from "expo-router";
import { useSelector } from 'react-redux';

import { logOutAndClearStorage } from "@/reducer/auth";
import { RootState } from "@/reducer";
import { enterLobby } from "@/reducer/outgoingMessages";
import TranslationContainer from './Translation/TranslationContainer';
import LangSwitchContainer from "@/components/LangSwitchContainer";
import { useAppDispatch } from "@/hooks/redux";

const Toolbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logOutAndClearStorage());
    router.replace('/');
  };

  const navigateTo = (path: Href<string>) => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.navItem}>
          <LangSwitchContainer/>
        </View>

        <Pressable style={styles.navItem} onPress={() => navigateTo('/rules')}>
          <Text style={styles.navText}>
            <TranslationContainer translationKey="toolbar_rules" />
          </Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => {
            // Update lobby data when navigating to lobby
            dispatch(enterLobby());
            navigateTo('/');
          }}
        >
          <Text style={styles.navText}>
            <TranslationContainer translationKey="toolbar_list" />
          </Text>
        </Pressable>

        {!user ? (
          <>
            <Pressable style={styles.navItem} onPress={() => navigateTo('/signup')}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="sign_up" />
              </Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => navigateTo('/login')}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="log_in" />
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={styles.navItem} onPress={() => navigateTo('/user')}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="welcome" /> {user.name}!
              </Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={handleLogout}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="log_out" />
              </Text>
            </Pressable>
          </>
        )}

        {user?.id === 1 && (
          <Pressable style={styles.navItem} onPress={() => navigateTo('/debug')}>
            <Text style={styles.navText}>
              Debug
            </Text>
          </Pressable>
        )}
      </ScrollView>
      <View style={styles.borderBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    height: 30,
    justifyContent: 'space-between',
  },
  navItem: {
    paddingHorizontal: 5,
    justifyContent: 'center',
    height: '100%',
  },
  navText: {
    fontSize: 12, // Reduced from 14
    color: '#333',
  },
  activeNavText: {
    fontWeight: 'bold',
  },
  borderBottom: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
  },
});

export default Toolbar;