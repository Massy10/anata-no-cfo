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

type Message = {
  role: 'cfo' | 'user';
  text: string;
};

function getMockResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('\u30b5\u30d6\u30b9\u30af') || lower === '1') {
    return '\u73fe\u5728\u306e\u30b5\u30d6\u30b9\u30af\u72b6\u6cc1\u3092\u5206\u6790\u3057\u307e\u3057\u305f\u3002\n\n\ud83c\udfb5 Spotify: \u00a5980/\u6708\n\ud83c\udfa8 Netflix: \u00a51,490/\u6708\n\u2601\ufe0f iCloud+: \u00a5400/\u6708\n\ud83d\udcaa \u30b8\u30e0\u4f1a\u8cbb: \u00a58,800/\u6708\n\n\u5408\u8a08: \u00a511,670/\u6708\n\n\ud83d\udca1 \u63d0\u6848:\n\u2022 Spotify + Netflix \u2192 \u97f3\u697d\u306fYouTube Premium(\u00a51,280)\u306b\u7d71\u5408\u3059\u308b\u3068\u6708\u00a51,190\u7bc0\u7d04\n\u2022 \u30b8\u30e0\u306f\u5e02\u533a\u753a\u6751\u306e\u65bd\u8a2d\u3092\u691c\u8a0e\u3059\u308b\u3068\u6708\u00a56,000\u4ee5\u4e0a\u306e\u524a\u6e1b\u4f59\u5730\n\n\u5e74\u9593\u3067\u7d04\u00a586,000\u306e\u7bc0\u7d04\u304c\u898b\u8fbc\u3081\u307e\u3059\u3002\u8a73\u3057\u304f\u898b\u307e\u3057\u3087\u3046\u304b\uff1f';
  }
  if (lower.includes('\u56fa\u5b9a\u8cbb') || lower === '2') {
    return '\u56fa\u5b9a\u8cbb\u306e\u5206\u6790\u7d50\u679c\u3067\u3059\u3002\n\n\ud83c\udfe0 \u5bb6\u8cc3: \u00a595,000 \u2192 \u6700\u5927\u652f\u51fa\u3002\u5f15\u3063\u8d8a\u3057\u3067\u00a510,000\u4ee5\u4e0a\u306e\u524a\u6e1b\u4f59\u5730\n\u26a1 \u96fb\u6c17\u4ee3: \u00a58,500 \u2192 \u96fb\u529b\u4f1a\u793e\u306e\u5207\u308a\u66ff\u3048\u3067\u00a51,000\u301c\u00a52,000\u7bc0\u7d04\n\ud83d\udcf1 \u643a\u5e2f\u4ee3: \u00a53,800 \u2192 \u3059\u3067\u306b\u683c\u5b89\u30d7\u30e9\u30f3\u3002\u826f\u597d\n\n\ud83d\udcca \u56fa\u5b9a\u8cbb\u7387: \u7d0468%\uff08\u7406\u60f3\u306f60%\u4ee5\u4e0b\uff09\n\n\u307e\u305a\u96fb\u6c17\u4ee3\u306e\u30d7\u30e9\u30f3\u5909\u66f4\u304b\u3089\u59cb\u3081\u307e\u305b\u3093\u304b\uff1f\u624b\u7d9a\u304d\u306f10\u5206\u3067\u5b8c\u4e86\u3057\u307e\u3059\u3002';
  }
  if (lower.includes('\u526f\u696d') || lower === '3') {
    return '\u526f\u696d\u53ce\u5165\u306e\u5206\u6790\u3067\u3059\u3002\n\n\u73fe\u5728\u306e\u526f\u696d\u53ce\u5165:\n\ud83d\udcbb \u30d5\u30ea\u30fc\u30e9\u30f3\u30b9: \u00a5120,000/\u6708\n\ud83c\udfb5 \u97f3\u697d\u914d\u4fe1: \u00a58,500/\u6708\n\ud83d\udcbc \u30b3\u30f3\u30b5\u30eb: $1,200/\u6708\uff08\u2248\u00a5179,400\uff09\n\n\u5408\u8a08: \u7d04\u00a5307,900/\u6708\n\n\u26a0\ufe0f \u30ea\u30b9\u30af:\n\u2022 \u30d5\u30ea\u30fc\u30e9\u30f3\u30b9\u306f1\u793e\u4f9d\u5b58\u3002\u5951\u7d04\u7d42\u4e86\u6642\u306e\u30ea\u30b9\u30af\u5927\n\u2022 \u30b3\u30f3\u30b5\u30eb\u3082\u5358\u4e00\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\n\n\ud83d\udca1 \u63d0\u6848:\n1. \u30d5\u30ea\u30fc\u30e9\u30f3\u30b9\u306f2\u793e\u4ee5\u4e0a\u306b\u5206\u6563\n2. \u30b3\u30f3\u30b5\u30eb\u306f\u6708\u984d\u5951\u7d04\u3092\u63d0\u6848\n3. \u97f3\u697d\u914d\u4fe1\u306f\u30ab\u30bf\u30ed\u30b0\u62e1\u5145\u3067\u00a515,000\u76ee\u6a19\n\n\u5b89\u5b9a\u6027\u30b9\u30b3\u30a2: 4/10\uff08\u8981\u6539\u5584\uff09';
  }
  return '\u73fe\u5728\u306e\u8ca1\u52d9\u72b6\u6cc1\u3092\u307e\u3068\u3081\u307e\u3059\u3002\n\n\ud83d\udcca \u6708\u9593\u53ce\u652f:\n\u2022 \u53ce\u5165: \u00a5615,000\n\u2022 \u652f\u51fa: \u00a5295,000\n\u2022 \u7d14CF: +\u00a5320,000\n\n\u76ee\u6a19\u9054\u6210\u7387\u306f\u826f\u597d\u3067\u3059\u3002\n\n\u3082\u3046\u5c11\u3057\u5177\u4f53\u7684\u306a\u8cea\u554f\u304c\u3042\u308c\u3070\u3001\u3088\u308a\u8a73\u3057\u304f\u5206\u6790\u3067\u304d\u307e\u3059\u3002\u4f8b\u3048\u3070\u300c\u30b5\u30d6\u30b9\u30af\u3092\u898b\u76f4\u3057\u305f\u3044\u300d\u300c\u56fa\u5b9a\u8cbb\u3092\u4e0b\u3052\u305f\u3044\u300d\u306a\u3069\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002';
}

