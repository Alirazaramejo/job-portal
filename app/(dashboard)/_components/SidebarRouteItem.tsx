"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}
const SidebarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const isActive =
    (pathName === "/" && href === "/") ||
    pathName === href ||
    pathName.startsWith(`${href}/`);
  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transition-all hover:text-neutral-600 hover:bg-neutral-300/20",
        isActive &&
          "text-purple-700 bg-purple-200/20 hover:bg-purple-700/20 hover:text-purple-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-2">
        <Icon className={cn("text-neutral-500",isActive && "text-purple-700")} size={22} />
        {label}
      </div>
      {/* highlighters color*/}
      <div className={cn("ml-auto opacity-0 border-2 border-purple-700 h-full transition-all", isActive && "opacity-100")}></div>
    </button>
  );
};

export default SidebarRouteItem;
