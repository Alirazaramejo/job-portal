import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" mt-7 flex items-center justify-center h-[calc(100% - 170px)]">
      {children}
    </div>
  );
};

export default AuthLayout;
