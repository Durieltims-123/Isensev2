"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { UpdateProfileForm } from "../forms/update-profile-form";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  initialData: any | null
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  initialData
}) => {
  const [isMounted, setIsMounted] = useState(false);



  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Edit Profile"
      description="Edit your profile here."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <UpdateProfileForm initialData={initialData} />
        
      </div>
      
    </Modal>
  );
};
