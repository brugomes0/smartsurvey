import type { BaseTranslation } from '../i18n-types'

const pt = {
	Backoffice: "Backoffice",
	BackofficeMenu: "Menu de Backoffice",
	Categories: "Categorias",
	CategoriesPageDescription: "Nesta página estão listadas todas as categorias presentes no sistema, mudando o idioma consegue ver as categories disponível no idioma selecionado e pode também filtrar as categorias inserindo parte do título da categoria na barra de pesquisa.",
	ChooseProfile: "Selecionar perfil",
	ChooseProfileText: "Selecione o perfil ao qual deseja alterar as permissões.",
	CreateCategory: "Criar Categoria",
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
	InputCategory: "Filtrar categorias pelo título",
	Loading: "A Carregar",
	NoCategoriesFilter: "Não existem categorias com o filtro inserido.",
	NoCategoriesToShow: "Não existem categorias para mostrar.",
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
