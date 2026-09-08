import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';


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

function mapAuthUser(authUser) {
  if (!authUser) return null;

  return {
    id: authUser.id,
    name: authUser.user_metadata?.full_name || 'CIC customer',
    email: authUser.email || '',
    nationalId: authUser.user_metadata?.national_id || '',
  };
}

function mapPolicyRow(row) {
  return {
    id: row.id,
    planId: row.plan_id,
    name: row.name,
    category: row.category,
    premium: row.premium,
    frequency: row.frequency,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    member: row.member,
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
  };
}

function buildClaimTimeline(status, createdAt, updatedAt) {
  const submittedDate = createdAt
    ? createdAt.slice(0, 10)
    : 'Pending';

  const reviewComplete = ['In Review', 'Approved', 'Rejected'].includes(status);
  const decisionComplete = ['Approved', 'Rejected'].includes(status);

  const reviewDate = reviewComplete
    ? updatedAt?.slice(0, 10) || 'Pending'
    : 'Pending';

  const decisionDate = decisionComplete
    ? updatedAt?.slice(0, 10) || 'Pending'
    : 'Pending';

  return [
    {
      label: 'Claim submitted',
      date: submittedDate,
      complete: true,
    },
    {
      label: 'CIC team reviewing',
      date: reviewDate,
      complete: reviewComplete,
    },
    {
      label: 'Decision shared',
      date: decisionDate,
      complete: decisionComplete,
    },
  ];
}

function mapClaimRow(row) {
  return {
    id: row.id,
    policyId: row.policy_id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at?.slice(0, 10),
    updatedAt: row.updated_at?.slice(0, 10),
    photoUri: row.photo_path || null,
    timeline: buildClaimTimeline(
      row.status,
      row.created_at,
      row.updated_at,
    ),
  };
}

async function loadPolicies(authUser) {
  if (!authUser) return [];

  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(mapPolicyRow);
}

async function loadClaims(authUser) {
  if (!authUser) return [];

  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(mapClaimRow);
}

function formatDatabaseDate(date) {
  return date.toISOString().slice(0, 10);
}

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [localHydrated, setLocalHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const hydrated = localHydrated && authReady;

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        if (stored) {
          try {
            setState({ ...initialState, ...JSON.parse(stored), user: null, });
          } catch {
            setState(initialState);
          }
        }
        setLocalHydrated(true);
      })
      .catch(() => {
        if (active) setLocalHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (!active) return;

        const [policies, claims] = await Promise.all([ loadPolicies(session?.user), loadClaims(session?.user),]);

        setState((current) => ({
          ...current,
          user: mapAuthUser(session?.user),
          policies,
          claims,
        }));

        setAuthReady(true);
      })
      .catch(() => {
        if (!active) return;

        setState((current) => ({
          ...current,
          user: null,
          policies: [],
          claims: [],
        }));

        setAuthReady(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((current) => ({
        ...current,
        user: mapAuthUser(session?.user),
      }));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (localHydrated) { AsyncStorage.setItem( STORAGE_KEY, JSON.stringify({ ...state, user: null,}), ).catch(() => {}); }
  }, [state, localHydrated]);

  const actions = useMemo(
    () => ({
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const [policies, claims] = await Promise.all([ loadPolicies(data.session?.user), loadClaims(data.session?.user),]);

      setState((current) => ({
        ...current,
        user: mapAuthUser(data.session?.user),
        policies,
        claims,
      }));

      return data;
    },

    register: async (name, nationalId, email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            national_id: nationalId,
          },
        },
      });

      if (error) throw error;

      setState((current) => ({
        ...current,
        user: mapAuthUser(data.session?.user),
        policies: [],
        claims: [],
      }));

      return data;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setState((current) => ({
        ...current,
        user: null,
        policies: [],
        claims: [],
      }));
    },
      addPolicy: async (plan) => {
        if (!state.user?.id) {
          throw new Error('You must be signed in to activate a policy.');
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);

        const policyId = `POL-${Date.now().toString().slice(-6)}`;

        const { data, error } = await supabase
          .from('policies')
          .insert({
            id: policyId,
            user_id: state.user.id,
            plan_id: plan.id,
            name: plan.name,
            category: plan.category,
            premium: plan.premium,
            frequency: 'Annual',
            status: 'Active',
            start_date: formatDatabaseDate(startDate),
            end_date: formatDatabaseDate(endDate),
            member: `CIC-${policyId.slice(-6)}-KE`,
            benefits: plan.benefits,
          })
          .select()
          .single();

        if (error) throw error;

        const savedPolicy = mapPolicyRow(data);

        setState((current) => ({
          ...current,
          policies: [savedPolicy, ...current.policies],
        }));

        return savedPolicy;
      },
      addClaim: async ({ policyId, description, photoUri }) => {
        if (!state.user?.id) {
          throw new Error('You must be signed in to submit a claim.');
        }

        const claimId = `CLM-${Date.now().toString().slice(-6)}`;

        const { data, error } = await supabase
          .from('claims')
          .insert({
            id: claimId,
            user_id: state.user.id,
            policy_id: policyId,
            title: 'New accident claim',
            description,
            status: 'Pending',
            photo_path: null,
          })
          .select()
          .single();

        if (error) throw error;

        const savedClaim = {
          ...mapClaimRow(data),
          photoUri: photoUri || null,
        };

        setState((current) => ({
          ...current,
          claims: [savedClaim, ...current.claims],
        }));

        return savedClaim;
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
    [state.user],
  );

  const value = useMemo(() => ({ ...state, hydrated, ...actions }), [state, localHydrated, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
