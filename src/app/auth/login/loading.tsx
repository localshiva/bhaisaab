// app/auth/login/loading.tsx
import { Typography } from "@bhaisaab/shared/components/core/typography";

export default function LoginLoading() {
  return (
    <div className="container flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-charcoal-300">
        {/* Colorful header band */}
        <div className="flex h-2">
          <div className="w-1/4 bg-persian-green-500"></div>
          <div className="w-1/4 bg-saffron-500"></div>
          <div className="w-1/4 bg-sandy-brown-500"></div>
          <div className="w-1/4 bg-burnt-sienna-500"></div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="size-12 animate-spin rounded-full border-4 border-persian-green-500 border-t-transparent"></div>
          <Typography variant="body" textColor="secondary">
            Loading...
          </Typography>
        </div>
      </div>
    </div>
  );
}
