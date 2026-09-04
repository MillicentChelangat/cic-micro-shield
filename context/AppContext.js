import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cic-micro-shield-state-v1';

const starterPolicies = [
  {
    id: 'POL-240118',
    planId: 'boda',
    name: 'Boda Boda Personal Accident',
    category: 'Personal accident',
    premium: 2500,
    frequency: 'Annual',
    status: 'Active',
    startDate: '18 Jan 2026',
    endDate: '18 Jan 2027',
    member: 'CIC-8842-KE',
    benefits: ['Accidental death: KSh 300,000', 'Permanent disability: KSh 300,000', 'Medical expenses: KSh 30,000'],
  },
  {
    id: 'POL-231006',
    planId: 'trader',
    name: 'Trader Micro-Cover',
    category: 'Business protection',
    premium: 3000,
    frequency: 'Annual',
    status: 'Expiring soon',
    startDate: '06 Oct 2025',
    endDate: '06 Oct 2026',
    member: 'CIC-7719-KE',
    benefits: ['Stock loss from fire: KSh 80,000', 'Theft cover: KSh 40,000', 'Daily hospital cash: KSh 1,000'],
  },
];

const starterClaims = [
  {
    id: 'CLM-1042',
    policyId: 'POL-240118',
    title: 'Motorbike accident support',
    description: 'Submitted after a minor accident on my way home from the market.',
    status: 'In Review',
    createdAt: '29 Aug 2026',
    updatedAt: '30 Aug 2026',
    photoUri: null,
    timeline: [
      { label: 'Claim submitted', date: '29 Aug 2026', complete: true },
      { label: 'CIC team reviewing', date: '30 Aug 2026', complete: true },
      { label: 'Decision shared', date: 'Pending', complete: false },
    ],
  },
];

const initialState = {
  user: null,
  policies: starterPolicies,
  claims: starterClaims,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        if (stored) {
          try {
            setState({ ...initialState, ...JSON.parse(stored) });
          } catch {
            setState(initialState);
          }
        }
        setHydrated(true);
      })
      .catch(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state, hydrated]);

  const actions = useMemo(
    () => ({
      signIn: (phone) =>
        setState((current) => ({
          ...current,
          user: { name: current.user?.name || 'Samuel Kamau', phone },
        })),
      register: (name, phone) =>
        setState((current) => ({
          ...current,
          user: { name, phone },
        })),
      signOut: () => setState((current) => ({ ...current, user: null })),
      addPolicy: (plan) => {
        const policy = {
          id: `POL-${Date.now().toString().slice(-6)}`,
          planId: plan.id,
          name: plan.name,
          category: plan.category,
          premium: plan.premium,
          frequency: 'Annual',
          status: 'Active',
          startDate: '02 Sep 2026',
          endDate: '02 Sep 2027',
          member: 'CIC-NEW-KE',
          benefits: plan.benefits,
        };
        setState((current) => ({ ...current, policies: [policy, ...current.policies] }));
        return policy;
      },
      addClaim: ({ policyId, description, photoUri }) => {
        const claim = {
          id: `CLM-${Date.now().toString().slice(-4)}`,
          policyId,
          title: 'New accident claim',
          description,
          status: 'Pending',
          createdAt: '02 Sep 2026',
          updatedAt: '02 Sep 2026',
          photoUri: photoUri || null,
          timeline: [
            { label: 'Claim submitted', date: '02 Sep 2026', complete: true },
            { label: 'CIC team reviewing', date: 'Pending', complete: false },
            { label: 'Decision shared', date: 'Pending', complete: false },
          ],
        };
        setState((current) => ({ ...current, claims: [claim, ...current.claims] }));
        return claim;
      },
      advanceClaim: (claimId) =>
        setState((current) => ({
          ...current,
          claims: current.claims.map((claim) => {
            if (claim.id !== claimId) return claim;
            if (claim.status === 'Pending') {
              return {
                ...claim,
                status: 'In Review',
                updatedAt: '02 Sep 2026',
                timeline: claim.timeline.map((item, index) =>
                  index === 1 ? { ...item, date: '02 Sep 2026', complete: true } : item,
                ),
              };
            }
            return {
              ...claim,
              status: 'Approved',
              updatedAt: '03 Sep 2026',
              timeline: claim.timeline.map((item, index) =>
                index === 2 ? { ...item, date: '03 Sep 2026', complete: true } : item,
              ),
            };
          }),
        })),
    }),
    [],
  );

  const value = useMemo(() => ({ ...state, hydrated, ...actions }), [state, hydrated, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
