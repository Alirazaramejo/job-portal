"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { cn } from "@/lib/utils"; // Ensure you import cn utility if you're using classnames
import { Combobox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";

interface HourlyRateProps {
  initialData: Job;
  jobId: string;
  
}

const formSchema = z.object({
  hourlyRate: z.string().min(1, "HourlyRate is required"),
});

const HourlyRate = ({ initialData, jobId }: HourlyRateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlyRate: initialData?.hourlyRate || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, value);
      toast.success("Job Updated");
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
      Job HourlyRate
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? <>Cancel</> : <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>}
        </Button>
      </div>

      {/* Display the HourlyRate if not editing */}
      {!isEditing && (
       <p className="text-sm mt-2">
        {
          initialData.hourlyRate ? `${initialData.hourlyRate}/hrs` : "$ 0/hr"
        }
       </p>
      )}

      {/* In editing mode, display the select input */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                    placeholder="Type the hourly Rate"
                    disabled={isSubmitting}
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default HourlyRate;
