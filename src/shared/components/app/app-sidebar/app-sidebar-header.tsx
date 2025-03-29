import {
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@bhaisaab/shared/components/core/sidebar";
import { Typography } from "@bhaisaab/shared/components/core/typography";
import { APP_NAME } from "@bhaisaab/shared/constants/app";

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader className="overflow-hidden">
      <div className="flex items-center">
        <SidebarTrigger />
        <SidebarGroupLabel>
          <Typography variant="h6">{APP_NAME}</Typography>
        </SidebarGroupLabel>
      </div>
    </SidebarHeader>
  );
};
