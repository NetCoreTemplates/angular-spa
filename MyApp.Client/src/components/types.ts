import { FormatInfo, ImageInfo, MetadataOperationType, MetadataType, MetadataTypes } from "@servicestack/client";

export type FormStyle = "slideOver" | "card"
export type TableStyle = "simple" | "fullWidth" | "stripedRows" | "whiteBackground" | "uppercaseHeadings" | "verticalLines"
export type TableStyleOptions = TableStyle | TableStyle[] | string
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"


export interface UiConfig {
    redirectSignIn?: string
    redirectSignOut?: string
    navigate?: (url: string) => void
    assetsPathResolver: (src: string) => string
    fallbackPathResolver: (src: string) => string
    apisResolver?: (type: string | null, metaTypes?: MetadataTypes | null) => AutoQueryApis | null
    apiResolver?: (name: string) => MetadataOperationType | null
    typeResolver?: (name: string, namespace?: string | null) => MetadataType | null
    inputValue?: (type: string, value: any) => string | null
    storage?: Storage
    userIcon?: ImageInfo
    tableIcon?: ImageInfo
    scopeWhitelist?: { [k: string]: Function }
}
export interface AutoQueryApis {
    Query?: MetadataOperationType;
    QueryInto?: MetadataOperationType;
    Create?: MetadataOperationType;
    Update?: MetadataOperationType;
    Patch?: MetadataOperationType;
    Delete?: MetadataOperationType;
}
export interface AppMetadata {
    date: string;
    api: MetadataTypes;
}
export interface ApiFormat {
    locale?: string;
    assumeUtc?: boolean;
    number?: FormatInfo;
    date?: FormatInfo;
}
export class MetadataApp {
    public view?: string;
    public includeTypes?: string[];

    public constructor(init?: Partial<MetadataApp>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'MetadataApp'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return {} as AppMetadata }
}
