import { useThemeColor } from '@/hooks/useThemeColor';
import { Github } from 'lucide-react-native';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './types';

const InfoModal = () => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  
  const openGitHubRepo = () => {
    Linking.openURL('https://github.com/MobileMage/numbers-connect-captcha');
  };
  
  return (
    <Animated.View entering={
      FadeInDown
    } exiting={
      FadeOutUp
    } style={[styles.container, { borderColor: textColor + '20' }]}>
      <View style={styles.content}>
        <Text style={[styles.projectName, { color: textColor }]}>
          Connect The Numbers
        </Text>
        
        <Text style={[styles.description, { color: textColor + 'E0' }]}>
          This is a fun and interactive captcha where you connect the numbers in order.
          If you like this project, please consider giving it a star on GitHub!
        </Text>
        
        <TouchableOpacity 
          style={[styles.githubButton, { backgroundColor: textColor }]} 
          onPress={openGitHubRepo}
        >
          <Github size={24} color={backgroundColor} />
          <Text style={[styles.buttonText, { color: backgroundColor }]}>
            View on GitHub
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default InfoModal; 