import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize, spacing } from '@/theme/tokens';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { useAuth } from '@/contexts/AuthContext';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

let BlurView: React.ComponentType<any> | null = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch {
  BlurView = null;
}

type AppearanceMode = 'light' | 'dark' | 'system';

function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M3 8L6.5 11.5L13 4.5"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, appearanceMode, setAppearanceMode, signOut, cfoProfile } =
    useAuth();

  const cfoName = cfoProfile?.cfoName || 'マネーの番人';
  const goalAsset = cfoProfile?.goalAsset ?? 1000;
  const goalCf = cfoProfile?.goalCf ?? 10;
  const displayName = user?.display_name || 'MASASHI';
  const email = user?.email || 'masashi@example.com';
  const plan = user?.plan || 'free';
  const initial = displayName.charAt(0).toUpperCase();

  const appearanceModes: { key: AppearanceMode; icon: string; label: string }[] = [
    { key: 'light', icon: '☀️', label: 'ライト' },
    { key: 'dark', icon: '🌙', label: 'ダーク' },
    { key: 'system', icon: '📱', label: 'システムと同じ' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* A. LargeTitle */}
        <LargeTitle title="設定" />

        {/* B. Profile Section */}
        <SectionCard>
          <TouchableOpacity style={styles.profileRow} activeOpacity={0.5}>
            <LinearGradient
              colors={[colors.blue, colors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarCircle}
            >
              <Text style={styles.avatarInitial}>{initial}</Text>
            </LinearGradient>
            <View style={styles.profileCenter}>
              <Text style={[styles.profileName, { color: colors.t1 }]}>
                {displayName}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.t2 }]}>
                {email}
              </Text>
            </View>
            <View style={styles.planSection}>
              <Text style={[styles.planText, { color: colors.t2 }]}>
                {plan === 'pro' ? 'Pro' : 'Free'}
              </Text>
            </View>
            <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
              <Path d="M1 1L7 7L1 13" stroke={colors.t3} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </SectionCard>

        {/* C. Pro Upgrade Card */}
        <View style={styles.proCardOuter}>
          <LinearGradient
            colors={[colors.blue + '12', colors.purple + '08']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.proCard,
              {
                borderColor: colors.blue + '33',
              },
            ]}
          >
            <View
              style={[
                styles.proDecor,
                { backgroundColor: colors.blue + '08' },
              ]}
            />
            <Text style={[styles.proTitle, { color: colors.t1 }]}>
              {'Pro にアップグレード'}
            </Text>
            <Text style={[styles.proDesc, { color: colors.t2 }]}>
              {'CFOチャット100回/月・12ヶ月予測・OCR無制限・広告非表示'}
            </Text>
            <View style={styles.proPriceRow}>
              <TouchableOpacity
                style={[
                  styles.priceBtn,
                  {
                    backgroundColor: colors.heroGlass as string,
                    borderColor: colors.heroBorder as string,
                    borderWidth: 0.5,
                    overflow: 'hidden',
                  },
                ]}
                activeOpacity={0.7}
              >
                {BlurView && Platform.OS === 'ios' && (
                  <BlurView intensity={8} tint="default" style={StyleSheet.absoluteFill} />
                )}
                <Text style={[styles.priceBtnText, { color: colors.blue }]}>
                  {'¥300/月'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceBtnAnnualWrap}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[colors.blue, colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.priceBtnAnnual}
                >
                  <Text style={styles.priceBtnAnnualText}>
                    {'¥3,000/年'}
                  </Text>
                  <Text style={styles.priceBtnAnnualSub}>
                    {'2ヶ月分お得'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* D. CFO設定 */}
        <SectionCard header={'CFO設定'}>
          <TableRow
            icon={'🧠'}
            iconBg={colors.purple + '22'}
            title={'CFO名'}
            right={cfoName}
          />
          <TableRow
            icon={'🎯'}
            iconBg={colors.blue + '22'}
            title={'目標総資産'}
            right={goalAsset.toLocaleString() + '万円'}
            rightColor={colors.blue}
          />
          <TableRow
            icon={'📈'}
            iconBg={colors.green + '22'}
            title={'月間目標CF'}
            right={'+' + goalCf + '万円'}
            rightColor={colors.green}
            last
          />
        </SectionCard>

        {/* E. 一般 */}
        <SectionCard header={'一般'}>
          <TableRow
            icon={'💴'}
            iconBg={colors.orange + '22'}
            title={'通貨'}
            right={'JPY（日本円）'}
          />
          <TableRow
            icon={'🌐'}
            iconBg={colors.blue + '22'}
            title={'言語'}
            right={'日本語'}
            last
          />
        </SectionCard>

        {/* F. 外観モード */}
        <SectionCard header={'外観モード'}>
          {appearanceModes.map((mode, i) => (
            <TouchableOpacity
              key={mode.key}
              activeOpacity={0.5}
              onPress={() => setAppearanceMode(mode.key)}
            >
              <View
                style={[
                  styles.appearanceRow,
                  i < appearanceModes.length - 1 && {
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.sep,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: colors.purple + '22' },
                  ]}
                >
                  <Text style={styles.iconEmoji}>{mode.icon}</Text>
                </View>
                <Text style={[styles.appearanceLabel, { color: colors.t1 }]}>
                  {mode.label}
                </Text>
                <View style={styles.appearanceRight}>
                  {appearanceMode === mode.key && (
                    <CheckIcon color={colors.blue} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </SectionCard>

        {/* G. データ */}
        <SectionCard header={'データ'}>
          <TableRow
            icon={'☁️'}
            iconBg={colors.cyan + '22'}
            title={'クラウド同期'}
            right={'有効'}
            rightColor={colors.green}
          />
          <TableRow
            icon={'📤'}
            iconBg={colors.green + '22'}
            title={'データエクスポート'}
            right={'将来実装'}
            rightColor={colors.t3}
            last
          />
        </SectionCard>

        {/* H. サポート */}
        <SectionCard header={'サポート'}>
          <TableRow
            icon={'📄'}
            iconBg={colors.t3 + '22'}
            title={'プライバシーポリシー'}
            onPress={() => {}}
          />
          <TableRow
            icon={'📋'}
            iconBg={colors.t3 + '22'}
            title={'利用規約'}
            onPress={() => {}}
          />
          <TableRow
            icon={'💬'}
            iconBg={colors.blue + '22'}
            title={'お問い合わせ'}
            onPress={() => {}}
          />
          <TableRow
            icon={'ℹ️'}
            iconBg={colors.t3 + '22'}
            title={'バージョン'}
            right="1.0.0"
            rightColor={colors.t3}
            last
          />
        </SectionCard>

        {/* I. ログアウト */}
        <SectionCard>
          <TouchableOpacity
            style={styles.logoutRow}
            activeOpacity={0.5}
            onPress={() => signOut()}
          >
            <Text style={[styles.logoutText, { color: colors.red }]}>
              {'ログアウト'}
            </Text>
          </TouchableOpacity>
        </SectionCard>

        {/* J. Footer */}
        <Text style={[styles.footer, { color: colors.t3 }]}>
          {'あなたのCFO v1.0.0'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.screenPaddingBottom,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 14,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileCenter: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  planSection: {
    marginRight: 6,
    alignItems: 'flex-end',
  },
  planText: {
    fontSize: 13,
  },
  proCardOuter: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  proCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  proDecor: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  proTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  proDesc: {
    fontSize: 13,
    lineHeight: 20.8,
    marginBottom: 16,
  },
  proPriceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  priceBtnText: {
    fontSize: 17,
    fontWeight: '600',
  },
  priceBtnAnnualWrap: {
    flex: 1,
  },
  priceBtnAnnual: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  priceBtnAnnualText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  priceBtnAnnualSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  appearanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.rowMinHeight,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 16,
  },
  appearanceLabel: {
    fontSize: fontSize.body,
    flex: 1,
  },
  appearanceRight: {
    width: 24,
    alignItems: 'center',
  },
  logoutRow: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing.rowMinHeight,
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 17,
  },
  footer: {
    fontSize: 13,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
});
