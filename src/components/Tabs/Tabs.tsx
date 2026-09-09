import React, { useState } from "react";

export interface TabItem {
    id: string;
    label: React.ReactNode;
    content: React.ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    tabs: TabItem[];
    defaultActiveTab?: string;
    activeTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultActiveTab,
    activeTab,
    onChange,
    className = "",
}) => {
    const firstEnabledTab = tabs.find((tab) => !tab.disabled)?.id;

    const [internalActiveTab, setInternalActiveTab] = useState(
        defaultActiveTab ?? firstEnabledTab
    );

    const currentTab = activeTab ?? internalActiveTab;

    const handleTabChange = (tabId: string) => {
        if (activeTab === undefined) {
            setInternalActiveTab(tabId);
        }

        onChange?.(tabId);
    };

    const activeTabContent = tabs.find(
        (tab) => tab.id === currentTab
    )?.content;

    return (
        <div className={`w-full ${className}`}>
            {/* Tab Header */}
            <div
                role="tablist"
                className="flex items-center gap-6 border-b border-gray-200"
            >
                {tabs.map((tab) => {
                    const isActive = tab.id === currentTab;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`tabpanel-${tab.id}`}
                            disabled={tab.disabled}
                            onClick={() => handleTabChange(tab.id)}
                            className={` relative px-1 py-3 text-sm font-medium transition-colors cursor-pointer ${isActive
                                ? "text-primary"
                                : "text-gray-500 hover:text-gray-900"
                                } ${tab.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                            {tab.label}

                            {isActive && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div
                id={`tabpanel-${currentTab}`}
                role="tabpanel"
                className="pt-4"
            >
                {activeTabContent}
            </div>
        </div>
    );
};

export default Tabs;