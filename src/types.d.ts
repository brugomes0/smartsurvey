type AuthorizationType = {
    moduleId: number,
    moduleType: string,
    windowPermissions: WindowPermissionType[]
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