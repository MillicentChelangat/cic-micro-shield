import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { PrimaryButton, Screen, StatusPill } from '@/components/CicUI';

export default function ClaimDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams();
  const { claims, policies, advanceClaim } = useApp();
  const claim = claims.find((item) => item.id === id);
  const policy = policies.find((item) => item.id === claim?.policyId);
  if (!claim) return <Screen><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 21 }}>Claim not found</Text></Screen>;
  const nextAction = claim.status === 'Pending' ? 'Move to review' : claim.status === 'In Review' ? 'Mark as approved' : null;
return (
  <Screen>
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 24 }}
    >
      <Feather name="arrow-left" size={18} color={colors.foreground} />
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
        Back
      </Text>
    </Pressable>

    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 9,
      }}
    >
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -0.6 }}>
        Claim {claim.id}
      </Text>
      <StatusPill status={claim.status} />
    </View>

    <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, marginBottom: 23 }}>
      {policy?.name || 'CIC policy'} · Submitted {claim.createdAt}
    </Text>

    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 21,
        padding: 18,
        marginBottom: 23,
      }}
    >
      <Text style={{ color: colors.inkSoft, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 8 }}>
        Your description
      </Text>
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 }}>
        {claim.description}
      </Text>

      {claim.photoUri && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 15 }}>
          <Feather name="paperclip" size={14} color={colors.success} />
          <Text style={{ color: colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>
            Photo attached
          </Text>
        </View>
      )}
    </View>

    <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 16 }}>
      Claim journey
    </Text>

    <View style={{ marginLeft: 5, marginBottom: 24 }}>
      {claim.timeline.map((item, index) => (
        <View key={item.label} style={{ flexDirection: 'row', minHeight: 62 }}>
          <View style={{ alignItems: 'center', width: 30 }}>
            {index < claim.timeline.length - 1 && (
              <View
                style={{
                  position: 'absolute',
                  top: 22,
                  bottom: -2,
                  width: 2,
                  backgroundColor: item.complete ? colors.success : colors.border,
                }}
              />
            )}
            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 13,
                backgroundColor: item.complete ? colors.success : colors.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              {item.complete ? (
                <Feather name="check" size={14} color="#FFFFFF" />
              ) : (
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.mutedForeground }} />
              )}
            </View>
          </View>

          <View style={{ paddingLeft: 12, paddingTop: 2 }}>
            <Text
              style={{
                color: item.complete ? colors.foreground : colors.mutedForeground,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 14,
              }}
            >
              {item.label}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 }}>
              {item.date}
            </Text>
          </View>
        </View>
      ))}
    </View>

    {nextAction ? (
      <PrimaryButton title={nextAction} onPress={() => advanceClaim(claim.id)} icon="arrow-right" />
    ) : (
      <View
        style={{
          backgroundColor: colors.successSoft,
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Feather name="check-circle" size={20} color={colors.success} />
        <Text style={{ color: colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 }}>
          Your claim has been approved. We’ll be in touch with the next steps.
        </Text>
      </View>
    )}

    <Text
      style={{
        color: colors.mutedForeground,
        fontFamily: 'Inter_400Regular',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 14,
      }}
    >
      Demo control: advance the status to show the full customer journey.
    </Text>
  </Screen>
);
}
