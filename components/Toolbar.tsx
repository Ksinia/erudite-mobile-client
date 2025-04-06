import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import { logOutAndClearStorage } from "@/reducer/auth";
import { RootState } from "@/reducer";
import TranslationContainer from './Translation/TranslationContainer';
import LangSwitchContainer from "@/components/LangSwitchContainer";

const Toolbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logOutAndClearStorage());
    router.replace('/');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.navItem}>
          <LangSwitchContainer/>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('/rules')}>
          <Text style={styles.navText}>
            <TranslationContainer translationKey="toolbar_rules" />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('/')}>
          <Text style={styles.navText}>
            <TranslationContainer translationKey="toolbar_list" />
          </Text>
        </TouchableOpacity>

        {!user ? (
          <>
            <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('/signup')}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="sign_up" />
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('/login')}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="log_in" />
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('/user')}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="welcome" /> {user.name}!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
              <Text style={styles.navText}>
                <TranslationContainer translationKey="log_out" />
              </Text>
            </TouchableOpacity>
          </>
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