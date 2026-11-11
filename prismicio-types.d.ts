import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

/**
 * Content for Article documents
 */
interface ArticleDocumentData {
	/**
	 * Заголовок (до 2 строк) field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Уровень field in *Article*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: basic
	 * - **API ID Path**: article.tier
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	tier: prismic.SelectField<"basic" | "accent" | "priority", "filled">;
	
	/**
	 * Важность Basic field in *Article*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: medium
	 * - **API ID Path**: article.weight
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	weight: prismic.SelectField<"high" | "medium" | "low", "filled">;
	
	/**
	 * Закрепить field in *Article*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: article.pinned
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	pinned: prismic.BooleanField;
	
	/**
	 * Порядок (меньше — выше) field in *Article*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.position
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	position: prismic.NumberField;
	
	/**
	 * Категория field in *Article*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.category
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	category: prismic.SelectField<"hardware" | "games" | "ai">;
	
	/**
	 * Изображение field in *Article*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Видео (иконка Play) field in *Article*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: article.is_video
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	is_video: prismic.BooleanField;
	
	/**
	 * Лайки field in *Article*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.likes
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	likes: prismic.NumberField;
	
	/**
	 * Репосты field in *Article*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.reposts
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	reposts: prismic.NumberField;
}

/**
 * Article document from Prismic
 *
 * - **API ID**: `article`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ArticleDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ArticleDocumentData>, "article", Lang>;

type PageDocumentDataSlicesSlice = BasicSlice

/**
 * Content for page documents
 */
interface PageDocumentData {
	/**
	 * Slice Zone field in *page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PageDocumentDataSlicesSlice>;
}

/**
 * page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

export type AllDocumentTypes = ArticleDocument | PageDocument;

/**
 * Primary content in *basic → Default → Primary*
 */
export interface BasicSliceDefaultPrimary {
	/**
	 * Size field in *basic → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Select size
	 * - **Default Value**: M
	 * - **API ID Path**: basic.default.primary.size
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	size: prismic.SelectField<"S" | "M" | "L", "filled">;
	
	/**
	 * Image field in *basic → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: basic.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Title field in *basic → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Card title...
	 * - **API ID Path**: basic.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
}

/**
 * Default variation for basic Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BasicSliceDefault = prismic.SharedSliceVariation<"default", Simplify<BasicSliceDefaultPrimary>, never>;

/**
 * Slice variation for *basic*
 */
type BasicSliceVariation = BasicSliceDefault

/**
 * basic Shared Slice
 *
 * - **API ID**: `basic`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BasicSlice = prismic.SharedSlice<"basic", BasicSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			ArticleDocument,
			ArticleDocumentData,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			AllDocumentTypes,
			BasicSlice,
			BasicSliceDefaultPrimary,
			BasicSliceVariation,
			BasicSliceDefault
		}
	}
}