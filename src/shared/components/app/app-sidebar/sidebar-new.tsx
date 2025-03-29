import { Typography } from "@bhaisaab/shared/components/core/typography";
import { Plus } from "lucide-react";

interface SidebarNewProps {
  isCollapsed: boolean;
}

export default function SidebarNew({ isCollapsed }: SidebarNewProps) {
  return (
    <div className="flex items-center my-4">
      <div className="w-16 flex justify-center">
        <div
          className="w-8 h-8 rounded-full bg-sandy-brown-500 flex items-center justify-center cursor-pointer hover:bg-sandy-brown-600 transition-colors"
          onClick={() => {
            /* Add new sheet functionality */
          }}
        >
          <Plus size={22} color="white" />
        </div>
      </div>

      {/* Text only shows when expanded */}
      {!isCollapsed && (
        <Typography variant="body" className="pl-1">
          New sheet
        </Typography>
      )}
    </div>
  );
}
