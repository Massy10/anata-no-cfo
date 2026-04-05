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

  const cfoName = cfoProfile?.cfoName || '\u30de\u30cd\u30fc\u306e\u756a\u4eba';
  const goalAsset = cfoProfile?.goalAsset ?? 1000;
  const goalCf = cfoProfile?.goalCf ?? 10;
  const displayName = user?.display_name || 'MASASHI';
  const email = user?.email || 'masashi@example.com';
  const plan = user?.plan || 'free';
  const initial = displayName.charAt(0).toUpperCase();

  const appearanceModes: { key: AppearanceMode; icon: string; label: string }[] = [
    { key: 'light', icon: '\u2600\ufe0f', label: '\u30e9\u30a4\u30c8' },
    { key: 'dark', icon: '\ud83c\udf19', label: '\u30c0\u30fc\u30af' },
    { key: 'system', icon: '\ud83d\udcf1', label: '\u30b7\u30b9\u30c6\u30e0\u3068\u540c\u3058' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* A. LargeTitle */}
        <LargeTitle title="\u8a2d\u5b9a" />

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
              {'Pro \u306b\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9'}
            </Text>
            <Text style={[styles.proDesc, { color: colors.t2 }]}>
              {'CFO\u30c1\u30e3\u30c3\u30c8100\u56de/\u6708\u30fb12\u30f6\u6708\u4e88\u6e2c\u30fbOCR\u7121\u5236\u9650\u30fb\u5e83\u544a\u975e\u8868\u793a'}
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
                  {'\u00a5300/\u6708'}
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
                    {'\u00a53,000/\u5e74'}
                  </Text>
                  <Text style={styles.priceBtnAnnualSub}>
                    {'2\u30f6\u6708\u5206\u304a\u5f97'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* D. CFO\u8a2d\u5b9a */}
        <SectionCard header={'CFO\u8a2d\u5b9a'}>
          <TableRow
            icon={'\ud83e\udde0'}
            iconBg={colors.purple + '22'}
            title={'CFO\u540d'}
            right={cfoName}
          />
          <TableRow
            icon={'\ud83c\udfaf'}
            iconBg={colors.blue + '22'}
            title={'\u76ee\u6a19\u7dcf\u8cc7\u7523'}
            right={goalAsset.toLocaleString() + '\u4e07\u5186'}
            rightColor={colors.blue}
          />
          <TableRow
            icon={'\ud83d\udcc8'}
            iconBg={colors.green + '22'}
            title={'\u6708\u9593\u76ee\u6a19CF'}
            right={'+' + goalCf + '\u4e07\u5186'}
            rightColor={colors.green}
            last
          />
        </SectionCard>

        {/* E. \u4e00\u822c */}
        <SectionCard header={'\u4e00\u822c'}>
          <TableRow
            icon={'\ud83d\udcb4'}
            iconBg={colors.orange + '22'}
            title={'\u901a\u8ca8'}
            right={'JPY\uff08\u65e5\u672c\u5186\uff09'}
          />
          <TableRow
            icon={'\ud83c\udf10'}
            iconBg={colors.blue + '22'}
            title={'\u8a00\u8a9e'}
            right={'\u65e5\u672c\u8a9e'}
            last
          />
        </SectionCard>

        {/* F. \u5916\u89b3\u30e2\u30fc\u30c9 */}
        <SectionCard header={'\u5916\u89b3\u30e2\u30fc\u30c9'}>
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

        {/* G. \u30c7\u30fc\u30bf */}
        <SectionCard header={'\u30c7\u30fc\u30bf'}>
          <TableRow
            icon={'\u2601\ufe0f'}
            iconBg={colors.cyan + '22'}
            title={'\u30af\u30e9\u30a6\u30c9\u540c\u671f'}
            right={'\u6709\u52b9'}
            rightColor={colors.green}
          />
          <TableRow
            icon={'\ud83d\udce4'}
            iconBg={colors.green + '22'}
            title={'\u30c7\u30fc\u30bf\u30a8\u30af\u30b9\u30dd\u30fc\u30c8'}
            right={'\u5c06\u6765\u5b9f\u88c5'}
            rightColor={colors.t3}
            last
          />
        </SectionCard>

        {/* H. \u30b5\u30dd\u30fc\u30c8 */}
        <SectionCard header={'\u30b5\u30dd\u30fc\u30c8'}>
          <TableRow
            icon={'\ud83d\udcc4'}
            iconBg={colors.t3 + '22'}
            title={'\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc'}
            onPress={() => {}}
          />
          <TableRow
            icon={'\ud83d\udccb'}
            iconBg={colors.t3 + '22'}
            title={'\u5229\u7528\u898f\u7d04'}
            onPress={() => {}}
          />
          <TableRow
            icon={'\ud83d\udcac'}
            iconBg={colors.blue + '22'}
            title={'\u304a\u554f\u3044\u5408\u308f\u305b'}
            onPress={() => {}}
          />
          <TableRow
            icon={'\u2139\ufe0f'}
            iconBg={colors.t3 + '22'}
            title={'\u30d0\u30fc\u30b8\u30e7\u30f3'}
            right="1.0.0"
            rightColor={colors.t3}
            last
          />
        </SectionCard>

        {/* I. \u30ed\u30b0\u30a2\u30a6\u30c8 */}
        <SectionCard>
          <TouchableOpacity
            style={styles.logoutRow}
            activeOpacity={0.5}
            onPress={() => signOut()}
          >
            <Text style={[styles.logoutText, { color: colors.red }]}>
              {'\u30ed\u30b0\u30a2\u30a6\u30c8'}
            </Text>
          </TouchableOpacity>
        </SectionCard>

        {/* J. Footer */}
        <Text style={[styles.footer, { color: colors.t3 }]}>
          {'\u3042\u306a\u305f\u306eCFO v1.0.0'}
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
