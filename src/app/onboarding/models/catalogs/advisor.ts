export interface Advisor {
  advisorCode:           string;
  financialCenterId:     string;
  stockBrokerAdvisorId:  string;
  bankPromoterId:        string;
  name:                  string;
  email:                 string;
  sapUser:               string;
  advisorRfc:            string;
  bankArea:              string;
  houseArea:             string;
  isAssistant:           boolean;
  isVirtual:             boolean;
  virtualAdvisorPayroll: string;
  segment:               string;
  channels:              string;
  isConsultant:          boolean;
  group:                 string;
  subgroup:              string;
  registrationDate:      string;
  registrationUser:      string;
  cancellationDate:      string;
  cancellationUser:      string;
  active:                boolean;
  created:               string;
  modified:              string;
}
