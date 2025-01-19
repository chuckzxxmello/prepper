import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Fun = ({ navigation }) => {
  const [sounds, setSounds] = useState([]);

  // Create references for images
  const numImages = 4; // Multiply each image type by 4
  const centerX = screenWidth / 2 - 80; // Adjusted for double size (width / 2 - half image width)
  const centerY = screenHeight / 2 - 80; // Adjusted for double size (height / 2 - half image height)
  const xPos = Array.from({ length: numImages * 4 }, () => useRef(new Animated.Value(centerX)).current);
  const yPos = Array.from({ length: numImages * 4 }, () => useRef(new Animated.Value(centerY)).current);
  const xDir = Array.from({ length: numImages * 4 }, () => useRef(Math.random() * 2 - 1));
  const yDir = Array.from({ length: numImages * 4 }, () => useRef(Math.random() * 2 - 1));

  const audioFiles = [
    require('../../assets/clown.mp3'),
    require('../../assets/diarrhea.mp3'),
    require('../../assets/horn.mp3'),
    require('../../assets/laugh.mp3'),
  ];

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      const soundObjects = await Promise.all(
        audioFiles.map((audioFile) => Audio.Sound.createAsync(audioFile))
      );
      setSounds(soundObjects.map(({ sound }) => sound));

      soundObjects.forEach(({ sound }) => {
        sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.replayAsync();
          }
        });
      });
    };

    loadAndPlayAudio();

    return () => {
      sounds.forEach((sound) => sound.unloadAsync());
    };
  }, []);

  const stopAudio = () => {
    sounds.forEach((sound) => sound.stopAsync());
  };

  useEffect(() => {
    const bounce = (xPos, yPos, xDir, yDir) => {
      for (let i = 0; i < xPos.length; i++) {
        const newX = xPos[i]._value + xDir[i].current * 20; // Increased speed
        const newY = yPos[i]._value + yDir[i].current * 20; // Increased speed

        if (newX <= 0 || newX >= screenWidth - 160) { // Adjusted for double size
          xDir[i].current = -xDir[i].current; // Reverse direction
          // Add randomness
          xDir[i].current += Math.random() * 0.5 - 0.25;
        }
        if (newY <= 0 || newY >= screenHeight - 160) { // Adjusted for double size
          yDir[i].current = -yDir[i].current; // Reverse direction
          // Add randomness
          yDir[i].current += Math.random() * 0.5 - 0.25;
        }

        xPos[i].setValue(newX);
        yPos[i].setValue(newY);
      }

      requestAnimationFrame(() => bounce(xPos, yPos, xDir, yDir));
    };

    bounce(xPos, yPos, xDir, yDir);
  }, [xPos, yPos, xDir, yDir]);

  const renderImages = () => {
    const images = [
      require('../../assets/chuckz.png'),
      require('../../assets/ron.png'),
      require('../../assets/mark.png'),
      require('../../assets/eman.png'),
    ];

    return xPos.map((_, index) => (
      <Animated.View key={index} style={[styles.imageContainer, { transform: [{ translateX: xPos[index] }, { translateY: yPos[index] }] }]}>
        <Image source={images[index % 4]} style={styles.image} />
      </Animated.View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>YAHOO!</Text>
      <Text style={styles.infoText}>Uno na dis sa App Dev!!!</Text>

      {renderImages()}

      <TouchableOpacity onPress={stopAudio} style={styles.stopButton}>
        <Text style={styles.stopButtonText}>Stop Audio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E0441',
  },
  infoText: {
    fontSize: 18,
    color: '#2E0441',
    marginTop: 10,
  },
  imageContainer: {
    position: 'absolute',
    width: 160,  // Doubled size
    height: 160, // Doubled size
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stopButton: {
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: '#BB86FC',
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Fun;
