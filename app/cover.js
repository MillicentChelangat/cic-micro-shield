import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PrimaryButton, Screen, TopBar } from '@/components/CicUI';

const plans = [
  { id: 'boda', name: 'Boda Boda Personal Accident', category: 'For riders', premium: 2500, icon: 'truck', description: 'Stay protected on every trip.', benefits: ['Accidental death: KSh 300,000', 'Permanent disability: KSh 300,000', 'Medical expenses: KSh 30,000'] },
  { id: 'trader', name: 'Trader Micro-Cover', category: 'For market traders', premium: 3000, icon: 'shopping-bag', description: 'Protect your stock and daily income.', benefits: ['Stock loss from fire: KSh 80,000', 'Theft cover: KSh 40,000', 'Daily hospital cash: KSh 1,000'] },
  { id: 'security', name: 'Security Guard Personal Accident', category: 'For security workers', premium: 2000, icon: 'eye', description: 'A dependable safety net at work.', benefits: ['Accidental death: KSh 250,000', 'Permanent disability: KSh 250,000', 'Medical expenses: KSh 20,000'] },
];

export default function CoverScreen() {
  const colors = useColors();
  const { addPolicy } = useApp();
  const [selected, setSelected] = useState(plans[0].id);
  const selectedPlan = plans.find((plan) => plan.id === selected);
  return <Screen><TopBar eyebrow="FIND YOUR FIT" title="Choose your cover" /><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 21, marginBottom: 22 }}>Flat-rate protection, made for the way you work. No complicated packages.</Text>{plans.map((plan) => { const active = plan.id === selected; return <Pressable key={plan.id} onPress={() => setSelected(plan.id)} accessibilityRole="radio" accessibilityState={{ selected: active }} style={({ pressed }) => [{ borderRadius: 21, borderWidth: active ? 2 : 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.dangerSoft : colors.card, padding: 17, marginBottom: 12, opacity: pressed ? 0.77 : 1 }]}><View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 }}><View style={{ width: 43, height: 43, borderRadius: 14, backgroundColor: active ? colors.primary : colors.secondary, alignItems: 'center', justifyContent: 'center' }}><Feather name={plan.icon} size={20} color={active ? '#FFFFFF' : colors.primary} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 15, lineHeight: 19 }}>{plan.name}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 }}>{plan.category}</Text></View></View><View style={{ width: 23, height: 23, borderRadius: 12, borderWidth: 2, borderColor: active ? colors.primary : colors.input, alignItems: 'center', justifyContent: 'center' }}>{active && <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary }} />}</View></View><Text style={{ color: colors.inkSoft, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 14 }}>{plan.description}</Text><View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 14, gap: 5 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 20 }}>KSh {plan.premium.toLocaleString()}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12 }}>/ year</Text></View></Pressable>; })}<View style={{ marginTop: 7 }}><PrimaryButton title={`Activate ${selectedPlan.name.split(' ')[0]} cover`} onPress={() => { const policy = addPolicy(selectedPlan); router.replace(`/policy/${policy.id}`); }} icon="shield" /></View></Screen>;
}
