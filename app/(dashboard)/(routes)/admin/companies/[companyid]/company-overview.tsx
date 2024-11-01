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
import { Company } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { Editor } from "@/components/editor";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";

interface CompanyOverviewFormProps {
  initialData: Company;
  companyid: string;
}

const formSchema = z.object({
  overView: z.string().min(1, "Short overView is required"),
});

const CompanyOverviewForm = ({ initialData, companyid }: CompanyOverviewFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roleName, setRoleName] = useState("");


  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overView: initialData?.overView || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyid}`, values);
      toast.success("Company updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update the job");
      console.error(error);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    if (!roleName.trim()) {
      toast.error("Please enter role name and skills before generating");
      return;
    }
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an overview content about ${roleName}. Include information about its history, purpose, features, user base, and impact on the industry. Focus on providing a comprehensive yet concise summary suitable for readers unfamiliar with the platform.`;
      const data = await getGenerativeAIResponse(customPrompt);
      const cleanText = data.replace(/[/*/#]/g, "").replace(/^'|'$/g, "");
      setAiValue(cleanText);
    } catch (error) {
      toast.error("Error generating AI response");
      console.error(error);
    } finally {
      setIsPrompting(false);
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to Clipboard");
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company OverView
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className={cn("text-sm mt-2", !initialData.overView && "text-neutral-500 italic")}>
          {!initialData.overView ? "No overView" : <Preview value={initialData.overView} />}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g., 'Ali Design Studio'"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full p-2 rounded-md"
            />
          
            <Button onClick={handlePromptGeneration} disabled={isPrompting}>
              {isPrompting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Notes*: Type the company name overHere to generate the overview contact .
          </p>
          {aiValue && (
            <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}
              <Button
                onClick={onCopy}
                className="absolute top-3 right-3 z-10"
                variant={"outline"}
                size={"icon"}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="overView"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default CompanyOverviewForm;
