"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema, UpdateSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";
import { MapPinned } from "lucide-react";
import { MapsModal } from "../cards/maps/maps-modal";
import FileUpload from "../file-upload";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { updateUser } from "@/actions/user";

interface UpdateProfileFormProps {
  initialData: any | null;
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  initialData,
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const defaultValues = initialData
    ? initialData
    : {
        username: "",
        password: "",
        name: "",
        address: "",
        lat: 0,
        lng: 0,
        imgUrl: [],
        phone: "",
      };

  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues,
  });
  
  const onSubmit = (values: z.infer<typeof UpdateSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      updateUser(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  const handleAddressSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setAddress(location.address);
    setLat(location.lat);
    setLng(location.lng);
    form.setValue("address", location.address);
    form.setValue("lat", location.lat);
    form.setValue("lng", location.lng);
  };

  const onConfirm = async () => {};
  return (
    <div className="w-full h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
          {(!initialData || !initialData.imgUrl || initialData.imgUrl.length === 0) && (
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <FileUpload
                        onChange={field.onChange}
                        value={field.value}
                        onRemove={field.onChange}
                        uploadType={"imageUploader"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Input
                        type="address"
                        placeholder="Click the icon to choose the address"
                        disabled={true}
                        {...field}
                        value={address}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setOpen(true)}
                      >
                        <MapPinned className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="hidden"
                      placeholder="Enter your address..."
                      disabled={isPending}
                      {...field}
                      value={lat!}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lng"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="hidden"
                      placeholder="Enter your address..."
                      disabled={isPending}
                      {...field}
                      value={lng!}
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
                      {...field}
                      disabled={isPending}
                      placeholder="09951234567"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full  ">
            Update account
          </Button>
        </form>
      </Form>
      <MapsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        onAddressSelect={handleAddressSelect}
      />
    </div>
  );
};
