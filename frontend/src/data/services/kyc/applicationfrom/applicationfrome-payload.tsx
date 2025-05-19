export interface Type {
    id: number;
    name: string;
};

export interface AccountType {
    applicationTypeId: number;
    id: number;
    name: string;
};

export interface Answertype {
    id: number;
    name: string;
};

export interface AnswerTypeData {
    id: number;
    questionId: number;
    subQuestionId: number;
    subAnswer: number;
    name: string;
    score: number;
    uid: number;
    isActiveScore: boolean;
};

export interface SubQuestionTypeData {
    selectedValue: any;
    textValue: any;
    id: number;
    applicationTypeId: number;
    accountTypeId: number;
    questionId: number;
    name: string;
    nameField: number;
    ansTypeId: number;
    orderNo: number | null;
    uid: number | null;
    answerTypeData: AnswerTypeData[];
};

export interface QuestionDto {
    additionalDetails: any;
    textValue: any;
    selectedValue: any;
    id: number;
    applicationTypeId: number;
    accountTypeId: number;
    ansTypeId: number;
    name: string;
    orderNo: number | null;
    multiQuestion: number;
    description: string | null;
    subQuestionTypeData: SubQuestionTypeData[];
    answerTypeData: AnswerTypeData[];
};

export interface QuestionType {
    selectedValue: string;
    additionalDetails: any;
    questionDto: QuestionDto;
};

export interface Questionanswer {
    id: number;
    questionId: number;
    name: string;
    uid: number;
};

export interface AppFormData {
    applicantFormDto: ApplicantFormDto;
};

export interface ApplicantFormDto {
    id: number;
    name: string;
    numberOfPrint: number;
    isCompleted: number;
    isScreening: number;
    uid: number;
    applicantFormDetailsData: ApplicantFormDetailsData[];
};

export interface ApplicantFormDetailsData {
    id: number;
    kycId: number;
    accountTypeId: number;
    applicationTypeId: number;
    questionId: number;
    subQuestionId: number;
    ansTypeId: number;
    ansId: number;
    isSubAnswer: number;
    answer: string;
    score: number;
    uid: number;
    additionalDetails: string;
};

export interface KycFormDto {
    id: number;
    subQuestionId: number;
    name: string;
    description: string | null;
    orderNo: number | null;
    multiQuestion: number;
    kycSubQueFormData: KycSubQueFormData[];
    kycAnswerData: KycAnswerData[];
};

export interface KycAnswerData {
    answer: string;
    score: number;
    additionalDetails: string;
};

export interface KycSubQueFormData {
    id: number;
    subQuestionId: number;
    name: number;
    description: string;
    multiQuestion: number;
    orderNo: number;
    kycAnswerData: KycAnswerData[];
};

export interface kycForm {
    id: any;
    kycFormDto: KycFormDto;
};

export interface GetData {
    id: number;
    kycId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    pan: string;
    nationality: number;
    citizenship: number;
    domicile: number;
    isDirector: number;
    isShareHolders: number;
    uid: number;
};

export interface GetDatas {
    id: number;
    kycId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    pan: string;
    nationality: number;
    citizenship: number;
    domicile: number;
    isDirector: number;
    isShareHolders: number;
    uid: number;
};

export interface CreateDirectorsSignAuthorityRequest {
    id: number;
    kycId: number;
    name: string;
    designation: string;
    uid: number;
    euid: number;
};

export interface CreateData {
    id: number;
    authorityId: number;
    kycId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    pan: string;
    nationality: number;
    citizenship: number;
    domicile: number;
    isDirector: number;
    isShareHolders: number;
    uid: number;
    euid: number;
    isScreening: number;
};

export interface NewPayload {
    createDirectorsSignAuthorityRequests: CreateDirectorsSignAuthorityRequest;
    createDirectorsListRequest: CreateData[];
};

export interface KycShareHolder {
    firstName: string;
    middleName: string;
    lastName: string;
    pan: string;
    nationality: number;
    citizenship: number;
    domicile: number;
};

export interface KycDirectorsList {
    firstName: string;
    middleName: string;
    lastName: string;
    pan: string;
    nationality: number;
    citizenship: number;
    domicile: number;
};

export interface DeclarationFrom {
    id: number;
    kycId: number;
    memberName: string;
    registeredPlace: string;
    din: string;
    date: string;
    place: string;
    authorizeName: string;
    authorizeDesignation: string;
    uid: number;
};

export interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
};

export interface PepScore {
    id: number;
    name: string;
    score: number;
};

export interface NegativeScore {
    id: number;
    name: string;
    score: number;
};

export interface EntityScore {
    id: number;
    name: string;
    score: number;
};

export interface Score {
    id: number;
    score: number;
};

export interface RiskRange {
    risk_classification: string;
    rangeFrm: number;
    rangeTo: number;
};

export interface ApplicationsubQuestion {
    id: number;
    name: string;
    accountTypeId: number;
    applicationTypeId: number;
    questionId: number;
    nameField: number;
    orderNo: number;
    ansTypeId: number;
    uid: number;
};

export interface ApplicationQuestion {
    id: number;
    name: string;
    accountTypeId: number;
    applicationTypeId: number;
    ansTypeId: number;
    nameField: number;
    orderNo: number;
    multiQuestion: number;
    description: string;
};

export interface ScoreDocument {
    id: number;
    kycId: number;
    pepScoreId: number;
    negativeMediaId: number;
    entityId: number;
    pepScore: number;
    negativeMediaScore: number;
    entityScore: number;
    questionnairsScore: number;
    uid: number;
    euid: number;
};

export interface UpdateAppFormData {
    applicantFormDto: UpdateApplicantFormDto;
};

export interface UpdateApplicantFormDto {
    id: number;
    name: string;
    numberOfPrint: number;
    applicantFormDetailsData: UpdateApplicantFormDetailsData[];
};

export interface UpdateApplicantFormDetailsData {
    id: number;
    kycId: number;
    accountTypeId: number;
    applicationTypeId: number;
    questionId: number;
    subQuestionId: number;
    ansTypeId: number;
    ansId: number;
    isSubAnswer: number;
    answer: string;
    score: number;
    uid: number;
    euid: number;
};