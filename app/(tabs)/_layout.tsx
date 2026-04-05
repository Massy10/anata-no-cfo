import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme/useTheme';
import { TabIcons } from '@/components/icons/TabIcons';
import { fontSize } from '@/theme/tokens';

const TAB_BAR_HEIGHT = 83;

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      initialRouteName="analysis"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.t3,
        tabBarLabelStyle: {
          fontSize: fontSize.tabLabel,
          fontWeight: '500',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_HEIGHT,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.sep,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.tabBg },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="income"
        options={{
          tabBarLabel: '収入',
          tabBarIcon: ({ focused, color }) => TabIcons.income(focused, color),
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          tabBarLabel: '支出',
          tabBarIcon: ({ focused, color }) => TabIcons.expense(focused, color),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          tabBarLabel: '分析',
          tabBarIcon: ({ focused, color }) => TabIcons.analysis(focused, color),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: '設定',
          tabBarIcon: ({ focused, color }) => TabIcons.settings(focused, color),
        }}
      />
    </Tabs>
  );
}
