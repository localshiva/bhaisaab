"use client";

import ThemeSwitcher from "../components/app/theme-switcher";

export const Login = () => {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="w-full flex justify-end">
        <ThemeSwitcher />
      </div>
    </div>
  );
};
