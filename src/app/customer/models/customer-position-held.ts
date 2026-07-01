import { Moment } from "moment";

export interface CustomerPositionHeld {
  chargeDueDate: string;
  relationship: string | null;
  positionHeld: string;
}




export type PositionHeld = CustomerPositionHeld;

