import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signInWithApple, signInWithGoogle, signInAsGuest } = useAuth();
  const router = useRouter();

  async function handleSignIn() {
    await signInAsGuest();
    router.replace('/(tabs)/analysis');
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
      <View style={[styles.flex, styles.container]}>
        {/* Decorative bubbles */}
        <View
          style={[
            styles.bubble,
            {
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: `${colors.blue}0F`,
              top: 60,
              right: -30,
            },
          ]}
        />
        <View
          style={[
            styles.bubble,
            {
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: `${colors.purple}0D`,
              bottom: 120,
              left: -20,
            },
          ]}
        />

        {/* Center content */}
        <View style={styles.centerContent}>
          {/* App icon */}
          <LinearGradient
            colors={[colors.blue, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.appIcon,
              {
                shadowColor: colors.blue,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.2,
                shadowRadius: 18,
                elevation: 8,
              },
            ]}
          >
            <Text style={styles.appIconEmoji}>💰</Text>
          </LinearGradient>

          <Text style={[styles.title, { color: colors.t1 }]}>
            あなたのCFO
          </Text>
          <Text style={[styles.subtitle, { color: colors.t2 }]}>
            お金の流れを、完全に把握する
          </Text>

          {/* Apple button */}
          <TouchableOpacity
            style={[
              styles.appleButton,
              {
                backgroundColor: colors.t1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              },
            ]}
            activeOpacity={0.8}
            onPress={handleSignIn}
          >
            <Text style={[styles.appleButtonText, { color: colors.bg }]}>
               Appleでサインイン
            </Text>
          </TouchableOpacity>

          {/* Google button */}
          <View style={[styles.googleButtonOuter, { borderColor: colors.sep }]}>
            <BlurView intensity={8} style={styles.googleBlur}>
              <TouchableOpacity
                style={[
                  styles.googleButton,
                  { backgroundColor: colors.heroGlass },
                ]}
                activeOpacity={0.8}
                onPress={handleSignIn}
              >
                <Text style={[styles.googleButtonText, { color: colors.t1 }]}>
                  Googleでサインイン
                </Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Guest */}
          <TouchableOpacity
            style={styles.guestButton}
            activeOpacity={0.7}
            onPress={handleSignIn}
          >
            <Text style={[styles.guestButtonText, { color: colors.blue }]}>
              ゲストで始める
            </Text>
          </TouchableOpacity>

          <Text style={[styles.guestHint, { color: colors.t2 }]}>
            後からアカウントを作成できます
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appIconEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 48,
    textAlign: 'center',
  },
  appleButton: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  appleButtonText: {
    fontWeight: '600',
    fontSize: 17,
  },
  googleButtonOuter: {
    width: '100%',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 10,
  },
  googleBlur: {
    width: '100%',
  },
  googleButton: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    fontWeight: '600',
    fontSize: 17,
  },
  guestButton: {
    marginTop: 16,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 17,
  },
  guestHint: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});
