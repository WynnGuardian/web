import type { Criteria } from "./Criteria";

export interface Survey {
  id: string;
  channel_id: string;
  announcement_message_id: string,
  item_name: string;
  opened_at: string;
  deadline: string;
  status: number;
}