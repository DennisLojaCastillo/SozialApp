import React from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

const SwipeableEventCard = ({ event, onDelete }) => {

  const confirmDelete = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDelete(event.id) }
      ]
    );
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity style={styles.deleteBox} onPress={confirmDelete}>
        <FontAwesome name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
      >
        <View style={styles.card}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{event.eventName}</Text>
            <Text style={styles.capacity}>Capacity: {event.capacity}</Text>
            <Text style={styles.category}>Category: {event.category}</Text>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',    
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  infoContainer: {
    padding: 15,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  capacity: {
    fontSize: 14,
    marginTop: 5,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default SwipeableEventCard;
