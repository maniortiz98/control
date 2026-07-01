export interface MailItem{
  id: string | number,
  mail: string,
  mailNotification: boolean,
  active: boolean,
  isSaved?: boolean,
  isView?: boolean,
}
