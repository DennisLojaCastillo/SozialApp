import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SwipeableEventCard from '../components/SwipeableEventCard';
import { FAB } from 'react-native-paper';

const EventScreen = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [closeSwipeable, setCloseSwipeable] = useState(false);

    useEffect(() => {
        const eventCollection = collection(db, 'events');

        const unsubscribe = onSnapshot(eventCollection, (snapshot) => {
            const eventList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching events: ", error);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    useFocusEffect(
        useCallback(() => {
            // Luk alle swipeable-komponenter, når skærmen fokuseres
            setCloseSwipeable(true);
            return () => setCloseSwipeable(false);
        }, [])
    );

    const handleDelete = async (eventId) => {
        try {
            await deleteDoc(doc(db, "events", eventId));
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    };

    const handleEdit = (eventId) => {
        navigation.navigate('EditEventScreen', { eventId });
    };

    const renderEvent = ({ item }) => (
        <SwipeableEventCard 
            event={item} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
            closeSwipeable={closeSwipeable}
            style={styles.eventCard} // Tilføj margin mellem kortene
        />
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => navigation.navigate('CreateEvent')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    list: {
        paddingBottom: 20,
    },
    eventCard: {
        marginBottom: 15, // Tilføj margin mellem kortene
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'tomato',
    },
});

export default EventScreen;
