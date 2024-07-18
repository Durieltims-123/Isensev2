
"use client";

import { RoleGate } from "@/components/auth/role-gate";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status != 'authenticated' && !session) {
      window.location.reload();
    }
  }, [status, session]);


  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
};

export default ProtectedLayout;
