import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import EditEventScreen from './screens/EditEventScreen'; // Importér EditEventScreen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileOverview" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditUserProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Events') {
            iconName = 'calendar';
          } else if (route.name === 'ProfileTab') {
            iconName = 'account';
          }

          return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ title: 'My Events' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ title: 'Profile' }} />    
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen 
          name="CreateEvent" 
          component={CreateEventScreen} 
          options={{ 
            title: 'Create Event', 
            headerBackTitle: 'Home' 
          }} 
        />
        <Stack.Screen 
          name="EventDetailScreen" 
          component={EventDetailScreen} 
          options={{ 
            title: 'Event Details', 
            headerBackTitle: 'My Events' 
          }} 
        />
        <Stack.Screen 
          name="EditEventScreen" 
          component={EditEventScreen} 
          options={{ 
            title: 'Edit Event', 
            headerBackTitle: 'Event Details' 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
