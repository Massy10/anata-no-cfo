import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { radius, fontSize, spacing } from '@/theme/tokens';
import { NavBar } from '@/components/ui/NavBar';
import { SectionCard } from '@/components/ui/SectionCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { setCfoProfile, setIsOnboarded } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [cfoName, setCfoName] = useState('マネーの番人');
  const [goalAsset, setGoalAsset] = useState('1000');
  const [goalCf, setGoalCf] = useState('10');

  // ── Step 0: Welcome ──
  if (step === 0) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
        <View style={styles.flex}>
          {/* Decorative bubbles */}
          <View
            style={[
              styles.bubble,
              {
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.blue,
                opacity: 0.08,
                top: 60,
                left: -20,
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
                opacity: 0.06,
                top: 40,
                right: -10,
              },
            ]}
          />
          <View
            style={[
              styles.bubble,
              {
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.green,
                opacity: 0.06,
                bottom: 180,
                left: 20,
              },
            ]}
          />
          <View
            style={[
              styles.bubble,
              {
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.blue,
                opacity: 0.05,
                bottom: 120,
                right: -20,
              },
            ]}
          />

          <View style={styles.centerContent}>
            {/* App icon */}
            <View style={styles.appIconWrapper}>
              <View style={[styles.appIcon, { backgroundColor: colors.blue }]}>
                <Text style={styles.appIconEmoji}>💰</Text>
              </View>
            </View>

            <Text style={[styles.welcomeTitle, { color: colors.t1 }]}>
              ようこそ
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.t2 }]}>
              あなたのCFO は、あなた専用の最高財務責任者です
            </Text>
            <Text style={[styles.welcomeDesc, { color: colors.t2 }]}>
              収支データを分析し、利益向上や支出削減の提案をしてくれます
            </Text>
          </View>

          <View style={styles.bottomButton}>
            <TouchableOpacity
              style={styles.gradientButton}
              activeOpacity={0.8}
              onPress={() => setStep(1)}
            >
              <View style={[styles.gradientBg, { backgroundColor: colors.blue }]}>
                <Text style={styles.gradientButtonText}>はじめる</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Step 1: CFO Setup ──
  if (step === 1) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <NavBar title="あなたのCFOを設定" onBack={() => setStep(0)} />

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Brain icon */}
            <View style={styles.iconCircleWrapper}>
              <View style={[styles.iconCircle, { backgroundColor: colors.purple }]}>
                <Text style={styles.iconCircleEmoji}>🧠</Text>
              </View>
            </View>

            <Text style={[styles.setupHint, { color: colors.t2 }]}>
              AIアドバイザーの名前を決めてください
            </Text>

            <SectionCard header="CFOの名前" footer="いつでも設定から変更できます">
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: colors.t1,
                    backgroundColor: colors.bg2,
                  },
                ]}
                value={cfoName}
                onChangeText={setCfoName}
                placeholder="CFOの名前"
                placeholderTextColor={colors.t3}
              />
            </SectionCard>

            <SectionCard header="目標設定" footer="CFOがこの目標に基づいてアドバイスします">
              <View style={[styles.goalRow, { borderBottomColor: colors.sep }]}>
                <Text style={[styles.goalLabel, { color: colors.t1 }]}>
                  目標総資産
                </Text>
                <View style={styles.goalInputRow}>
                  <TextInput
                    style={[
                      styles.goalInput,
                      {
                        color: colors.t1,
                        backgroundColor: colors.bg3,
                      },
                    ]}
                    value={goalAsset}
                    onChangeText={setGoalAsset}
                    keyboardType="numeric"
                    placeholder="1000"
                    placeholderTextColor={colors.t3}
                  />
                  <Text style={[styles.goalUnit, { color: colors.t2 }]}>万円</Text>
                </View>
              </View>
              <View style={styles.goalRow}>
                <Text style={[styles.goalLabel, { color: colors.t1 }]}>
                  月間目標CF
                </Text>
                <View style={styles.goalInputRow}>
                  <TextInput
                    style={[
                      styles.goalInput,
                      {
                        color: colors.t1,
                        backgroundColor: colors.bg3,
                      },
                    ]}
                    value={goalCf}
                    onChangeText={setGoalCf}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor={colors.t3}
                  />
                  <Text style={[styles.goalUnit, { color: colors.t2 }]}>万円</Text>
                </View>
              </View>
            </SectionCard>

            <View style={styles.nextButtonWrapper}>
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.blue }]}
                activeOpacity={0.8}
                onPress={() => setStep(2)}
              >
                <Text style={styles.nextButtonText}>次へ</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Step 2: Confirmation ──
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.confirmContent}
      >
        {/* Green checkmark */}
        <View
          style={[
            styles.checkCircle,
            { backgroundColor: colors.green },
          ]}
        >
          <Text style={styles.checkEmoji}>✓</Text>
        </View>

        <Text style={[styles.confirmTitle, { color: colors.t1 }]}>
          準備完了
        </Text>

        {/* CFO name card */}
        <View
          style={[
            styles.cfoNameCard,
            { backgroundColor: colors.bg2, borderColor: colors.heroBorder },
          ]}
        >
          <Text style={[styles.cfoNameText, { color: colors.t1 }]}>
            「{cfoName || 'マネーの番人'}」
          </Text>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: colors.bg2 },
            ]}
          >
            <View style={[styles.summaryDot, { backgroundColor: colors.blue }]} />
            <Text style={[styles.summaryLabel, { color: colors.t2 }]}>
              目標総資産
            </Text>
            <Text style={[styles.summaryValue, { color: colors.t1 }]}>
              {goalAsset || '1000'}万円
            </Text>
          </View>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: colors.bg2 },
            ]}
          >
            <View style={[styles.summaryDot, { backgroundColor: colors.green }]} />
            <Text style={[styles.summaryLabel, { color: colors.t2 }]}>
              月間目標CF
            </Text>
            <Text style={[styles.summaryValue, { color: colors.t1 }]}>
              {goalCf || '10'}万円
            </Text>
          </View>
        </View>

        <Text style={[styles.confirmHint, { color: colors.t3 }]}>
          分析タブから「{cfoName || 'マネーの番人'}」にいつでも相談できます
        </Text>

        <View style={styles.nextButtonWrapper}>
          <TouchableOpacity
            style={[styles.gradientButton, { overflow: 'hidden' }]}
            activeOpacity={0.8}
            onPress={() => {
              setCfoProfile({
                cfoName: cfoName || 'マネーの番人',
                goalAsset: Number(goalAsset) || 1000,
                goalCf: Number(goalCf) || 10,
              });
              setIsOnboarded(true);
              router.replace('/login');
            }}
          >
            <View style={[styles.gradientBg, { backgroundColor: colors.blue }]}>
              <Text style={styles.gradientButtonText}>はじめましょう</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  appIconWrapper: {
    marginBottom: 24,
  },
  appIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconEmoji: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  welcomeDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomButton: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingBottom: 32,
  },
  gradientButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradientBg: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    minHeight: 52,
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  iconCircleWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleEmoji: {
    fontSize: 30,
  },
  setupHint: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  textInput: {
    fontSize: fontSize.body,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: spacing.rowMinHeight,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: spacing.rowMinHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  goalLabel: {
    fontSize: fontSize.body,
    flex: 1,
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInput: {
    fontSize: fontSize.body,
    textAlign: 'right',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    marginRight: 4,
  },
  goalUnit: {
    fontSize: fontSize.body,
  },
  nextButtonWrapper: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: 16,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  confirmContent: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.screenPaddingH,
    paddingBottom: 40,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkEmoji: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  cfoNameCard: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  cfoNameText: {
    fontSize: 22,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  summaryCard: {
    flex: 1,
    borderRadius: radius.card,
    padding: 16,
    alignItems: 'center',
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: fontSize.caption,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  confirmHint: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
});
