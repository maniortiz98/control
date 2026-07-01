export interface CustomerMailItem{
  id: string | number,
  mail: string,
  mailNotification: boolean,
  active: boolean,
  isSaved?: boolean,
}



export type MailItem = CustomerMailItem;

