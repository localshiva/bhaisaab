"use client";

import { Button } from "@bhaisaab/shared/components/core/button";

export const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Button variant="default">Default Button</Button>
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="accent">Accent Button</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
};
