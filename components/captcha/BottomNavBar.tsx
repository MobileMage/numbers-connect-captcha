import { Github, Headphones, Puzzle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

import { CANVAS_WIDTH, ViewMode } from './types';

type BottomNavBarProps = {
  currentView: ViewMode;
  onSwitchView: (view: ViewMode) => void;
};

const BottomNavBar = ({ currentView, onSwitchView }: BottomNavBarProps) => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const activeColor = useThemeColor({}, 'tint');

  const navItems = [
    {
      mode: ViewMode.CAPTCHA,
      icon: Puzzle,
      label: 'Captcha',
    },
    {
      mode: ViewMode.AUDIO,
      icon: Headphones,
      label: 'Audio',
    },
    {
      mode: ViewMode.INFO,
      icon: Github,
      label: 'Info',
    },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = currentView === item.mode;
        const color = isActive ? activeColor : textColor;
        return (
          <TouchableOpacity
            key={item.mode}
            style={styles.navItem}
            onPress={() => onSwitchView(item.mode)}>
            <item.icon color={color} size={24} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CANVAS_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BottomNavBar; 