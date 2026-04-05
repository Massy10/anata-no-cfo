import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize as fs, spacing } from '@/theme/tokens';
import { NavBar } from '@/components/ui/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { toJPY } from '@/lib/fx';
import { incomeData, expenseData } from '@/constants/mockData';
import { LinearGradient } from 'expo-linear-gradient';

type Message = {
  role: 'cfo' | 'user';
  text: string;
};

function getMockResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('サブスク') || lower === '1') {
    return '現在のサブスク状況を分析しました。\n\n🎵 Spotify: ¥980/月\n🎨 Netflix: ¥1,490/月\n☁️ iCloud+: ¥400/月\n💪 ジム会費: ¥8,800/月\n\n合計: ¥11,670/月\n\n💡 提案:\n• Spotify + Netflix → 音楽はYouTube Premium(¥1,280)に統合すると月¥1,190節約\n• ジムは市区町村の施設を検討すると月¥6,000以上の削減余地\n\n年間で約¥86,000の節約が見込めます。詳しく見ましょうか？';
  }
  if (lower.includes('固定費') || lower === '2') {
    return '固定費の分析結果です。\n\n🏠 家賃: ¥95,000 → 最大支出。引っ越しで¥10,000以上の削減余地\n⚡ 電気代: ¥8,500 → 電力会社の切り替えで¥1,000〜¥2,000節約\n📱 携帯代: ¥3,800 → すでに格安プラン。良好\n\n📊 固定費率: 約68%（理想は60%以下）\n\nまず電気代のプラン変更から始めませんか？手続きは10分で完了します。';
  }
  if (lower.includes('副業') || lower === '3') {
    return '副業収入の分析です。\n\n現在の副業収入:\n💻 フリーランス: ¥120,000/月\n🎵 音楽配信: ¥8,500/月\n💼 コンサル: $1,200/月（≈¥179,400）\n\n合計: 約¥307,900/月\n\n⚠️ リスク:\n• フリーランスは1社依存。契約終了時のリスク大\n• コンサルも単一クライアント\n\n💡 提案:\n1. フリーランスは2社以上に分散\n2. コンサルは月額契約を提案\n3. 音楽配信はカタログ拡充で¥15,000目標\n\n安定性スコア: 4/10（要改善）';
  }
  return '現在の財務状況をまとめます。\n\n📊 月間収支:\n• 収入: ¥615,000\n• 支出: ¥295,000\n• 純CF: +¥320,000\n\n目標達成率は良好です。\n\nもう少し具体的な質問があれば、より詳しく分析できます。例えば「サブスクを見直したい」「固定費を下げたい」などお試しください。';
}

export default function CfoChatScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { cfoProfile } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');

  const cfoName = cfoProfile?.cfoName || 'マネーの番人';
  const goalA = cfoProfile?.goalAsset ?? 1000;
  const goalCf = cfoProfile?.goalCf ?? 10;

  const netCF = useMemo(() => {
    const totalIncome = incomeData.reduce(
      (sum, item) => sum + toJPY(item.amount, item.currency),
      0,
    );
    const totalExpense = expenseData.reduce(
      (sum, item) => sum + toJPY(Math.abs(item.amount), item.currency),
      0,
    );
    return totalIncome - totalExpense;
  }, []);

  const goalCfYen = goalCf * 10000;
  const status =
    netCF >= goalCfYen
      ? '順調です'
      : 'あと¥' +
        (goalCfYen - netCF).toLocaleString() +
        '足りません';

  const initialMessages: Message[] = [
    {
      role: 'cfo',
      text: `こんにちは、${cfoName}です。\n\n現在の月間CFは +¥${netCF.toLocaleString()} で、目標の +¥${goalCf}0,000 に対して${status}。\n\nまず3つの改善提案があります。どれについて詳しく話しましょうか？`,
    },
    {
      role: 'cfo',
      text: '📊 提案1: サブスク見直し\nNetflix + Spotifyの重複を整理すると月 ¥980〜¥1,490 削減。\n\n💡 提案2: 固定費交渉\n電気代のプラン変更で月 ¥1,000〜¥2,000 の節約余地。\n\n📈 提案3: 副業収入の安定化\n月 ¥85,000 の副業収入を安定させるため、複数クライアント化を推奨。',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const suggestions = [
    'サブスクを見直したい',
    '固定費を下げたい',
    '副業を安定させたい',
  ];

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const userMsg: Message = { role: 'user', text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);

      setTimeout(() => {
        const response = getMockResponse(text);
        setMessages((prev) => [...prev, { role: 'cfo', text: response }]);
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 800);
    },
    [],
  );

  const hasInput = input.trim().length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Nav */}
        <NavBar
          title={cfoName}
          onBack={() => router.back()}
          rightAction={{
            label: '目標',
            onPress: () => router.push('/settings'),
          }}
        />

        {/* Goal summary bar */}
        <View style={styles.goalBar}>
          <View style={[styles.goalPill, { backgroundColor: colors.bg2 }]}>
            <Text style={[styles.goalLabel, { color: colors.t3 }]}>
              {'目標資産'}
            </Text>
            <Text style={[styles.goalValue, { color: colors.blue }]}>
              {goalA}万
            </Text>
          </View>
          <View style={[styles.goalPill, { backgroundColor: colors.bg2 }]}>
            <Text style={[styles.goalLabel, { color: colors.t3 }]}>
              {'月間CF'}
            </Text>
            <Text style={[styles.goalValue, { color: colors.green }]}>
              +{goalCf}万
            </Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((msg, i) => {
            const isCfo = msg.role === 'cfo';
            return (
              <View
                key={i}
                style={[
                  styles.msgRow,
                  isCfo ? styles.msgRowLeft : styles.msgRowRight,
                ]}
              >
                {isCfo && (
                  <View style={styles.avatar}>
                    <LinearGradient
                      colors={[colors.blue, colors.purple]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatarCircle}
                    >
                      <Text style={styles.avatarEmoji}>{'🧠'}</Text>
                    </LinearGradient>
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isCfo
                      ? [
                          styles.cfoBubble,
                          {
                            backgroundColor: colors.bg2,
                          },
                        ]
                      : [
                          styles.userBubble,
                          { backgroundColor: colors.blue },
                        ],
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      { color: isCfo ? colors.t1 : '#FFFFFF' },
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick suggestions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsBar}
          contentContainerStyle={styles.suggestionsContent}
        >
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.suggestionPill,
                { borderColor: colors.sep },
              ]}
              onPress={() => sendMessage(s)}
            >
              <Text style={[styles.suggestionText, { color: colors.blue }]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              borderTopColor: colors.sep,
              backgroundColor: colors.bg,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.bg2,
                borderColor: colors.sep,
                color: colors.t1,
              },
            ]}
            placeholder={`${cfoName}に質問する...`}
            placeholderTextColor={colors.t3}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              {
                backgroundColor: hasInput ? colors.blue : colors.blue + '33',
              },
            ]}
            onPress={() => sendMessage(input)}
            disabled={!hasInput}
          >
            <Text style={styles.sendArrow}>{'↑'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  goalBar: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  goalPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  goalLabel: {
    fontSize: 11,
  },
  goalValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 10,
  },
  msgRow: {
    flexDirection: 'row',
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarEmoji: {
    fontSize: 14,
    zIndex: 1,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cfoBubble: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    maxWidth: '82%',
  },
  userBubble: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    maxWidth: '78%',
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 20.8,
  },
  suggestionsBar: {
    maxHeight: 44,
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 6,
    alignItems: 'center',
  },
  suggestionPill: {
    borderWidth: 0.5,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 11,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
