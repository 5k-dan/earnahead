"use client";

const chips = [
  { key: "all", label: "All" },
  { key: "plasma", label: "Medical" },
  { key: "clinical_trial", label: "Research" },
  { key: "gigs", label: "Micro Gigs" },
];

export default function OpportunityFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {chips.map((c) => {
        const active = value === c.key;
        return (
          <button
            key={c.key}
            className="btn"
            onClick={() => onChange(c.key)}
            style={{
              borderRadius: 999,
              padding: "10px 14px",
              background: active ? "linear-gradient(90deg, rgba(168,85,247,0.95), rgba(236,72,153,0.70))" : "rgba(255,255,255,0.06)",
              border: active ? "0" : "1px solid rgba(255,255,255,0.14)",
              fontWeight: 700,
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}