import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { Field, PrimaryButton } from '@/components/CicUI';

export default function NewClaimScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { policyId } = useLocalSearchParams();
  const { policies, addClaim } = useApp();
  const [selectedPolicy, setSelectedPolicy] = useState(policyId || policies[0]?.id || '');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true });
    if (!result.canceled) setPhotoUri(result.assets[0]?.uri || null);
  };
  const submit = async () => {
    setSubmitError('');

    if (!selectedPolicy) {
      setError('Select the policy this claim is for');
      return;
    }

    if (description.trim().length < 15) {
      setError('Add a few more details so we can help you faster');
      return;
    }

    setSubmitting(true);

    try {
      const claim = await addClaim({
        policyId: selectedPolicy,
        description: description.trim(),
        photoUri,
      });

      router.replace(`/claim/${claim.id}`);
    } catch (error) {
      setSubmitError(
        error?.message || 'We could not submit your claim.',
      );
    } finally {
      setSubmitting(false); 
    }
  };
  return (
    <KeyboardAwareScrollViewCompat
      bottomOffset={80}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 35,
        paddingHorizontal: 20,
        backgroundColor: colors.background,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 23 }}
      >
        <Feather name="arrow-left" size={18} color={colors.foreground} />
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
          Back
        </Text>
      </Pressable>

      <Text
        style={{
          color: colors.foreground,
          fontFamily: 'Inter_700Bold',
          fontSize: 29,
          letterSpacing: -0.7,
        }}
      >
        Tell us what happened.
      </Text>

      <Text
        style={{
          color: colors.mutedForeground,
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          lineHeight: 20,
          marginTop: 9,
          marginBottom: 27,
        }}
      >
        Share a few details and the CIC team will review your claim.
      </Text>

      <Text
        style={{
          color: colors.inkSoft,
          fontFamily: 'Inter_600SemiBold',
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        Policy
      </Text>

      {policies.map((policy) => {
        const active = selectedPolicy === policy.id;
        return (
          <Pressable
            key={policy.id}
            onPress={() => setSelectedPolicy(policy.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: active ? 2 : 1,
              borderColor: active ? colors.primary : colors.border,
              borderRadius: 15,
              padding: 13,
              marginBottom: 9,
              backgroundColor: active ? colors.dangerSoft : colors.card,
            }}
          >
            <View
              style={{
                width: 33,
                height: 33,
                borderRadius: 11,
                backgroundColor: active ? colors.primary : colors.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Feather name="shield" size={15} color={active ? '#FFFFFF' : colors.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
                {policy.name}
              </Text>
              <Text
                style={{
                  color: colors.mutedForeground,
                  fontFamily: 'Inter_400Regular',
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {policy.id}
              </Text>
            </View>

            {active && <Feather name="check-circle" size={19} color={colors.primary} />}
          </Pressable>
        );
      })}

      <View style={{ marginTop: 15 }}>
        <Field
          label="What happened?"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setError('');
          }}
          placeholder="Describe the incident, when it happened, and where..."
          error={error}
          multiline
        />
      </View>

      <Pressable
        onPress={choosePhoto}
        accessibilityRole="button"
        style={({ pressed }) => ({
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: photoUri ? colors.success : colors.input,
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 11,
          marginBottom: 22,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: photoUri ? colors.successSoft : colors.secondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather
            name={photoUri ? 'check' : 'image'}
            size={17}
            color={photoUri ? colors.success : colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
            {photoUri ? 'Photo attached' : 'Attach a photo'}
          </Text>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: 'Inter_400Regular',
              fontSize: 11,
              marginTop: 3,
            }}
          >
            {photoUri ? 'Tap to choose a different photo' : 'Optional, but it can speed up review'}
          </Text>
        </View>

        <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
      </Pressable>

      {!!submitError && (
        <Text
          style={{
            color: colors.primary,
            fontFamily: 'Inter_500Medium',
            fontSize: 13,
            lineHeight: 19,
            marginBottom: 12,
          }}
        >
          {submitError}
        </Text>
      )}

      <PrimaryButton
        title={submitting ? 'Submitting...' : 'Submit claim'}
        onPress={submit}
        icon="send"
        disabled={submitting}
      />
    </KeyboardAwareScrollViewCompat>
  );
}
