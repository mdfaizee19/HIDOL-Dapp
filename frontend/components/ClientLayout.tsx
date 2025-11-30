"use client";

import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import LoadingScreen from "@/components/LoadingScreen";

function MainLayoutContent({ children }: { children: React.ReactNode }) {
    const { state } = useApp();

    return (
        <div className={state.theme === 'dark' ? 'dark' : ''}>
            {state.loading && <LoadingScreen />}
            {children}
        </div>
    );
}

import { MeshProvider } from "@meshsdk/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <MeshProvider>
            <AppProvider>
                <MainLayoutContent>{children}</MainLayoutContent>
            </AppProvider>
        </MeshProvider>
    );
}
