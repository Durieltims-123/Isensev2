"use client";

import { getContacts } from "@/actions/contact";
import { CardWrapper } from "@/components/cards/contacts/card-wrapper";
import { ContactsModal } from "@/components/modal/contacts-modal";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { Contact } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ContactsCardProps {
  contactName?: string;
}

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ContactsCard: React.FC<ContactsCardProps> = ({ contactName }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [contacts, setContacts] = useState<Contact[]>([]);

  const fetchContacts = async () => {
    const response = await getContacts(session!.user!.id!);
    if (response == null) {
      throw new Error("Failed to fetch data");
    }
    if ('error' in response) {
      console.error(response.error);
    } else {
      setContacts(response);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onConfirm = async () => {};

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setOpen(true);
  };
  const handleAdd = () => {
    setSelectedContact(null);
    setOpen(true);
  };

  return (
    <>
      <ContactsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        initialData={selectedContact}
      />
      <CardWrapper headerLabel="Contacts">
        <div className="flex items-center justify-between p-3">
          <h3>Contacts</h3>
          <Button
            className="bg-slate-200 rounded-2xl"
            onClick={() => handleAdd()}
          >
            <p className="text-indigo-600">Add Contact</p>
          </Button>
        </div>
        {contacts.map((contact) => (
          <div key={contact.id} className="flex justify-between items-center">
            <div className="flex w-auto">
              <div>
                <Image
                  width={20}
                  height={20}
                  alt="Contact avatar"
                  src="https://utfs.io/f/612cf32a-4729-4649-b638-074983d0f3f7-1zbfv.png"
                />
              </div>
              <p className="text-md px-2">{contact.name}</p>
            </div>
            <div className="py-1">
              <Button className="rounded-2xl" onClick={() => handleEdit(contact)}>
                <p className="text-white px-2">Edit</p>
              </Button>
            </div>
          </div>
        ))}
      </CardWrapper>
    </>
  );
};
