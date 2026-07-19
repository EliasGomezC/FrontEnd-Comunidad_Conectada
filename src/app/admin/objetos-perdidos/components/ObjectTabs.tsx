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
    <>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`pb-1 text-sm font-medium transition-all ${
            activeTab === tab.key
              ? `${palette[tab.key].tabBorder} text-gray-800`
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </>
  );
}
