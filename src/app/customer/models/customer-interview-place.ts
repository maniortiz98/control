export interface CustomerInterviewPlaceRequest {
  interviewPlaceIds: string[]
}

export interface CustomerInterviewPlace {
  interviewPlaceId: string,
  interviewPlace: string,
}

export type InterviewPlaceRequest = CustomerInterviewPlaceRequest;
export type InterviewPlace = CustomerInterviewPlace;

