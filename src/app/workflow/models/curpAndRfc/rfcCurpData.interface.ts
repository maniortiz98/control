export interface RfcCurpData {
	taskNumber: number,
	workflowRequestStatus: number,
	workflowRequestDate: string,
	workflowRequestTime: string,
	bankingArea: number,
	financialCenter: string,
	advisor: string,
	contractNumber: number,
	personType: string,
	role: string,
	clientNumber: string,
	firstName: string,
	secondName: string,
	lastName: string,
	secondLastName: string,
	updatedRfc: string,
	updatedCurp: string,
	comment: string,
	rfc: string,
	curp: string,
  id: string
}

export interface RfcCurpRequest{
    idWorkflowDetalle: number
}
