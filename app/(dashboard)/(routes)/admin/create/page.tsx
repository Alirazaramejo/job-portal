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
  title: z.string().min(1, { message: "Job title cannot be empty" }),
});

const JobCreatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
const router = useRouter();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/jobs", data);
  router.push(`/admin/jobs/${response.data.id}`);
  toast.success("Job created successfully");
      
    } catch (error) {
      console.log((error as Error)?.message);
      //toast message
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your job</h1>
        <p className="text-sm text-neutral-500">
          What would you like to name your job? Don&apos;t worry, you can change
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
              name="title"
              render={({ field, fieldState }) => (
                <div className="space-y-2"> {/* Added spacing between elements */}
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g Full Stack Developer"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="mt-1">
                    Role of this job
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
              <Link href="/admin/jobs">
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

export default JobCreatePage;
