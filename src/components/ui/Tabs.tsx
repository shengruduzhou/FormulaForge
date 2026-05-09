import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-lens-line">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`min-h-10 rounded-t-lg px-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "border-b-2 border-lens-primary text-lens-primary"
                : "text-lens-muted hover:bg-slate-50 hover:text-lens-ink"
            }`}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{active.content}</div>
    </div>
  );
}
