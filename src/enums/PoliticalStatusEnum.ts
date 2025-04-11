export enum PoliticalStatus {
  COMMUNIST_PARTY_MEMBER = 'communist_party_member',
  PROBATIONARY_PARTY_MEMBER = 'probationary_party_member',
  LEAGUE_MEMBER = 'league_member',
  PUBLIC_PEOPLE = 'public_people',
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
  [PoliticalStatus.LEAGUE_MEMBER]: {
    text: '团员',
    value: PoliticalStatus.LEAGUE_MEMBER,
  },
  [PoliticalStatus.PUBLIC_PEOPLE]: {
    text: '群众',
    value: PoliticalStatus.PUBLIC_PEOPLE,
  },
};
