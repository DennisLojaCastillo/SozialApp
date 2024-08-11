import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text, FAB } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      {/* Her kan du tilføje en liste over eksisterende events */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
