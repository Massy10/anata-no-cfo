import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { fontSize, spacing } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      <View style={styles.flex}>
        {/* Decorative bubbles */}
        <View
          style={[
            styles.bubble,
            {
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.blue,
              opacity: 0.06,
              top: 40,
              right: -20,
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
              backgroundColor: colors.purple,
              opacity: 0.05,
              bottom: 200,
              left: -20,
            },
          ]}
        />

        {/* Center content */}
        <View style={styles.centerContent}>
          {/* App icon */}
          <View style={[styles.appIcon, { backgroundColor: colors.blue }]}>
            <Text style={styles.appIconEmoji}>💰</Text>
          </View>

          <Text style={[styles.title, { color: colors.t1 }]}>
            あなたのCFO
          </Text>
          <Text style={[styles.subtitle, { color: colors.t2 }]}>
            お金の流れを、完全に把握する
          </Text>
        </View>

        {/* Auth buttons */}
        <View style={styles.buttonsContainer}>
          {/* Apple Sign In */}
          <TouchableOpacity
            style={[styles.appleButton]}
            activeOpacity={0.8}
            onPress={handleSignIn}
          >
            <Text style={styles.appleButtonText}>Appleでサインイン</Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity
            style={[
              styles.googleButton,
              {
                backgroundColor: colors.heroGlass,
                borderColor: colors.sep,
              },
            ]}
            activeOpacity={0.8}
            onPress={handleSignIn}
          >
            <Text style={[styles.googleButtonText, { color: colors.t1 }]}>
              Googleでサインイン
            </Text>
          </TouchableOpacity>

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
  bubble: {
    position: 'absolute',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPaddingH,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appIconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingBottom: 40,
    alignItems: 'center',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderRadius: 14,
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  googleButton: {
    borderRadius: 14,
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    marginBottom: 20,
  },
  googleButtonText: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  guestButton: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  guestButtonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  guestHint: {
    fontSize: 12,
    textAlign: 'center',
  },
});
