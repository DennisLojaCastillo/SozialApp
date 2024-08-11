import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";  // Sørg for at importere signOut

const ProfileScreen = ({ navigation }) => {
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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Auth');
      })
      .catch(error => {
        console.error('Error signing out: ', error);
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
        <Title style={styles.name}>{name}</Title>
        <Text style={styles.subtitle}>{`${age}, ${city}`}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Bio</Text>
        <Text style={styles.detail}>{bio}</Text>
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('EditUserProfile')}
        style={styles.button}
      >
        Edit Profile
      </Button>
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={[styles.button, { marginTop: 10 }]}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  detailsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;
