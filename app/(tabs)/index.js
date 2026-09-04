import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PolicyCard, Screen, SectionTitle, StatusPill, TopBar } from '@/components/CicUI';

export default function HomeScreen() {
  const colors = useColors();
  const { user, policies, claims, signOut } = useApp();
  const activePolicy = policies.find((policy) => policy.status === 'Active');
  const firstName = user?.name?.split(' ')[0] || 'there';
  return (
    <Screen>
      <TopBar eyebrow="CIC MICRO-SHIELD" title={`Hello, ${firstName}`} onPress={() => { signOut(); router.replace('/sign-in'); }} icon="log-out" />
      <View style={{ backgroundColor: colors.navy, borderRadius: 24, padding: 21, marginBottom: 25, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 14 }}>
            <Text style={{ color: colors.gold, fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.2 }}>YOUR SAFETY NET</Text>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 30, marginTop: 9, letterSpacing: -0.6 }}>Protection that keeps you moving.</Text>
          </View>
          <View style={{ width: 43, height: 43, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}><Feather name="shield" size={22} color="#FFFFFF" /></View>
        </View>
        <Text style={{ color: '#B9C1BD', fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 15, maxWidth: 265 }}>Affordable cover for work, family, and the unexpected.</Text>
        <Pressable onPress={() => router.push('/cover')} accessibilityRole="button" style={({ pressed }) =>
         ({ 
          backgroundColor: colors.gold, 
          borderRadius: 14, 
          paddingVertical: 13, 
          paddingHorizontal: 15, 
          alignSelf: 'flex-start',
          marginTop: 19, 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: 8, 
          opacity: pressed ? 0.78 : 1
           })}>
            <Text style={{ color: colors.navy, fontFamily: 'Inter_700Bold', fontSize: 13 }}>Explore cover</Text>
            <Feather name="arrow-up-right" size={16} color={colors.navy} />
            </Pressable>
      </View>

      <SectionTitle title="Your protection" action="View all" onAction={() => router.push('/policies')} />
      {activePolicy ? <PolicyCard policy={activePolicy} onPress={() => router.push(`/policy/${activePolicy.id}`)} /> : <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', marginBottom: 20 }}>You do not have an active policy yet.</Text>}

      <SectionTitle title="Quick actions" />
      <View style={{ flexDirection: 'row', gap: 11, marginBottom: 26 }}>
        <Pressable onPress={() => router.push('/claim/new')} accessibilityRole="button" style={({ pressed }) => [{ flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 15, opacity: pressed ? 0.72 : 1 }]}>
          <View style={{ width: 35, height: 35, borderRadius: 12, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 13 }}><Feather name="file-plus" size={17} color={colors.primary} /></View>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 13 }}>Report a claim</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 }}>We’re here to help</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/cover')} accessibilityRole="button" style={({ pressed }) => [{ flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 15, opacity: pressed ? 0.72 : 1 }]}>
          <View style={{ width: 35, height: 35, borderRadius: 12, backgroundColor: colors.warningSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 13 }}><Feather name="plus-circle" size={17} color={colors.warning} /></View>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 13 }}>Get more cover</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 }}>From KSh 2,000/year</Text>
        </Pressable>
      </View>

      <SectionTitle title="Claim activity" action="See claims" onAction={() => router.push('/claims')} />
      {claims.length ? (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 19,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 15,
          }}
        >
          {claims.slice(0, 2).map((claim) => (
            <Pressable
              key={claim.id}
              onPress={() => router.push(`/claim/${claim.id}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: claim.id === claims[claims.length - 1]?.id ? 0 : 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 11,
                  backgroundColor: colors.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Feather name="activity" size={16} color={colors.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
                  {claim.title}
                </Text>
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 11,
                    marginTop: 3,
                  }}
                >
                  {claim.id} · {claim.updatedAt}
                </Text>
              </View>

              <StatusPill status={claim.status} />
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }}>
          No claim activity yet.
        </Text>
      )}    
</Screen>
  );
}
