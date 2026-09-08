import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { BrandMark, Field, PrimaryButton } from '@/components/CicUI';
import { useApp } from '@/context/AppContext';

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, register } = useApp();
  const [mode, setMode] = useState('signIn');
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
  const nextErrors = {};

  if (mode === 'register' && name.trim().length < 2) {
    nextErrors.name = 'Enter your full name';
  }

  if (mode === 'register' && nationalId.trim().length < 4) {
    nextErrors.nationalId = 'Enter your national ID';
  }

  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    nextErrors.email = 'Enter a valid email address';
  }

  if (password.length < 8) {
    nextErrors.password = 'Password must be at least 8 characters';
  }

  if (mode === 'register' && password !== confirmPassword) {
    nextErrors.confirmPassword = 'Passwords do not match';
  }

  setErrors(nextErrors);
  setAuthError('');

  if (Object.keys(nextErrors).length) return;

  setBusy(true);

  try {
    if (mode === 'register') {
      const result = await register(
        name.trim(),
        nationalId.trim(),
        email.trim().toLowerCase(),
        password,
      );

      if (!result.session) {
        setAuthError(
          'Account created. Check your email before signing in.',
        );
        return;
      }
    } else {
      await signIn(email.trim().toLowerCase(), password);
    }

    router.replace('/(tabs)');
  } catch (error) {
    setAuthError(
      error?.message || 'We could not complete authentication.',
    );
  } finally {
    setBusy(false);
  }
};

  return (
    <KeyboardAwareScrollViewCompat bottomOffset={70} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: insets.top + 42, paddingBottom: insets.bottom + 28, paddingHorizontal: 24, flexGrow: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <BrandMark />
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 34, lineHeight: 39, letterSpacing: -1.2, marginTop: 28, maxWidth: 310 }}>{mode === 'signIn' ? 'Cover for the life you’re building.' : 'Start your protection journey.'}</Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 13, maxWidth: 325 }}>{mode === 'signIn' ? 'Simple, affordable insurance for the moments that matter.' : 'Create your CIC Micro-Shield account in under a minute.'}</Text>

        <View style={{ marginTop: 38 }}>
          {mode === 'register' && (
            <Field
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Samuel Kamau"
              error={errors.name}
            />
          )}

          {mode === 'register' && (
            <Field
              label="National ID"
              value={nationalId}
              onChangeText={setNationalId}
              placeholder="e.g. 12345678"
              error={errors.nationalId}
              keyboardType="number-pad"
            />
          )}

          <Field
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. customer@example.com"
            error={errors.email}
            keyboardType="email-address"
          />

          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            error={errors.password}
            secureTextEntry
          />

          {mode === 'register' && (
            <Field
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              secureTextEntry
            />
          )}
        </View>
        {!!authError && ( <Text style={{ color: colors.primary, fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, marginBottom: 14, }}  > {authError} </Text> )}
        <PrimaryButton title={ busy ? 'Please wait...' : mode === 'signIn' ? 'Sign in securely' : 'Create my account' } onPress={submit} disabled={busy} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 5 }}>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13 }}>{mode === 'signIn' ? 'New to CIC Micro-Shield?' : 'Already have an account?'}</Text>
          <Pressable onPress={() => { setMode(mode === 'signIn' ? 'register' : 'signIn'); setErrors({}); }} accessibilityRole="button"><Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 }}>{mode === 'signIn' ? 'Create account' : 'Sign in'}</Text></Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 27 }}>
          <Feather name="lock" size={13} color={colors.success} />
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>Your session is stored securely on this device</Text>
        </View>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}
