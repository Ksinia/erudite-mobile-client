import React from 'react';
import { Text, ScrollView } from "react-native";
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import config from "@/config";
import * as Application from 'expo-application';
import TestNotifications from "@/components/TestNotifications";
import BotManager from "@/components/BotManager";

export default function DebugScreen() {

  return (
    <ScrollView>
      <Text>
        process.env.EXPO_PUBLIC_ENV: {process.env.EXPO_PUBLIC_ENV}
      </Text>
      <Text>
        process.env.EXPO_PUBLIC_ENVIRONMENT: {process.env.EXPO_PUBLIC_ENVIRONMENT}
      </Text>
      <Text>
        process.env.APP_VARIANT: {process.env.APP_VARIANT}
      </Text>
      <Text>
        Updates.channel: {Updates.channel}
      </Text>
      <Text>
        Constants.expoConfig?.ios?.entitlements?.['aps-environment']: {JSON.stringify(Constants.expoConfig?.ios?.entitlements?.['aps-environment'], null, 2)}
      </Text>
      <Text>
        Constants.expoConfig.ios?.buildNumber: {Constants.expoConfig?.ios?.buildNumber}
      </Text>
      <Text>Application.nativeBuildVersion: {Application.nativeBuildVersion}</Text>
      <Text>process.env.NODE_ENV: {process.env.NODE_ENV}</Text>
      <Text>process.env.EXPO_PUBLIC_BACKEND_URL: {process.env.EXPO_PUBLIC_BACKEND_URL}</Text>
      <Text>config.backendUrl: {config.backendUrl}</Text>
      <TestNotifications />
      <BotManager />
    </ScrollView>
  );
}
