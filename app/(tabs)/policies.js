import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { EmptyState, PolicyCard, Screen, SectionTitle, TopBar } from '@/components/CicUI';

export default function PoliciesScreen() {
  const colors = useColors();
  const { policies } = useApp();
return (
  <Screen>
    <TopBar eyebrow="MY COVER" title="Policies" />

    <View
      style={{
        backgroundColor: colors.secondary,
        borderRadius: 19,
        padding: 16,
        marginBottom: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          backgroundColor: colors.card,
          borderRadius: 13,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 16 }}>
          {policies.length}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 14 }}>
          Your cover at a glance
        </Text>
        <Text
          style={{
            color: colors.mutedForeground,
            fontFamily: 'Inter_400Regular',
            fontSize: 12,
            marginTop: 3,
          }}
        >
          Keep your policy details close when you need them.
        </Text>
      </View>
    </View>

    <SectionTitle title="All policies" />

    {policies.length ? (
      policies.map((policy) => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          onPress={() => router.push(`/policy/${policy.id}`)}
        />
      ))
    ) : (
      <EmptyState
        icon="shield-off"
        title="No policies yet"
        body="Choose a simple cover plan to protect your income and family."
        action="Explore cover"
        onAction={() => router.push('/cover')}
      />
    )}
  </Screen>
);
}
