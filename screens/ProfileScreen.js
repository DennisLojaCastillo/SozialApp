import React from 'react';
import { View, Button } from 'react-native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Auth'); // Naviger tilbage til AuthScreen efter logout
      })
      .catch(error => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
