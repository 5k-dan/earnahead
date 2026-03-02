"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CheckoutPage() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const snap = await getDoc(doc(db, "opportunities", id as string));

      if (snap.exists()) {
        setOpportunity({ id: snap.id, ...snap.data() });
      }
    };

    load();
  }, [id]);

  if (!opportunity) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto bg-neutral-900 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4">
          {opportunity.locationName}
        </h1>

        <p className="mb-2">
          {opportunity.city}, {opportunity.state}
        </p>

        <p className="mb-6 text-neutral-400">
          {opportunity.payoutText}
        </p>

        <a
          href={opportunity.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg font-semibold"
        >
          Apply on Official Site
        </a>
      </div>
    </div>
  );
}