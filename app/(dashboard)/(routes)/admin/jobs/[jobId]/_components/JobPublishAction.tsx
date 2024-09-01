"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useState } from "react"

interface JobPublishActionProps {
    disabled : boolean,
    JobId : string,
    isPublished : boolean
}

const JobPublishAction = ({disabled,JobId,isPublished} : JobPublishActionProps) => {
    const [isLoading,setIsLoading] = useState(false);
    const onClick = () =>{}
    const onDelete = () =>{}
  return (
    <div className="flex items-center gap-x-3">
        <Button variant={"outline"} onClick={onClick} disabled={disabled || isLoading} size={"sm"}>
            {
                isPublished ? "UnPublished" : "Published"
            }
        </Button>
        <Button variant={"destructive"} size={"icon"} disabled={isLoading} onClick={onDelete}>
            <Trash className="w-4 h-4"/>
        </Button>
    </div>
  )
}

export default JobPublishAction