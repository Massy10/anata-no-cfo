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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { spacing } from '@/theme/tokens';
import { NavBar } from '@/components/ui/NavBar';
import { SectionCard } from '@/components/ui/SectionCard';

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
        <View style={[styles.flex, styles.step0Container]}>
          {/* Decorative bubbles */}
          <View
            style={[
              styles.bubble,
              {
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: `${colors.blue}14`,
                top: 40,
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
                backgroundColor: `${colors.purple}0F`,
                top: 120,
                right: -30,
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
                backgroundColor: `${colors.green}0F`,
                bottom: 100,
                left: 30,
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
                backgroundColor: `${colors.blue}0D`,
                bottom: 60,
                right: 20,
              },
            ]}
          />

          <View style={styles.step0Content}>
            {/* App icon */}
            <LinearGradient
              colors={[colors.blue, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.step0Icon,
                {
                  shadowColor: colors.blue,
                  shadowOffset: { width: 0, height: 16 },
                  shadowOpacity: 0.27,
                  shadowRadius: 24,
                  elevation: 10,
                },
              ]}
            >
              <Text style={{ fontSize: 44 }}>💰</Text>
            </LinearGradient>

            <Text style={[styles.welcomeTitle, { color: colors.t1 }]}>
              ようこそ
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.t2 }]}>
              {'あなたのCFO は、あなた専用の\n最高財務責任者です'}
            </Text>
            <Text style={[styles.welcomeDesc, { color: colors.t2 }]}>
              {'収支データを分析し、利益向上や\n支出削減の提案をしてくれます'}
            </Text>

            <LinearGradient
              colors={[colors.blue, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.step0Button,
                {
                  shadowColor: colors.blue,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 6,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.step0ButtonInner}
                activeOpacity={0.8}
                onPress={() => setStep(1)}
              >
                <Text style={styles.step0ButtonText}>はじめる</Text>
              </TouchableOpacity>
            </LinearGradient>
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
              <LinearGradient
                colors={[colors.blue, colors.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}
              >
                <Text style={{ fontSize: 32 }}>🧠</Text>
              </LinearGradient>
            </View>

            <Text style={[styles.setupHint, { color: colors.t2 }]}>
              AIアドバイザーの名前を決めてください
            </Text>

            <SectionCard header="CFOの名前" footer="いつでも設定から変更できます">
              <View style={{ padding: 12, paddingHorizontal: 16 }}>
                <TextInput
                  style={[styles.textInput, { color: colors.t1 }]}
                  value={cfoName}
                  onChangeText={setCfoName}
                  placeholder="例: マネーの番人"
                  placeholderTextColor={colors.t3}
                />
              </View>
            </SectionCard>

            <SectionCard header="目標設定" footer="CFOがこの目標に基づいてアドバイスします">
              <View style={{ paddingHorizontal: 16 }}>
                <View
                  style={[
                    styles.goalRow,
                    {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.sep,
                    },
                  ]}
                >
                  <Text style={[styles.goalLabel, { color: colors.t1 }]}>
                    目標総資産
                  </Text>
                  <View style={styles.goalInputRow}>
                    <TextInput
                      style={[styles.goalInput, { color: colors.blue }]}
                      value={goalAsset}
                      onChangeText={setGoalAsset}
                      keyboardType="numeric"
                      placeholder="1000"
                      placeholderTextColor={colors.t3}
                    />
                    <Text style={[styles.goalUnit, { color: colors.t1 }]}>
                      万円
                    </Text>
                  </View>
                </View>
                <View style={styles.goalRow}>
                  <Text style={[styles.goalLabel, { color: colors.t1 }]}>
                    月間目標CF
                  </Text>
                  <View style={styles.goalInputRow}>
                    <TextInput
                      style={[styles.goalInput, { color: colors.green }]}
                      value={goalCf}
                      onChangeText={setGoalCf}
                      keyboardType="numeric"
                      placeholder="10"
                      placeholderTextColor={colors.t3}
                    />
                    <Text style={[styles.goalUnit, { color: colors.t1 }]}>
                      万円
                    </Text>
                  </View>
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
            { backgroundColor: `${colors.green}22` },
          ]}
        >
          <Svg width={40} height={40} viewBox="0 0 40 40">
            <Path
              d="M10 20L17 27L30 13"
              stroke={colors.green}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </View>

        <Text style={[styles.confirmTitle, { color: colors.t1 }]}>
          準備完了
        </Text>

        {/* CFO name card */}
        <LinearGradient
          colors={[`${colors.blue}15`, `${colors.purple}15`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cfoNameCard}
        >
          <Text style={[{ fontSize: 13, color: colors.t2 }]}>
            あなたのCFO
          </Text>
          <Text
            style={[
              { fontSize: 22, fontWeight: '700', color: colors.t1, marginTop: 4 },
            ]}
          >
            「{cfoName || 'マネーの番人'}」
          </Text>
        </LinearGradient>

        {/* Goal cards */}
        <View style={styles.goalCardsRow}>
          <View
            style={[styles.goalCard, { backgroundColor: colors.bg2 }]}
          >
            <Text style={[{ fontSize: 11, color: colors.t2 }]}>
              目標総資産
            </Text>
            <Text
              style={[
                { fontSize: 20, fontWeight: '600', color: colors.blue, marginTop: 2 },
              ]}
            >
              {goalAsset || '1000'}
              <Text style={{ fontSize: 13, fontWeight: '400' }}>万円</Text>
            </Text>
          </View>
          <View
            style={[styles.goalCard, { backgroundColor: colors.bg2 }]}
          >
            <Text style={[{ fontSize: 11, color: colors.t2 }]}>
              月間目標CF
            </Text>
            <Text
              style={[
                { fontSize: 20, fontWeight: '600', color: colors.green, marginTop: 2 },
              ]}
            >
              +{goalCf || '10'}
              <Text style={{ fontSize: 13, fontWeight: '400' }}>万円</Text>
            </Text>
          </View>
        </View>

        <Text style={[styles.confirmHint, { color: colors.t3 }]}>
          {'分析タブから「' + (cfoName || 'マネーの番人') + '」に\nいつでも相談できます'}
        </Text>

        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: colors.blue }]}
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
          <Text style={styles.completeButtonText}>はじめましょう</Text>
        </TouchableOpacity>
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
  // Step 0
  step0Container: {
    position: 'relative',
    overflow: 'hidden',
  },
  step0Content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  step0Icon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 27.2,
  },
  welcomeDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20.8,
    marginBottom: 44,
  },
  step0Button: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  step0ButtonInner: {
    padding: 16,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step0ButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Step 1
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
  setupHint: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  textInput: {
    fontSize: 17,
    backgroundColor: 'transparent',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  goalLabel: {
    fontSize: 15,
    flex: 1,
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  goalInput: {
    width: 60,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  goalUnit: {
    fontSize: 15,
    fontWeight: '500',
  },
  nextButtonWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  nextButton: {
    borderRadius: 12,
    padding: 16,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // Step 2
  confirmContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 28,
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
  confirmTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  cfoNameCard: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  goalCardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  goalCard: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  confirmHint: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20.8,
    marginBottom: 32,
  },
  completeButton: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
