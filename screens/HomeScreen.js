import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Text, IconButton, FAB, Button } from 'react-native-paper';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const eventCollection = collection(db, 'events');

    const unsubscribe = onSnapshot(eventCollection, (snapshot) => {
      const eventList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events: ", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const renderEvent = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.eventName}</Text>
        <Text style={styles.capacity}>Capacity: {item.capacity}</Text>
        <Text style={styles.category}>Category: {item.category}</Text>
        <Button
          mode="contained"
          onPress={() => alert(`You have joined the event: ${item.eventName}`)}
          style={styles.button}
        >
          Join Event
        </Button>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Events</Text>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false} // Skjul scroll indikatoren
      />
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate('CreateEvent')}
      />
    </View>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <IconButton
        icon="plus"
        size={28}
        onPress={() => navigation.navigate('CreateEvent')}
      />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  capacity: {
    fontSize: 14,
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'tomato',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'tomato',
  },
});

export default HomeScreen;
