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
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errors, setErrors] = useState({});w

  const submit = () => {
    const nextErrors = {};
    if (mode === 'register' && name.trim().length < 2) nextErrors.name = 'Enter your full name';
    if (!/^07\d{8}$/.test(phone.replace(/\s/g, ''))) nextErrors.phone = 'Use a valid Kenyan number, e.g. 0712345678';
    if (!/^\d{4}$/.test(pin)) nextErrors.pin = 'PIN must be exactly 4 digits';
    if (mode === 'register' && pin !== confirmPin) nextErrors.confirmPin = 'PINs do not match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (mode === 'register') register(name.trim(), phone.replace(/\s/g, ''));
    else signIn(phone.replace(/\s/g, ''));
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAwareScrollViewCompat bottomOffset={70} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: insets.top + 42, paddingBottom: insets.bottom + 28, paddingHorizontal: 24, flexGrow: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <BrandMark />
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 34, lineHeight: 39, letterSpacing: -1.2, marginTop: 28, maxWidth: 310 }}>{mode === 'signIn' ? 'Cover for the life you’re building.' : 'Start your protection journey.'}</Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 13, maxWidth: 325 }}>{mode === 'signIn' ? 'Simple, affordable insurance for the moments that matter.' : 'Create your CIC Micro-Shield account in under a minute.'}</Text>

        <View style={{ marginTop: 38 }}>
          {mode === 'register' && <Field label="Full name" value={name} onChangeText={setName} placeholder="e.g. Samuel Kamau" error={errors.name} />}
          <Field label="Mobile number" value={phone} onChangeText={setPhone} placeholder="0712 345 678" error={errors.phone} keyboardType="phone-pad" maxLength={10} />
          <Field label="4-digit PIN" value={pin} onChangeText={setPin} placeholder="••••" error={errors.pin} secureTextEntry keyboardType="number-pad" maxLength={4} />
          {mode === 'register' && <Field label="Confirm PIN" value={confirmPin} onChangeText={setConfirmPin} placeholder="••••" error={errors.confirmPin} secureTextEntry keyboardType="number-pad" maxLength={4} />}
        </View>
        <PrimaryButton title={mode === 'signIn' ? 'Sign in securely' : 'Create my account'} onPress={submit} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 5 }}>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13 }}>{mode === 'signIn' ? 'New to CIC Micro-Shield?' : 'Already have an account?'}</Text>
          <Pressable onPress={() => { setMode(mode === 'signIn' ? 'register' : 'signIn'); setErrors({}); }} accessibilityRole="button"><Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 }}>{mode === 'signIn' ? 'Create account' : 'Sign in'}</Text></Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 27 }}>
          <Feather name="lock" size={13} color={colors.success} />
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>Your details stay on this device</Text>
        </View>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}
