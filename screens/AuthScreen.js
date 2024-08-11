import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Title, TouchableRipple } from 'react-native-paper';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = () => {
    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          const user = userCredential.user;
          console.log('User created:', user);

          
          await setDoc(doc(db, "users", user.uid), {
            name: name,
            age: age,
            city: city,
            bio: "", 
            email: user.email
          });

          navigation.navigate('MainTabs'); 
        })
        .catch(error => {
          setError(error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log('User logged in:', user);
          navigation.navigate('MainTabs'); 
        })
        .catch(error => {
          setError(error.message);
        });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <Title style={styles.title}>Sozial</Title>
        {isSignUp && (
          <>
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
          </>
        )}
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleAuth}
          style={styles.button}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </Button>
        <TouchableRipple onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.switchText}>
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </Text>
        </TouchableRipple>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
  },
  input: {
    width: '80%',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: '80%',
  },
  switchText: {
    marginTop: 20,
    color: 'blue',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default AuthScreen;
