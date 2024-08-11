import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import * as ImagePicker from 'expo-image-picker'; 
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name);
        setAge(userData.age);
        setCity(userData.city);
        setBio(userData.bio || '');
        setProfileImage(userData.profileImage || null); // Hent profilbillede hvis det findes
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleUpdate = async () => {
    const userDoc = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDoc, {
      name: name,
      age: age,
      city: city,
      bio: bio,
      profileImage: profileImage, // Gem URL'en til det valgte profilbillede
    });
    alert('Profile updated successfully!');
    navigation.goBack(); // Naviger tilbage til ProfileScreen efter opdatering
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}.jpg`);

      const img = await fetch(imageUri);
      const bytes = await img.blob();

      const uploadTask = uploadBytesResumable(storageRef, bytes);

      uploadTask.on(
        'state_changed', 
        (snapshot) => {
          console.log(`Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfileImage(downloadURL);  // Opdater lokal state med det nye billede
        }
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80} 
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Title style={styles.title}>Edit Profile</Title>
          <TouchableOpacity onPress={handleImageUpload}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            label="Name"
            value={name}
            onChangeText={text => setName(text)}
            style={styles.input}
          />
          <TextInput
            label="Age"
            value={age}
            onChangeText={text => setAge(text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="City"
            value={city}
            onChangeText={text => setCity(text)}
            style={styles.input}
          />
          <TextInput
            label="Bio"
            value={bio}
            onChangeText={text => setBio(text)}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.bioInput]} 
          />
          <Button
            mode="contained"
            onPress={handleUpdate}
            style={styles.button}
          >
            Save Changes
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('ProfileOverview')} // Tilbage til profiloversigt
            style={[styles.button, { marginTop: 10 }]}
          >
            Back to Profile Overview
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 20,
  },
  bioInput: {
    height: 100, 
    textAlignVertical: 'top',
  },
  button: {
    width: '80%',
  },
});

export default EditProfileScreen;
