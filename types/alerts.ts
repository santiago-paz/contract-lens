export type BaseAlert = {
  id: string;
  alarmDate: string;
  deadline: string | null;
  deadlineLabel: string | null;
  status: string;
  note: string | null;
  createdAt: string;
  contractId: string;
  createdById: string;
  response: {
    id: string;
    responseType: string;
    comment: string | null;
    createdAt: string;
    respondedBy: {
      id: string;
      name: string | null;
    };
  } | null;
  events: Array<{
    id: string;
    eventType: string;
    description: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
    };
  }>;
};

export type SerializedAlert = BaseAlert & {
  contract: {
    id: string;
    title: string;
    contractPartner: string | null;
    durationType: string | null;
    status: string;
    endDate: string | null;
    contractNumber: string;
  };
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
};

export type ContractAlert = BaseAlert;
