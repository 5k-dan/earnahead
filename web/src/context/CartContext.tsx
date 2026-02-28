"use client";

import React, { createContext, useEffect, useMemo, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";



export type Opportunity = {
  id: string;
  title: string;
  type: string;
  payout: number;
  locationName: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;

  requirements: {
    minAge?: number | null;
    maxAge?: number | null;
    gender?: string;
    requiresValidID?: boolean;
    requiresHealthScreening?: boolean;
  };
};

export const CartContext = createContext<CartCtx>({
  plan: [],
  addToPlan: () => {},
  removeFromPlan: () => {},
  clearPlan: () => {},
  weeklyPotential: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState<Opportunity[]>([]);

  // Load saved plan from Firestore
  useEffect(() => {
    const loadPlan = async () => {
      if (!user) return;

      const snap = await getDocs(collection(db, "users", user.uid, "plan"));
      const items: Opportunity[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setPlan(items);
    };

    loadPlan();
  }, [user]);

  const addToPlan = async (o: Opportunity) => {
    if (!user) return;

    if (plan.some((x) => x.id === o.id)) return;

    await setDoc(doc(db, "users", user.uid, "plan", o.id), o);
    setPlan((prev) => [...prev, o]);
  };

  const removeFromPlan = async (id: string) => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "plan", id));
    setPlan((prev) => prev.filter((x) => x.id !== id));
  };

  const clearPlan = async () => {
    if (!user) return;

    for (const item of plan) {
      await deleteDoc(doc(db, "users", user.uid, "plan", item.id));
    }

    setPlan([]);
  };

  const weeklyPotential = useMemo(() => {
    return plan.reduce((sum, x) => sum + Number(x.payout || 0), 0);
  }, [plan]);

  return (
    <CartContext.Provider
      value={{ plan, addToPlan, removeFromPlan, clearPlan, weeklyPotential }}
    >
      {children}
    </CartContext.Provider>
  );
}