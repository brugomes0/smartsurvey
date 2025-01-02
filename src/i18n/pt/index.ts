import type { BaseTranslation } from '../i18n-types'

const pt = {
	Backoffice: "Backoffice",
	BackofficeMenu: "Menu de Backoffice",
	Categories: "Categorias",
	ChooseProfile: "Selecionar perfil",
	ChooseProfileText: "Selecione o perfil ao qual deseja alterar as permissões.",
	Error: "Erro",
	ErrorType: {
		CannotSavePermissions: "Não é possível guardar as permissões deste perfil.",
		NoPermissionsOfProfile: "Não foram encontradas permissões para mostrar.",
		NoProfiles: "Não foram encontrados perfis para mostrar.",
	},
	Frontoffice: "Frontoffice",
	FrontofficeMenu: "Menu de Frontoffice",
	Hello: "Olá",
	Home: "Início",
	Loading: "A Carregar",
	NoLogin: "Sem login",
	NoLoginText: "Necessita de realizar o login antes de acessar esta página.",
	NoProfileUser: "Utilizador sem perfil",
	NoProfileUserText: "Não tem um perfil associado á sua conta, seja frontoffice ou backoffice. Tente solucionar este problema antes de acessar a página novamente.",
	Permissions: "Permissões",
	PermissionsSaved: "Permissões guardadas com sucesso.",
	PermissionsType: {
		Create: "Criar",
		Delete: "Remover",
		Patch: "Alterar",
		Read: "Acessar",
		Update: "Editar"
	},
	RatingGroups: "Critérios de Avaliação",
	Save: "Guardar",
	Statistics: "Estatísticas",
	Submissions: "Submissões",
	Surveys: "Inquéritos",
	User: "Utilizador"
} satisfies BaseTranslation

export default pt
