import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { PrimaryButton } from '@/components/CicUI';

export function PaymentSimulationModal({ visible, phoneNumber, amount, onSuccess, onClose }) {
  const colors = useColors();
  const [stage, setStage] = useState('loading');

  useEffect(() => {
    if (!visible) return;

    setStage('loading');

    const timer = setTimeout(() => {
      const paymentSucceeded = Math.random() > 0.2;
      setStage(paymentSucceeded ? 'success' : 'failed');
    }, 2200);

    return () => clearTimeout(timer);
  }, [visible]);

  const handleRetry = () => {
    setStage('loading');
    const timer = setTimeout(() => {
      const paymentSucceeded = Math.random() > 0.2;
      setStage(paymentSucceeded ? 'success' : 'failed');
    }, 2200);
    return () => clearTimeout(timer);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: colors.card, borderRadius: 24, padding: 28, alignItems: 'center' }}>
          {stage === 'loading' && (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 20, textAlign: 'center' }}>
                Simulating M-Pesa STK Push
              </Text>
              <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
                Sending KSh {amount?.toLocaleString()} request to {phoneNumber}...
              </Text>
            </>
          )}

          {stage === 'success' && (
            <>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="check" size={28} color={colors.success} />
              </View>
              <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 20, textAlign: 'center' }}>
                Payment confirmed
              </Text>
              <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 8, marginBottom: 22, textAlign: 'center' }}>
                Your cover is now active.
              </Text>
              <PrimaryButton title="Continue" onPress={onSuccess} icon="arrow-right" />
            </>
          )}

          {stage === 'failed' && (
            <>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="x" size={28} color={colors.primary} />
              </View>
              <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 20, textAlign: 'center' }}>
                Payment failed
              </Text>
              <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 8, marginBottom: 22, textAlign: 'center' }}>
                The request wasn't confirmed. You can try again.
              </Text>
              <PrimaryButton title="Retry payment" onPress={handleRetry} icon="refresh-ccw" />
              <Pressable onPress={onClose} style={{ marginTop: 14 }}>
                <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 13 }}>
                  Cancel
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}