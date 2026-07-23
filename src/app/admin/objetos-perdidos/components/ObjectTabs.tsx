"use client";

interface ObjectTabsProps {
  activeTab: "active" | "completed" | "all";
  onTabChange: (tab: "active" | "completed" | "all") => void;
  palette: Record<string, { tabBorder: string }>;
}

const tabs = [
  { key: "active" as const, label: "Activas" },
  { key: "completed" as const, label: "Finalizadas" },
  { key: "all" as const, label: "Todas" },
];

export default function ObjectTabs({ activeTab, onTabChange, palette }: ObjectTabsProps) {
  return (
    <div className="flex items-center gap-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`pb-1 text-base font-semibold transition-all ${
              isActive
                ? `border-b-2 ${palette[tab.key].tabBorder} text-slate-800`
                : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}