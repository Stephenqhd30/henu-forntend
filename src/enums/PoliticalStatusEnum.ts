export enum PoliticalStatus {
  COMMUNIST_PARTY_MEMBER = 'communist_party_member',
  PROBATIONARY_PARTY_MEMBER = 'probationary_party_member',
}

export const politicalStatusEnum = {
  [PoliticalStatus.COMMUNIST_PARTY_MEMBER]: {
    text: '党员',
    value: PoliticalStatus.COMMUNIST_PARTY_MEMBER,
  },
  [PoliticalStatus.PROBATIONARY_PARTY_MEMBER]: {
    text: '预备党员',
    value: PoliticalStatus.PROBATIONARY_PARTY_MEMBER,
  },
};
