import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import BotManager from "@/components/BotManager";

export default function DebugScreen() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <BotManager />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
