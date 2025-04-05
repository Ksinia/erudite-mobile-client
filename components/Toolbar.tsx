import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import { logOut } from '../reducer/auth';
import { RootState } from '../reducer';
import { User } from '../reducer/types';
// import LangSwitchContainer from './LangSwitch/LangSwitchContainer';
import TranslationContainer from './Translation/TranslationContainer';

const Toolbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logOut());
    router.replace('/');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.toolbar}>
        <View style={styles.leftSection}>
          <Text>temp</Text>
          {/*<LangSwitchContainer />*/}
        </View>

        <View style={styles.navLinks}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigateTo('/rules')}
          >
            <Text style={styles.navText}>
              <TranslationContainer translationKey="toolbar_rules" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigateTo('/')}
          >
            <Text style={styles.navText}>
              <TranslationContainer translationKey="toolbar_list" />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          {!user ? (
            <>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigateTo('/signup')}
              >
                <Text style={styles.navText}>
                  <TranslationContainer translationKey="sign_up" />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigateTo('/login')}
              >
                <Text style={styles.navText}>
                  <TranslationContainer translationKey="log_in" />
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigateTo('/user')}
              >
                <Text style={styles.navText}>
                  <TranslationContainer translationKey="welcome" /> {user.name}!
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={handleLogout}
              >
                <Text style={[styles.navText, styles.logoutText]}>
                  <TranslationContainer translationKey="log_out" />
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#3498db', // You can adjust this to match your app's theme
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
    zIndex: 1000,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  navText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutText: {
    color: '#ff6b6b',
  }
});

export default Toolbar;