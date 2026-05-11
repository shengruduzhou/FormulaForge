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
      <div className="flex flex-wrap gap-1 rounded-lg border border-lens-line bg-slate-50 p-1 dark:bg-slate-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`min-h-9 rounded-md px-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-white text-lens-primary shadow-sm dark:bg-slate-950"
                : "text-lens-muted hover:bg-white/70 hover:text-lens-ink dark:hover:bg-slate-950/70"
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
