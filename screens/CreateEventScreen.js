import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateEventScreen = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleCreateEvent = async () => {
    if (!eventName || !capacity || !description || !address || !category) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true); // Start loading-indikator

    try {
      const imageURL = await uploadImage();

      await addDoc(collection(db, 'events'), {
        eventName,
        capacity,
        description,
        address,
        category,
        image: imageURL,
      });

      alert('Event created successfully!');
      navigation.goBack(); // Gå tilbage til HomeScreen efter oprettelse
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to create event.');
    } finally {
      setLoading(false); // Stop loading-indikator
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Title style={styles.title}>Create Event</Title>
          
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

        </ScrollView>
        <Button
          mode="contained"
          onPress={handleCreateEvent}
          style={styles.button}
          disabled={loading}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> : "Create Event"}
        </Button>
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
    margin: 20,
    alignSelf: 'stretch',
  },
});

export default CreateEventScreen;
