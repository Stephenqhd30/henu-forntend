export enum PoliticalStatus {
  COMMUNIST_PARTY_MEMBER = 'communist_party_member',
}

export const politicalStatusEnum = {
  [PoliticalStatus.COMMUNIST_PARTY_MEMBER]: {
    text: '中共党员(预备党员)',
    value: PoliticalStatus.COMMUNIST_PARTY_MEMBER,
  },
};
