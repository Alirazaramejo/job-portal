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

interface CompanyFormProps {
  initialData: Job;
  jobId: string;
  options: {
    label: string;
    value: string;
  }[];
}

const formSchema = z.object({
  companyid: z.string().min(1, "Company is required"),
});

const CompanyForm = ({ initialData, jobId, options }: CompanyFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyid: initialData?.companyid || "",
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

  const selectedOption = options.find(
    (option) => option.value === initialData.companyid
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
      Job Created By
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? <>Cancel</> : <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>}
        </Button>
      </div>

      {/* Display the Company if not editing */}
      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData?.companyid && "text-neutral-500 italic")}>
          {selectedOption?.label || "No Company"}
        </p>
      )}

      {/* In editing mode, display the select input */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="companyid"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      value={field.value} // Bind Combobox value to form field value
                      onChange={field.onChange} // Bind Combobox onChange to form field onChange
                      heading="Companies"
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

export default CompanyForm;
