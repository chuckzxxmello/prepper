import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import ConfettiCannon from 'react-native-confetti-cannon';
import { db, auth } from '../../config/firebase'; // Assuming Firebase is correctly set up
import { doc, getDoc } from 'firebase/firestore';

const WaterIntakeScreen = ({ navigation }) => {
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [waterLevel] = useState(new Animated.Value(0));
  const [waterRipple] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  const handleGoalReached = () => {
    setHasReachedGoal(true);
    setTimeout(() => setHasReachedGoal(false), 5000);
  };

  const calculateWaterFill = () => {
    const percentage = (waterConsumed / 3) * 100;
    Animated.timing(waterLevel, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  };

  const animateRipple = () => {
    waterRipple.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(waterRipple, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(waterRipple, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    const fetchWaterIntake = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'userInfo', auth.currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const fetchedWaterIntake = data.waterIntake || 0;
            setWaterConsumed(fetchedWaterIntake);
            if (fetchedWaterIntake >= 3) {
              handleGoalReached();
            }
          }
        } catch (error) {
          console.error('Error fetching water intake:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchWaterIntake();
    calculateWaterFill();
    animateRipple();
  }, [waterConsumed]);

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={30}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />
      
      {loading && waterConsumed < 3 ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <>
          <Text style={styles.title}>Your Daily Water Intake</Text>
          <View style={styles.waterInfo}>
            <Text style={styles.infoTextWhite}>Water Consumed: {waterConsumed}L</Text>
            <Text style={styles.infoTextWhite}>Goal: 3L</Text>

            {waterConsumed <= 1.0 && (
              <Text style={[styles.infoText, styles.boldText]}>Inom ka naman ng Tubig Baby!</Text>
            )}

            {waterConsumed === 3.0 && (
              <Text style={[styles.infoText, styles.boldText]}>Nice!</Text>
            )}
          </View>

          <View style={styles.waterBarContainer}>
            <Animated.View
              style={[styles.waterBar, {
                height: waterLevel.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              }]}
            />
            
            <Animated.View
              style={[styles.ripple, {
                opacity: waterRipple.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.7],
                }),
                transform: [{
                  scale: waterRipple.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3],
                  }),
                }],
              }]}
            />
          </View>

          {hasReachedGoal && (
            <ConfettiCannon
              count={200}
              origin={{ x: 0, y: 0 }}
              fadeOut={true}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E1E',  // Dark background color
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1, // Ensure the back button stays visible
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E0441',  // Primary color for text
    marginBottom: 20,
    zIndex: 1, // Ensure the title stays visible
  },
  waterInfo: {
    alignItems: 'center',
    zIndex: 1,
  },
  infoTextWhite: {
    fontSize: 18,
    marginVertical: 8,
    color: '#fff',  // White color for visibility in dark mode
  },
  infoText: {
    fontSize: 18,
    marginVertical: 8,
    color: '#B0B0B0',  // Light text color for better visibility in dark mode
  },
  boldText: {
    fontWeight: 'bold', // Bolden the text
  },
  waterBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  waterBar: {
    backgroundColor: '#4169E1',  // Dark blue color for water
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  ripple: {
    backgroundColor: 'rgba(173, 216, 230, 0.4)',  // Light ripple effect color
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
});

export default WaterIntakeScreen;
