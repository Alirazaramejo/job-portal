"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import getGenerativeAIResponse from "@/scripts/aistudio";

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string().min(1)),
});

const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: initialData.tags },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update the job");
      console.error(error);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt before generating");
      return;
    }
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;
      const data = await getGenerativeAIResponse(customPrompt);

      const tagsArray = JSON.parse(data);
      if (Array.isArray(tagsArray)) {
        const updatedTags = [...jobTags, ...tagsArray];
        setJobTags(updatedTags);
        form.setValue("tags", updatedTags);
      }
    } catch (error) {
      toast.error("Error generating AI response");
      console.error(error);
    } finally {
      setIsPrompting(false);
    }
  };

  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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
        <div className="flex items-center flex-wrap gap-2">
          {jobTags.length > 0 ? (
            jobTags.map((tag, index) => (
              <div
                className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                key={index}
              >
                {tag}
              </div>
            ))
          ) : (
            <p>No Tags</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g. 'Full-Stack Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            <Button onClick={handlePromptGeneration} disabled={isPrompting}>
              {isPrompting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Notes*: Profession name alone is enough to generate the tags.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                >
                  {tag} {isEditing && (
                    <Button variant={"ghost"} className="p-0 h-auto" onClick={() => handleTagRemove(index)}>
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>No Tags</p>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setJobTags([]);
                form.setValue("tags", []);
              }}
              disabled={isSubmitting}
            >
              Clear All
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsForm;
