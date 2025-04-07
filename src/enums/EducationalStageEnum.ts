export enum EducationStage {
  UNDERGRADUATE_COURSE = '本科',
  POSTGRADUATE = '硕士',
  DOCTOR_DEGREE = '博士',
}

export const educationStageEnum = {
  [EducationStage.UNDERGRADUATE_COURSE]: {
    text: '本科',
    value: EducationStage.UNDERGRADUATE_COURSE,
  },
  [EducationStage.POSTGRADUATE]: {
    text: '硕士',
    value: EducationStage.POSTGRADUATE,
  },
  [EducationStage.DOCTOR_DEGREE]: {
    text: '博士',
    value: EducationStage.DOCTOR_DEGREE,
  },
};