export default function CfoChatScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { cfoProfile } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');

  const cfoName = cfoProfile?.cfoName || '\u30de\u30cd\u30fc\u306e\u756a\u4eba';
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
      ? '\u9806\u8abf\u3067\u3059'
      : '\u3042\u3068\u00a5' +
        (goalCfYen - netCF).toLocaleString() +
        '\u8db3\u308a\u307e\u305b\u3093';

  const initialMessages: Message[] = [
    {
      role: 'cfo',
      text: `\u3053\u3093\u306b\u3061\u306f\u3001${cfoName}\u3067\u3059\u3002\n\n\u73fe\u5728\u306e\u6708\u9593CF\u306f +\u00a5${netCF.toLocaleString()} \u3067\u3001\u76ee\u6a19\u306e +\u00a5${goalCf}0,000 \u306b\u5bfe\u3057\u3066${status}\u3002\n\n\u307e\u305a3\u3064\u306e\u6539\u5584\u63d0\u6848\u304c\u3042\u308a\u307e\u3059\u3002\u3069\u308c\u306b\u3064\u3044\u3066\u8a73\u3057\u304f\u8a71\u3057\u307e\u3057\u3087\u3046\u304b\uff1f`,
    },
    {
      role: 'cfo',
      text: '\ud83d\udcca \u63d0\u68481: \u30b5\u30d6\u30b9\u30af\u898b\u76f4\u3057\nNetflix + Spotify\u306e\u91cd\u8907\u3092\u6574\u7406\u3059\u308b\u3068\u6708 \u00a5980\u301c\u00a51,490 \u524a\u6e1b\u3002\n\n\ud83d\udca1 \u63d0\u68482: \u56fa\u5b9a\u8cbb\u4ea4\u6e09\n\u96fb\u6c17\u4ee3\u306e\u30d7\u30e9\u30f3\u5909\u66f4\u3067\u6708 \u00a51,000\u301c\u00a52,000 \u306e\u7bc0\u7d04\u4f59\u5730\u3002\n\n\ud83d\udcc8 \u63d0\u68483: \u526f\u696d\u53ce\u5165\u306e\u5b89\u5b9a\u5316\n\u6708 \u00a585,000 \u306e\u526f\u696d\u53ce\u5165\u3092\u5b89\u5b9a\u3055\u305b\u308b\u305f\u3081\u3001\u8907\u6570\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u5316\u3092\u63a8\u5968\u3002',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const suggestions = [
    '\u30b5\u30d6\u30b9\u30af\u3092\u898b\u76f4\u3057\u305f\u3044',
    '\u56fa\u5b9a\u8cbb\u3092\u4e0b\u3052\u305f\u3044',
    '\u526f\u696d\u3092\u5b89\u5b9a\u3055\u305b\u305f\u3044',
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
            label: '\u76ee\u6a19',
            onPress: () => router.push('/settings'),
          }}
        />

        {/* Goal summary bar */}
        <View style={styles.goalBar}>
          <View style={[styles.goalPill, { backgroundColor: colors.bg2 }]}>
            <Text style={[styles.goalLabel, { color: colors.t2 }]}>
              {'\u76ee\u6a19\u8cc7\u7523'}
            </Text>
            <Text style={[styles.goalValue, { color: colors.blue }]}>
              {goalA}\u4e07
            </Text>
          </View>
          <View style={[styles.goalPill, { backgroundColor: colors.bg2 }]}>
            <Text style={[styles.goalLabel, { color: colors.t2 }]}>
              {'\u6708\u9593CF'}
            </Text>
            <Text style={[styles.goalValue, { color: colors.green }]}>
              +{goalCf}\u4e07
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
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: colors.blue },
                      ]}
                    >
                      <View
                        style={[
                          styles.avatarOverlay,
                          { backgroundColor: colors.purple, opacity: 0.5 },
                        ]}
                      />
                      <Text style={styles.avatarEmoji}>{'\ud83e\udde0'}</Text>
                    </View>
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
            placeholder={`${cfoName}\u306b\u8cea\u554f\u3059\u308b...`}
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
                backgroundColor: hasInput ? colors.blue : colors.blue + '55',
              },
            ]}
            onPress={() => sendMessage(input)}
            disabled={!hasInput}
          >
            <Text style={styles.sendArrow}>{'\u2191'}</Text>
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
    marginVertical: 8,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goalLabel: {
    fontSize: 13,
  },
  goalValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
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
    fontSize: 16,
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
    lineHeight: 21,
  },
  suggestionsBar: {
    maxHeight: 44,
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 8,
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
