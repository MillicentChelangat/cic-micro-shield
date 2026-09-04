import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true, contentStyle, refreshControl }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const style = [styles.screenContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 108 : 104) }, contentStyle];
  if (!scroll) return <View style={[styles.screen, { backgroundColor: colors.background }]}>{children}</View>;
  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={style} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" refreshControl={refreshControl}>
      {children}
    </ScrollView>
  );
}

export function BrandMark({ compact = false }) {
  const colors = useColors();
  return (
    <View style={[styles.brandMark, compact && styles.brandMarkCompact, { backgroundColor: colors.primary }]}>
      <Feather name="shield" size={compact ? 16 : 23} color={colors.primaryForeground} strokeWidth={2.4} />
      <View style={[styles.brandDot, { backgroundColor: colors.gold }]} />
    </View>
  );
}

export function TopBar({ eyebrow, title, onPress, icon = 'user' }) {
  const colors = useColors();
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarCopy}>
        {!!eyebrow && <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text>}
        <Text style={[styles.topTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {onPress && (
        <Pressable onPress={() => { Haptics.selectionAsync(); onPress(); }} accessibilityRole="button" accessibilityLabel="Open profile" style={({ pressed }) => [styles.profileButton, { backgroundColor: colors.secondary, opacity: pressed ? 0.72 : 1 }]}>
          <Feather name={icon} size={18} color={colors.foreground} />
        </Pressable>
      )}
    </View>
  );
}

export function SectionTitle({ title, action, onAction }) {
  const colors = useColors();
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.sectionHeading, { color: colors.foreground }]}>{title}</Text>
      {action && <Pressable onPress={onAction} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}><Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text></Pressable>}
    </View>
  );
}

export function PrimaryButton({ title, onPress, icon = 'arrow-right', disabled = false }) {
  const colors = useColors();
  return (
    <Pressable onPress={() => { if (!disabled) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onPress(); } }} disabled={disabled} accessibilityRole="button" style={({ pressed }) => [styles.primaryButton, { backgroundColor: disabled ? colors.muted : colors.primary, opacity: pressed ? 0.82 : 1 }]}>
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{title}</Text>
      {!!icon && <Feather name={icon} size={17} color={colors.primaryForeground} />}
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, icon }) {
  const colors = useColors();
  return (
    <Pressable onPress={() => { Haptics.selectionAsync(); onPress(); }} accessibilityRole="button" style={({ pressed }) => [styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.72 : 1 }]}>
      {!!icon && <Feather name={icon} size={16} color={colors.foreground} />}
      <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, placeholder, error, secureTextEntry, keyboardType = 'default', maxLength, multiline }) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.inkSoft }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} secureTextEntry={secureTextEntry} keyboardType={keyboardType} maxLength={maxLength} multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} autoCapitalize="none" style={[styles.field, { color: colors.foreground, backgroundColor: colors.card, borderColor: error ? colors.primary : colors.input }, multiline && styles.multilineField]} accessibilityLabel={label} />
      {!!error && <Text style={[styles.fieldError, { color: colors.primary }]}>{error}</Text>}
    </View>
  );
}

export function StatusPill({ status }) {
  const colors = useColors();
  const approved = status === 'Approved' || status === 'Active';
  const warning = status === 'Expiring soon' || status === 'In Review';
  const backgroundColor = approved ? colors.successSoft : warning ? colors.warningSoft : colors.secondary;
  const color = approved ? colors.success : warning ? colors.warning : colors.inkSoft;
  return <View style={[styles.statusPill, { backgroundColor }]}><View style={[styles.statusDot, { backgroundColor: color }]} /><Text style={[styles.statusText, { color }]}>{status}</Text></View>;
}

export function PolicyCard({ policy, onPress }) {
  const colors = useColors();
  return (
    <Pressable onPress={() => { Haptics.selectionAsync(); onPress(); }} accessibilityRole="button" accessibilityLabel={`View ${policy.name}`} style={({ pressed }) => [styles.policyCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.76 : 1 }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: colors.secondary }]}><Feather name={policy.planId === 'trader' ? 'shopping-bag' : 'truck'} size={20} color={colors.primary} /></View>
        <StatusPill status={policy.status} />
      </View>
      <Text style={[styles.policyName, { color: colors.foreground }]}>{policy.name}</Text>
      <Text style={[styles.policyMeta, { color: colors.mutedForeground }]}>{policy.id}  ·  Renews {policy.endDate}</Text>
      <View style={styles.cardFooter}>
        <View><Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>Annual premium</Text><Text style={[styles.premium, { color: colors.foreground }]}>KSh {policy.premium.toLocaleString()}</Text></View>
        <View style={[styles.arrowCircle, { backgroundColor: colors.secondary }]}><Feather name="arrow-up-right" size={17} color={colors.foreground} /></View>
      </View>
    </Pressable>
  );
}

export function ClaimRow({ claim, policyName, onPress }) {
  const colors = useColors();
  return (
    <Pressable onPress={() => { Haptics.selectionAsync(); onPress(); }} accessibilityRole="button" accessibilityLabel={`View claim ${claim.id}`} style={({ pressed }) => [styles.claimRow, { borderBottomColor: colors.border, opacity: pressed ? 0.68 : 1 }]}>
      <View style={[styles.claimIcon, { backgroundColor: colors.secondary }]}><Feather name="file-text" size={18} color={colors.primary} /></View>
      <View style={styles.claimCopy}><Text style={[styles.claimTitle, { color: colors.foreground }]}>{claim.title}</Text><Text style={[styles.claimMeta, { color: colors.mutedForeground }]}>{policyName}  ·  {claim.id}</Text></View>
      <StatusPill status={claim.status} />
    </Pressable>
  );
}

export function EmptyState({ icon = 'inbox', title, body, action, onAction }) {
  const colors = useColors();
  return <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={23} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>{body}</Text>{action && <SecondaryButton title={action} onPress={onAction} icon="plus" />}</View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  screenContent: { paddingHorizontal: 20 },
  brandMark: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  brandMarkCompact: { width: 36, height: 36, borderRadius: 12 },
  brandDot: { width: 7, height: 7, borderRadius: 4, position: 'absolute', right: 10, top: 9 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  topBarCopy: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.5, marginBottom: 6 },
  topTitle: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.6 },
  profileButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionHeading: { fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: -0.3 },
  sectionAction: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  primaryButton: { minHeight: 54, borderRadius: 17, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  secondaryButton: { minHeight: 48, borderRadius: 15, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  fieldWrap: { marginBottom: 17 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 8 },
  field: { height: 52, borderRadius: 15, borderWidth: 1, paddingHorizontal: 15, fontFamily: 'Inter_500Medium', fontSize: 15 },
  multilineField: { height: 126, paddingTop: 14 },
  fieldError: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 6 },
  statusPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  policyCard: { borderRadius: 21, borderWidth: 1, padding: 17, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  policyName: { fontFamily: 'Inter_700Bold', fontSize: 17, marginBottom: 6 },
  policyMeta: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18 },
  smallLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, marginBottom: 3 },
  premium: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  arrowCircle: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  claimRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, gap: 11 },
  claimIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  claimCopy: { flex: 1 },
  claimTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 4 },
  claimMeta: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  emptyState: { borderRadius: 20, borderWidth: 1, padding: 26, alignItems: 'center' },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 7 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 18 },
});
