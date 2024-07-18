import React from "react";
import * as z from "zod";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { ContactsSchema } from "@/schemas";
import { Button } from "../ui/button";
import { createContact, updateContact } from "@/actions/contact";

interface ContactsFormProps {
  initialData: any | null;
}

type ContactsFormValues = z.infer<typeof ContactsSchema>;
export const ContactsForm: React.FC<ContactsFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const defaultValues = initialData || {
    name: "",
    phone: "",
  };

  const form = useForm<ContactsFormValues>({
    resolver: zodResolver(ContactsSchema),
    defaultValues,
  });
  const onSubmitNew = (values: z.infer<typeof ContactsSchema>) => {
    setError("");
    setSuccess("");
    setLoading(true);
    startTransition(() => {
      createContact(values).then((data) => {
        setLoading(false);
        setError(data?.error);
        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
        }
      });
    });
  };
  
  const onSubmitUpdate = (values: z.infer<typeof ContactsSchema>) => {
    setError("");
    setSuccess("");
    setLoading(true);
  
    startTransition(() => {
      const contactId = initialData?.id; // Assuming 'id' is the property representing the contact ID
      updateContact(contactId, values).then((data) => {
        console.log(data);
        setLoading(false);
        setError(data?.error);
        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
        }
      });
    });
  };
  
  const handleSubmit = (values: z.infer<typeof ContactsSchema>) => {
    if (initialData) {
      onSubmitUpdate(values);
    } else {
      onSubmitNew(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Enter an appropriate Contact Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Enter phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />

        <div className="flex items-center justify-end">
          {/* Flex container */}
          <Button disabled={loading} type="submit">
            {initialData ? "Update" : "Create"} Contact
          </Button>
        </div>
      </form>
    </Form>
  );
};
