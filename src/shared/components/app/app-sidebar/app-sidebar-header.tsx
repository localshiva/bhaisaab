import {
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
        <Typography variant="h4">{APP_NAME}</Typography>
      </div>
    </SidebarHeader>
  );
};
