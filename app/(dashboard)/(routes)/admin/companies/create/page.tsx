"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  FormControl,
  FormField,
  FormLabel,
  Form,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Company name cannot be empty" }),
});

const CompanyCreatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
const router = useRouter();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/companies", data);
  router.push(`/admin/companies/${response.data.id}`);
  toast.success("Company created successfully");
      
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("An error occurred while creating the Company");
      //toast message
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your Company</h1>
        <p className="text-sm text-neutral-500">
          What would you like to name your Company? Don&apos;t worry, you can change
          this later.
        </p>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            {/* Form field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <div className="space-y-2"> {/* Added spacing between elements */}
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g Ali Design Studios"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="mt-1">
                    Name of this Company
                  </FormDescription>
                  {/* Display error message */}
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </div>
              )}
            />

            {/* Buttons */}
            <div className="flex items-center gap-x-2">
              <Link href="/admin/Companys">
                <Button type="button" variant={"ghost"} disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompanyCreatePage;
