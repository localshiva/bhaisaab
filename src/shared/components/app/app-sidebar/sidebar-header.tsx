import { Typography } from "@bhaisaab/shared/components/core/typography";
import { APP_NAME } from "@bhaisaab/shared/constants/app";
import { PanelLeftOpen, PanelRight, PanelRightOpen } from "lucide-react";
import { FC } from "react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarHeader: FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar,
}) => {
  return (
    <div className="flex h-16 items-center">
      <div
        className="w-16 flex items-center justify-center cursor-pointer group relative"
        onClick={toggleSidebar}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {/* Claude logo-like element, fixed position */}
        {isCollapsed ? (
          <>
            <PanelRight size={32} className="text-white group-hover:hidden" />
            <PanelLeftOpen
              size={32}
              className="text-white hidden group-hover:block"
            />
          </>
        ) : (
          <>
            <PanelLeftOpen
              size={32}
              className="text-white group-hover:hidden"
            />
            <PanelRightOpen
              size={32}
              className="text-white hidden group-hover:block"
            />
          </>
        )}

        {/* Tooltip on hover */}
        <div className="absolute left-16 bg-charcoal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        </div>
      </div>

      {/* Title only shows when expanded */}
      {!isCollapsed && (
        <div className="flex-1">
          <Typography variant="h4">{APP_NAME}</Typography>
        </div>
      )}
    </div>
  );
};
