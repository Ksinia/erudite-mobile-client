import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface Bot {
  name: string;
  activeGames: number;
  maxGames: number;
}

export default function BotManager() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:3001');
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState('');
  const [botPassword, setBotPassword] = useState('');
  const [botMaxGames, setBotMaxGames] = useState('5');
  const [gameId, setGameId] = useState('');
  const [selectedBot, setSelectedBot] = useState('');
  const [word, setWord] = useState('');

  const api = useCallback(
    async (method: string, path: string, body?: object) => {
      const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res.status === 204) return null;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    },
    [baseUrl],
  );

  const refreshBots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api('GET', '/bots');
      setBots(data);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  }, [api]);

  const addBot = async () => {
    if (!botName || !botPassword) {
      Alert.alert('Error', 'Name and password are required');
      return;
    }
    setLoading(true);
    try {
      await api('POST', '/bots', {
        name: botName,
        password: botPassword,
        maxGames: parseInt(botMaxGames, 10) || 5,
      });
      setBotName('');
      setBotPassword('');
      await refreshBots();
    } catch (err: any) {
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };

  const removeBot = async (name: string) => {
    setLoading(true);
    try {
      await api('DELETE', `/bots/${name}`);
      await refreshBots();
    } catch (err: any) {
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };

  const joinGame = async () => {
    if (!selectedBot || !gameId) {
      Alert.alert('Error', 'Select a bot and enter game ID');
      return;
    }
    try {
      await api('POST', `/bots/${selectedBot}/join/${gameId}`);
      Alert.alert('OK', `${selectedBot} joined game ${gameId}`);
      await refreshBots();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const triggerTurn = async () => {
    if (!selectedBot || !gameId) {
      Alert.alert('Error', 'Select a bot and enter game ID');
      return;
    }
    try {
      await api('POST', `/bots/${selectedBot}/turn/${gameId}`);
      Alert.alert('OK', `${selectedBot} triggered turn in game ${gameId}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const addWord = async () => {
    if (!word.trim()) return;
    try {
      await api('POST', '/words', { word: word.trim() });
      Alert.alert('OK', `Added: ${word.trim()}`);
      setWord('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const removeWord = async () => {
    if (!word.trim()) return;
    try {
      await api('DELETE', `/words/${word.trim()}`);
      Alert.alert('OK', `Removed: ${word.trim()}`);
      setWord('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bot Manager</Text>

      <Text style={styles.label}>Bot Service URL</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={baseUrl}
          onChangeText={setBaseUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.smallButton} onPress={refreshBots}>
          <Text style={styles.buttonText}>{loading ? '...' : 'Refresh'}</Text>
        </TouchableOpacity>
      </View>

      {bots.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Active Bots</Text>
          {bots.map((bot) => (
            <View key={bot.name} style={styles.botRow}>
              <TouchableOpacity
                style={[styles.botName, selectedBot === bot.name && styles.botNameSelected]}
                onPress={() => setSelectedBot(bot.name)}
              >
                <Text style={selectedBot === bot.name ? styles.botNameTextSelected : undefined}>
                  {bot.name} ({bot.activeGames}/{bot.maxGames} games)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeBot(bot.name)}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Add Bot</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={botName}
          onChangeText={setBotName}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={botPassword}
          onChangeText={setBotPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Max games"
            value={botMaxGames}
            onChangeText={setBotMaxGames}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.smallButton} onPress={addBot}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Game Actions {selectedBot ? `(${selectedBot})` : ''}</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Game ID"
            value={gameId}
            onChangeText={setGameId}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.smallButton} onPress={joinGame}>
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallButton, styles.orangeButton]} onPress={triggerTurn}>
            <Text style={styles.buttonText}>Turn</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Dictionary</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Word"
            value={word}
            onChangeText={setWord}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.smallButton} onPress={addWord}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallButton, styles.redButton]} onPress={removeWord}>
            <Text style={styles.buttonText}>Del</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f0f4f8',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  section: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  smallButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  orangeButton: {
    backgroundColor: '#FF9500',
  },
  redButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  botName: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  botNameSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e8f0fe',
  },
  botNameTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
