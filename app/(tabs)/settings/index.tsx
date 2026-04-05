import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { radius, fontSize, spacing } from '@/theme/tokens';
import { LargeTitle } from '@/components/ui/LargeTitle';
import { SectionCard } from '@/components/ui/SectionCard';
import { TableRow } from '@/components/ui/TableRow';
import { useAuth } from '@/contexts/AuthContext';
import Svg, { Path } from 'react-native-svg';

type AppearanceMode = 'light' | 'dark' | 'system';

function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path
        d="M3 9.5L7 13.5L15 4.5"
        stroke={color}
        strokeWidth={2}
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
            <View style={[styles.avatarCircle, { backgroundColor: colors.blue }]}>
              <View
                style={[
                  styles.avatarOverlay,
                  { backgroundColor: colors.purple, opacity: 0.5 },
                ]}
              />
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
            <View style={styles.profileCenter}>
              <Text style={[styles.profileName, { color: colors.t1 }]}>
                {displayName}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.t2 }]}>
                {email}
              </Text>
            </View>
            <View style={[styles.planBadge, { backgroundColor: colors.bg3 }]}>
              <Text style={[styles.planBadgeText, { color: colors.t2 }]}>
                {plan === 'pro' ? 'Pro' : 'Free'}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.t3 }]}>{'\u203a'}</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* C. Pro Upgrade Card */}
        <View style={styles.proCardOuter}>
          <View
            style={[
              styles.proCard,
              {
                backgroundColor: colors.blue + '12',
                borderColor: colors.blue + '33',
              },
            ]}
          >
            <View
              style={[
                styles.proDecor,
                { backgroundColor: colors.blue + '0D' },
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
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.priceBtnText, { color: colors.blue }]}>
                  {'\u00a5300/\u6708'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priceBtn, styles.priceBtnAnnual]}
                activeOpacity={0.7}
              >
                <Text style={styles.priceBtnAnnualText}>
                  {'\u00a53,000/\u5e74'}
                </Text>
                <Text style={styles.priceBtnAnnualSub}>
                  {'2\u30f6\u6708\u5206\u304a\u5f97'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* D. CFO\u8a2d\u5b9a */}
        <SectionCard header={'CFO\u8a2d\u5b9a'}>
          <TableRow
            icon={'\ud83e\udde0'}
            iconBg={colors.purple + '21'}
            title={'CFO\u540d'}
            right={cfoName}
          />
          <TableRow
            icon={'\ud83c\udfaf'}
            iconBg={colors.blue + '21'}
            title={'\u76ee\u6a19\u7dcf\u8cc7\u7523'}
            right={goalAsset.toLocaleString() + '\u4e07\u5186'}
            rightColor={colors.blue}
          />
          <TableRow
            icon={'\ud83d\udcc8'}
            iconBg={colors.green + '21'}
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
            iconBg={colors.orange + '21'}
            title={'\u901a\u8ca8'}
            right={'JPY\uff08\u65e5\u672c\u5186\uff09'}
          />
          <TableRow
            icon={'\ud83c\udf10'}
            iconBg={colors.blue + '21'}
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
                    { backgroundColor: colors.purple + '21' },
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
            iconBg={colors.cyan + '21'}
            title={'\u30af\u30e9\u30a6\u30c9\u540c\u671f'}
            right={'\u6709\u52b9'}
            rightColor={colors.green}
          />
          <TableRow
            icon={'\ud83d\udce4'}
            iconBg={colors.green + '21'}
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
            iconBg={colors.bg3}
            title={'\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc'}
            onPress={() => {}}
          />
          <TableRow
            icon={'\ud83d\udccb'}
            iconBg={colors.bg3}
            title={'\u5229\u7528\u898f\u7d04'}
            onPress={() => {}}
          />
          <TableRow
            icon={'\ud83d\udcac'}
            iconBg={colors.blue + '21'}
            title={'\u304a\u554f\u3044\u5408\u308f\u305b'}
            onPress={() => {}}
          />
          <TableRow
            icon={'\u2139\ufe0f'}
            iconBg={colors.bg3}
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
    padding: 16,
    minHeight: 44,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    zIndex: 1,
  },
  profileCenter: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  planBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  planBadgeText: {
    fontSize: 13,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 4,
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
    fontWeight: '700',
    marginBottom: 6,
  },
  proDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  proPriceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priceBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  priceBtnText: {
    fontSize: 17,
    fontWeight: '700',
  },
  priceBtnAnnual: {
    backgroundColor: '#007AFF',
  },
  priceBtnAnnualText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceBtnAnnualSub: {
    fontSize: 11,
    color: '#FFFFFFCC',
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
    width: spacing.rowIconSize,
    height: spacing.rowIconSize,
    borderRadius: radius.icon,
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
    fontSize: fontSize.body,
    fontWeight: '500',
  },
  footer: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
});
