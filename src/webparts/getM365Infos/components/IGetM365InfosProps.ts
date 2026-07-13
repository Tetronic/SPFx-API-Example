import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGetM365InfosProps {
  description: string;
  environmentMessage: string;
  hasTeamsContext: boolean;
  context: WebPartContext;
}
