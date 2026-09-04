import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { ClaimRow, EmptyState, PrimaryButton, Screen, SectionTitle, TopBar } from '@/components/CicUI';

export default function ClaimsScreen() {
  const colors = useColors();
  const { claims, policies } = useApp();
  const policyName = (id) => policies.find((policy) => policy.id === id)?.name || 'CIC policy';
  return (
  <Screen>
    <TopBar eyebrow="SUPPORT WHEN IT COUNTS" title="Claims" />

    <View
      style={{
        backgroundColor: colors.navy,
        borderRadius: 21,
        padding: 19,
        marginBottom: 26,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
        <View
          style={{
            width: 39,
            height: 39,
            borderRadius: 13,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="headphones" size={18} color="#FFFFFF" />
        </View>

        <View>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 15 }}>
            We’ll walk you through it.
          </Text>
          <Text
            style={{
              color: '#B9C1BD',
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              marginTop: 3,
            }}
          >
            Track every step of your claim here.
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/claim/new')}
        accessibilityRole="button"
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: colors.gold,
          borderRadius: 13,
          paddingVertical: 12,
          marginTop: 17,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text style={{ color: colors.navy, fontFamily: 'Inter_700Bold', fontSize: 13 }}>
          Start a new claim
        </Text>
        <Feather name="plus" size={16} color={colors.navy} />
      </Pressable>
    </View>

    <SectionTitle title="Your claims" />

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
        {claims.map((claim) => (
          <ClaimRow
            key={claim.id}
            claim={claim}
            policyName={policyName(claim.policyId)}
            onPress={() => router.push(`/claim/${claim.id}`)}
          />
        ))}
      </View>
    ) : (
      <EmptyState
        icon="file-text"
        title="No claims yet"
        body="If something happens, start a claim and we’ll help you through the next steps."
        action="Start a claim"
        onAction={() => router.push('/claim/new')}
      />
    )}
  </Screen>
);
}