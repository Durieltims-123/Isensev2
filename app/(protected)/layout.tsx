"use client";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { User, UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EditProfileModal } from "@/components/modal/edit-profile-modal";
import { getUserById } from "@/data/user";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onConfirm = async () => {};

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const { data: session, status } = useSession();
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [userData, setUserData] = useState<User>();
  const fetchData = async () => {
    if (session) {
      const res = await getUserById(session.user.id);
      
      if (res != null) {
        setUserData(res);
      }
    }
  };
  useEffect(() => {
    if (status != "authenticated" && !session) {
      window.location.reload();
    }
    fetchData();
  }, [status, session]);

  return (
    <ScrollArea className="h-full">
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => handleCloseModal()}
        onConfirm={onConfirm}
        loading={loading}
        initialData={userData}
      />
      <Header onOpenModal={handleOpenModal} />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </ScrollArea>
  );
};

export default ProtectedLayout;
