export type ProofDataResponse = {
  claimed: boolean;
  transactionHash: null | string;
  events: [
    {
      proofs: string[];
      beneficiary: string;
      awardAmount: string;
      releaseTime: number;
    },
  ];
};
