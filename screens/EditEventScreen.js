import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';

const EditEventScreen = ({ route }) => {
  const { eventId } = route.params;
  const [eventName, setEventName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvent = async () => {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        setEventName(eventData.eventName);
        setCapacity(eventData.capacity);
        setDescription(eventData.description);
        setAddress(eventData.address);
        setCategory(eventData.category);
        setImage(eventData.image);
      } else {
        alert('Event not found');
        navigation.goBack();
      }
    };

    fetchEvent();
  }, [eventId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `event_images/${Date.now()}`);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleUpdateEvent = async () => {
    if (!eventName || !capacity || !description || !address || !category) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const eventRef = doc(db, 'events', eventId);
      let imageURL = image;

      if (image && image.startsWith('file://')) {
        imageURL = await uploadImage();
      }

      await updateDoc(eventRef, {
        eventName,
        capacity,
        description,
        address,
        category,
        image: imageURL,
      });

      alert('Event updated successfully!');
      navigation.navigate('EventDetailScreen', { eventId }); // Naviger tilbage til EventDetailScreen efter opdatering
    } catch (error) {
      console.error("Error updating document: ", error);
      alert('Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const eventRef = doc(db, 'events', eventId);
              await deleteDoc(eventRef);
              alert('Event deleted successfully!');
              navigation.navigate('Events'); // Naviger tilbage til Events efter sletning
            } catch (error) {
              console.error("Error deleting document: ", error);
              alert('Failed to delete event.');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Title style={styles.title}>Edit Event</Title>
          
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Paragraph style={styles.placeholderText}>Select Event Image</Paragraph>
            )}
          </TouchableOpacity>
          
          <TextInput
            label="Event Name"
            value={eventName}
            onChangeText={setEventName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Capacity"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, { height: 100 }]}
            mode="outlined"
          />
          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Category"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={handleUpdateEvent}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : "Save Changes"}
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleDeleteEvent}
            style={styles.deleteButton}
            color="red"
            disabled={loading}
          >
            Delete Event
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  placeholderText: {
    color: '#888',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  deleteButton: {
    alignSelf: 'stretch',
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default EditEventScreen;
