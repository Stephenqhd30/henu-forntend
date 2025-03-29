export enum UserGender {
  MALE = 0,
  FEMALE = 1,
}

export const userGenderEnum = {
  [UserGender.MALE]: {
    text: '男',
    value: UserGender.MALE,
  },

  [UserGender.FEMALE]: {
    text: '女',
    value: UserGender.FEMALE,
  },
};
