"use client"
import { useMemo } from "react"
import dynamic from "next/dynamic"
import 'react-quill/dist/quill.bubble.css'
import { string } from "zod"

interface PreviewProps{
    
    value : string;
}

export const Preview = ({value} : PreviewProps) =>{
    const ReactQuill = useMemo(()=> dynamic(()=> import("react-quill"),{ssr : false}),[]);


return <div className="bg-white">
    <ReactQuill value={value}  theme="bubble" readOnly/>
</div>
}