import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const motivationalQuotes = [
  // Dodaj swoje motywacyjne cytaty
];

const getRandomQuote = () => {
  const index = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[index];
};

const SobrietyCounter = () => {
  const [sobrietyDate, setSobrietyDate] = useState(null);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [intervalId, setIntervalId] = useState(null);
  const [resetCounter, setResetCounter] = useState(0);
  const [quote, setQuote] = useState(getRandomQuote());
  const [refreshing, setRefreshing] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Start');
  const [sentNotification, setSentNotification] = useState(false);

  useEffect(() => {
    const getSobrietyDate = async () => {
      try {
        const storedSobrietyDate = await AsyncStorage.getItem('sobrietyDate');
        if (storedSobrietyDate) {
          setSobrietyDate(new Date(JSON.parse(storedSobrietyDate)));
          setButtonLabel('Stop');
        }
      } catch (error) {
        console.error('Error while getting sobriety date:', error);
      }
    };
    getSobrietyDate();
  }, [resetCounter]);

  useEffect(() => {
    if (sobrietyDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - sobrietyDate) / 1000);
        const days = Math.floor(diffInSeconds / 86400);
        const hours = Math.floor((diffInSeconds % 86400) / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        setTime({ days, hours, minutes, seconds });

        if (days === 0 && hours === 0 && minutes === 0 && seconds >= 10 && !sentNotification) {
          setSentNotification(true);
          sendNotification();
        }
      }, 1000);

      setIntervalId(interval);
    } else {
      setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [sobrietyDate, resetCounter, sentNotification]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
    setQuote(getRandomQuote());
  };

  const handleButtonClick = async () => {
    if (buttonLabel === 'Start') {
      const currentDate = new Date();
      try {
        await AsyncStorage.setItem('sobrietyDate', JSON.stringify(currentDate));
        setSentNotification(false);
      } catch (error) {
        console.error('Error while saving sobriety date:', error);
      }
      setSobrietyDate(currentDate);
      setButtonLabel('Stop');
    } else {
      try {
        await AsyncStorage.removeItem('sobrietyDate');
        setSobrietyDate(null);
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setButtonLabel('Start');
        setResetCounter((prev) => prev + 1);
      } catch (error) {
        console.error('Error while removing sobriety date:', error);
      }
    }
  };

  async function sendNotification() {
    const permission = await Notifications.requestPermissionsAsync();
    console.log(permission)
  
    if (permission.status !== 'granted') {
      console.error('Permission to send notifications not granted.');
      return;
    }
  
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Gratulacje!',
        body: 'Osiągnąłeś kolejny dzień trzeźwości!',
      },
      trigger: {
        seconds: 10, // testowo ustawić na 10 sekund
      },
    });
  
    console.log('Notification scheduled:', identifier);
  }
  
  return (
  <ScrollView
  contentContainerStyle={styles.container}
  refreshControl={
  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
  >
  <Text style={styles.title}>Licznik Trzeźwości</Text>
  <Text style={styles.timeText}>
  {time.days} dni {time.hours} godz. {time.minutes} min. {time.seconds} sek.
  </Text>
  <Button title={buttonLabel} onPress={handleButtonClick} />
  <View style={styles.quoteContainer}>
    <Text style={styles.quoteText}>{quote}</Text>
  </View>
</ScrollView>
);
};

const styles = StyleSheet.create({
container: {
flexGrow: 1,
backgroundColor: '#121212',
alignItems: 'center',
justifyContent: 'center',
},
title: {
fontSize: 28,
fontWeight: 'bold',
color: '#FFFFFF',
marginBottom: 20,
},
timeText: {
fontSize: 20,
color: '#FFFFFF',
marginBottom: 20,
},
quoteContainer: {
marginTop: 30,
paddingHorizontal: 20,
},
quoteText: {
fontSize: 18,
fontStyle: 'italic',
color: '#FFFFFF',
textAlign: 'center',
},
});

export default SobrietyCounter;