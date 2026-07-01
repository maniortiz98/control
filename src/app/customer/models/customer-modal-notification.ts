export interface CustomerModalNotification{
  title: string,
  beforeMessages?: string[],
  beforeMessagesNotIcon?: [],
  afterCopyMessages?: string[],
  afterMessages?: string[],
  inputMessage?: string,
  infoToCopy?: string,
  btnAccept?: string,
  btnDeny?: string,
  btnSend?: string,
}

export type ModalNotification = CustomerModalNotification;

