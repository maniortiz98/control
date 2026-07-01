export interface CustomerClientKnowledgeRequest {
  clientKnowledgeCve: string[]
}

export interface CustomerClientKnowledge {
  clientKnowledgeCve: string,
  clientKnowledge: string,
}

export type ClientKnowledgeRequest = CustomerClientKnowledgeRequest;
export type ClientKnowledge = CustomerClientKnowledge;

