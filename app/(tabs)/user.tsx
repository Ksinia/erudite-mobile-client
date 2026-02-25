import React from 'react';
import { Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { Href, useRouter } from "expo-router";
import config from '@/config';

import { RootState } from "@/reducer";
import { logOutAndClearStorage } from "@/reducer/auth";
import TranslationContainer from '../../components/Translation/TranslationContainer';
import { useAppDispatch } from "@/hooks/redux";
import Collapsible from '../../components/Collapsible';
import FinishedGamesContainer from '../../components/FinishedGamesContainer';
import ArchivedGamesContainer from '../../components/ArchivedGamesContainer';
import ChangePassword from '@/components/ChangePassword';
import ChangeEmail from '@/components/ChangeEmail';
import DeleteAccount from '@/components/DeleteAccount';

export default function UserScreen() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logOutAndClearStorage());
    router.replace('/');
  };

  if (!user) {
    // Redirect to login if not logged in
    router.replace('/login');
    return null;
  }

  const jwt = user.jwt;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        <TranslationContainer translationKey="welcome" /> {user.name}!
      </Text>

      <Collapsible
        translationKeyExpand="expand_finished"
        translationKeyCollapse="collapse_finished"
        component={<FinishedGamesContainer jwt={jwt} />}
      />
      <Collapsible
        translationKeyExpand="expand_archived"
        translationKeyCollapse="collapse_archived"
        component={<ArchivedGamesContainer jwt={jwt} />}
      />
      <Collapsible
        translationKeyExpand="expand_change_email"
        translationKeyCollapse="collapse_change_email"
        component={<ChangeEmail />}
      />
      <Collapsible
        translationKeyExpand="expand_change_password"
        translationKeyCollapse="collapse_change_password"
        component={<ChangePassword />}
      />

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>
          <TranslationContainer translationKey="log_out" />
        </Text>
      </Pressable>

      <Collapsible
        translationKeyExpand="expand_delete_account"
        translationKeyCollapse="collapse_delete_account"
        component={<DeleteAccount />}
      />

      <Pressable onPress={() => Linking.openURL(`${config.webUrl}/terms`)}>
        <Text style={styles.privacyLink}>
          <TranslationContainer translationKey="terms_of_service" />
        </Text>
      </Pressable>

      <Pressable onPress={() => Linking.openURL(`${config.webUrl}/privacy`)}>
        <Text style={styles.privacyLink}>
          <TranslationContainer translationKey="privacy_policy" />
        </Text>
      </Pressable>

      {user.id === 1 && (
        <Pressable style={styles.debugButton} onPress={() => router.push('/debug' as Href)}>
          <Text style={styles.debugText}>Debug</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f0f0f0',
  },
  debugText: {
    fontSize: 14,
    color: '#999',
  },
  privacyLink: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});