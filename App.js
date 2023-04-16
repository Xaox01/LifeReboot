import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView } from 'react-native';
import SobrietyCounter from './components/SobrietyCounter';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme, Drawer as PaperDrawer, Text } from 'react-native-paper';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SobrietyCounter />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text onPress={() => navigation.goBack()}>Go back home</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function AppContent() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Strona główna" component={HomeScreen} />
      <Drawer.Screen name="Twoje osiągniecia" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}

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
    <PaperProvider theme={DefaultTheme}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <AppContent />
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
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
