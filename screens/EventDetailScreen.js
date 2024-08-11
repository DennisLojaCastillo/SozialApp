import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Title, Paragraph, Button } from 'react-native-paper';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const EventDetailScreen = ({ route }) => {
  const { eventId } = route.params; // Få event ID fra navigationens parametre
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchEvent = async () => {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      setEvent(eventDoc.data());
    } else {
      alert('Event not found');
      navigation.goBack();
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchEvent();
    }, [eventId])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!event) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>{event.eventName}</Title>
      
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} />
      )}
      
      <View style={styles.infoContainer}>
        <Paragraph style={styles.label}>Capacity:</Paragraph>
        <Text style={styles.text}>{event.capacity}</Text>

        <Paragraph style={styles.label}>Category:</Paragraph>
        <Text style={styles.text}>{event.category}</Text>

        <Paragraph style={styles.label}>Description:</Paragraph>
        <Text style={styles.text}>{event.description}</Text>

        <Paragraph style={styles.label}>Address:</Paragraph>
        <Text style={styles.text}>{event.address}</Text>
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('EditEventScreen', { eventId })}
        style={styles.button}
      >
        Edit Event
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});

export default EventDetailScreen;
