import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import SobrietyCounter from './components/SobrietyCounter';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initNotifications = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
  
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
  
        if (finalStatus !== 'granted') {
          alert('Nie udało się uzyskać zgody na wyświetlanie powiadomień. Upewnij się, że masz włączone powiadomienia w ustawieniach aplikacji.');
          return;
        }
      } else {
        alert('Aby korzystać z powiadomień, użyj prawdziwego urządzenia.');
      }
    };
  
    initNotifications();
  }, []);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Symulacja czasu ładowania, zmień wartość według potrzeb
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SobrietyCounter />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222831',
  },
});
