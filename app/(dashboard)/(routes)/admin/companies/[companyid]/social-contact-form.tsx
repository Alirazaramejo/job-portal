"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";

import { Globe, Linkedin, Mail, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanySocialFormProps {
  initialData: Company;
  companyid: string;
}

const formSchema = z.object({
  mail: z.string().min(1, { message: "Mail is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  Linkedin: z.string().min(1, { message: "Linkedin is required" }),
  address_line_1: z.string().min(1, { message: "Address 1 is required" }),
  address_line_2: z.string().min(1, { message: "Address 2 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipcode: z.string().min(1, { message: "Zip Code is required" }),
});

const CompanySocialForm = ({
  initialData,
  companyid,
}: CompanySocialFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData?.mail || "",
      website: initialData?.website || "",
      Linkedin: initialData?.Linkedin || "",
      address_line_1: initialData?.address_line_1 || "",
      address_line_2: initialData?.address_line_2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipcode: initialData?.zipcode || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyid}`, value);
      toast.success("Company Updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Social Contact
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {/* Display the name if not editing */}
      {!isEditing && <>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          {initialData.mail && (
            <div className="text-sm text-neutral-500 flex items-center w-full">
              <Mail className="w-4 h-4 mr-2" />
              {initialData.mail}
            </div>
          )} 
          {initialData.Linkedin && (
            <Link href={initialData.Linkedin} className="text-sm text-neutral-500 flex items-center w-full">
              <Linkedin className="w-4 h-4 mr-2" />
              {initialData.Linkedin}
            </Link>
          )} 
          {initialData.website && (
            <Link href={initialData.website} className="text-sm text-neutral-500 flex items-center w-full">
              <Globe className="w-4 h-4 mr-2" />
              {initialData.website}
            </Link>
          )} 



        </div>
        <div className="col-span-3">
          {initialData.address_line_1 && (
            <div className="flex items-start gap-2 justify-start">
              <MapPin className="w-3 h-3 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {initialData.address_line_1}, {initialData.address_line_2},
                </p>
                <p className="text-sm text-muted-foreground">
                  {initialData.city}, {initialData.state} - {initialData.zipcode}
                </p>
              </div>
            </div>
          )}
          
        </div>
      </div>
      </>}

      {/* In editing mode, display the input */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Mail: 'sample@maildomain.com'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Website Link: 'https://www.sample.com'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Linkedin Link: 'https://www.linkedin.com/sample'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Address Line 1: '123 Sample Street'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Address Line 2: 'Apt 123'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isSubmitting}
                        placeholder="City: 'Sample City'"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isSubmitting}
                        placeholder="State: 'Sample State'"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isSubmitting}
                        placeholder="Zip Code: '12345'"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CompanySocialForm;
