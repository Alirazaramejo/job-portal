"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavbarRoutes = () => {
  const pathName = usePathname();
  const isAdminPage = pathName?.startsWith("/admin");
  const isPlayerPage = pathName?.startsWith("/jobs");
  return (
    <div className="flex gap-x-2 ml-auto">
      {isAdminPage || isPlayerPage ? (
        <Link href={"/"}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="border-x-purple-700/20"
          >
            <LogOut />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={"/admin/jobs"}>
        <Button
          variant={"outline"}
          size={"sm"}
          className="border-x-purple-700/20"
        >
          Admin Mode
        </Button>
      </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default NavbarRoutes;
