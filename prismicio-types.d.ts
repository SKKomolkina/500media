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
 * Item in *Article → Связанные материалы*
 */
export interface ArticleDocumentDataRelatedItem {
	/**
	 * Материал field in *Article → Связанные материалы*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.related[].article
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	article: prismic.ContentRelationshipField<"article">;
}

type ArticleDocumentDataSlicesSlice = TextSectionSlice | ImageSliderSlice

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
	 * Авторство field in *Article*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.author
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	author: prismic.KeyTextField;
	
	/**
	 * Вводный текст field in *Article*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.lead
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	lead: prismic.RichTextField;
	
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
	
	/**
	 * Видеофайл (для ленты видео) field in *Article*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.video
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Описание для видео (раскрывается по свайпу) field in *Article*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.summary
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	summary: prismic.RichTextField;
	
	/**
	 * Связанные материалы field in *Article*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.related[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	related: prismic.GroupField<Simplify<ArticleDocumentDataRelatedItem>>;
	
	/**
	 * Содержимое статьи field in *Article*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: article.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ArticleDocumentDataSlicesSlice>;
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

type BlogPostDocumentDataSlicesSlice = TextBlockSlice

/**
 * Content for Blog Post documents
 */
interface BlogPostDocumentData {
	/**
	 * Slice Zone field in *Blog Post*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_post.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<BlogPostDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Blog Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: blog_post.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Blog Post*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: blog_post.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Blog Post*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: blog_post.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Blog Post document from Prismic
 *
 * - **API ID**: `blog_post`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type BlogPostDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<BlogPostDocumentData>, "blog_post", Lang>;

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

export type AllDocumentTypes = ArticleDocument | BlogPostDocument | PageDocument;

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

/**
 * Primary content in *ImageSlider → Items*
 */
export interface ImageSliderSliceDefaultItem {
	/**
	 * Изображение field in *ImageSlider → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: image_slider.items[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Default variation for ImageSlider Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageSliderSliceDefault = prismic.SharedSliceVariation<"default", Record<string, never>, Simplify<ImageSliderSliceDefaultItem>>;

/**
 * Slice variation for *ImageSlider*
 */
type ImageSliderSliceVariation = ImageSliderSliceDefault

/**
 * ImageSlider Shared Slice
 *
 * - **API ID**: `image_slider`
 * - **Description**: Слайдер изображений
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ImageSliderSlice = prismic.SharedSlice<"image_slider", ImageSliderSliceVariation>;

/**
 * Primary content in *Text Block → Default → Primary*
 */
export interface TextBlockSliceDefaultPrimary {
	/**
	 * Text field in *Text Block → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: text_block.default.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
}

/**
 * Default variation for Text Block Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextBlockSliceDefault = prismic.SharedSliceVariation<"default", Simplify<TextBlockSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Text Block*
 */
type TextBlockSliceVariation = TextBlockSliceDefault

/**
 * Text Block Shared Slice
 *
 * - **API ID**: `text_block`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextBlockSlice = prismic.SharedSlice<"text_block", TextBlockSliceVariation>;

/**
 * Primary content in *TextSection → Default → Primary*
 */
export interface TextSectionSliceDefaultPrimary {
	/**
	 * Подзаголовок (20 px) field in *TextSection → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Откуда берётся шум
	 * - **API ID Path**: text_section.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Текст field in *TextSection → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Текст раздела…
	 * - **API ID Path**: text_section.default.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	text: prismic.RichTextField;
}

/**
 * Default variation for TextSection Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextSectionSliceDefault = prismic.SharedSliceVariation<"default", Simplify<TextSectionSliceDefaultPrimary>, never>;

/**
 * Slice variation for *TextSection*
 */
type TextSectionSliceVariation = TextSectionSliceDefault

/**
 * TextSection Shared Slice
 *
 * - **API ID**: `text_section`
 * - **Description**: Раздел статьи: подзаголовок и текст
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextSectionSlice = prismic.SharedSlice<"text_section", TextSectionSliceVariation>;

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
			ArticleDocumentDataRelatedItem,
			ArticleDocumentDataSlicesSlice,
			BlogPostDocument,
			BlogPostDocumentData,
			BlogPostDocumentDataSlicesSlice,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			AllDocumentTypes,
			BasicSlice,
			BasicSliceDefaultPrimary,
			BasicSliceVariation,
			BasicSliceDefault,
			ImageSliderSlice,
			ImageSliderSliceDefaultItem,
			ImageSliderSliceVariation,
			ImageSliderSliceDefault,
			TextBlockSlice,
			TextBlockSliceDefaultPrimary,
			TextBlockSliceVariation,
			TextBlockSliceDefault,
			TextSectionSlice,
			TextSectionSliceDefaultPrimary,
			TextSectionSliceVariation,
			TextSectionSliceDefault
		}
	}
}