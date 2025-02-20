type AuthorizationType = {
    moduleId: number,
    moduleType: string,
    windowPermissions: WindowPermissionType[]
}

type CategoryType = {
    categoryId: string,
    availableLangs: string[],
    date: string,
    questions: QuestionType[],
    translations: TranslationType[],
    username: string
}

type CreateCategoryType = {
    questions: CreateQuestionType[],
    translations: TranslationType[]
}

type CreateQuestionType = {
    type: string,
    translations: TranslationType[]
}

type CreateRatingGroupType = {
    title: string,
    description: string,
    ratingOptions: CreateRatingOptionType[]
}

type CreateRatingOptionType = {
    numericValue: number,
    needComment: boolean,
    translations: TranslationType[]
}

type CreateSurveyType = {
    title: string,
    description: string,
    endDate: string | null,
    template: TemplateType
    surveyEmployeeIds: number[]
}

type PermissionType = {
    permissionId: number,
    permissionType: string,
    hasPermission: boolean
}

type ProfileType = {
    idperfil: number,
    nome: string,
    portalColaborador: int
}

type QuestionType = {
    questionId: string,
    type: string,
    translations: TranslationType[]
}

type RatingGroupType = {
    ratingGroupId: string,
    availableLangs: string[],
    isBeingUsed: boolean,
    title: string,
    description: string,
    ratingOptions: RatingOptionType[],
    date: string,
    username: string
}

type RatingOptionType = {
    ratingOptionId: string,
    numericValue: number,
    needComment: boolean,
    translations: TranslationType[]
}

type SurveysType = {
    surveyId: string
    title: string,
    description: string,
    availableLangs: string[],
    status: string,
    createDate: string
    startDate?: string | null
    endDate?: string | null
    username: string
}

type TemplateType = {
    availableLangs: string[],
    categories: TemplateCategoryType[]
}

type TemplateCategoryType = {
    categoryId: string,
    position: number,
    value: number,
    questions: TemplateQuestionType[]
}

type TemplateQuestionType = {
    questionId: string,
    isRequired: boolean,
    position: number,
    value: number
}

type TranslationType = {
    translationId?: string,
    language: string,
    title: string,
    description: string
}

type UserType = {
    userId: number,
    employeeId: number,
    userName: string,
    userEmail: string,
    profileDescription: string,
    profileType: string,
    isSuperior: boolean,
    authorizations: AuthorizationType[]
}

type WindowPermissionType = {
    windowId: number,
    windowType: string,
    permissions: PermissionType[]
}