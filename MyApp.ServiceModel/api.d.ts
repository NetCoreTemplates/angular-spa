// docs: https://docs.servicestack.net/autoquery/okai-models

declare global {
    export class bool {}
    export class byte {} export class Byte {}
    export class sbyte {} export class SByte {}
    export class char {} export class Char {}
    export class decimal {} export class Decimal {}
    export class double {} export class Double {}
    export class float {} export class Single {}
    export class int {} export class Int32 {}
    export class uint {} export class UInt32 {}
    export class nint {} export class IntPtr {}
    export class nuint {} export class UIntPtr {}
    export class long {} export class Int64 {}
    export class ulong {} export class UInt64 {}
    export class short {} export class Int16 {}
    export class ushort {} export class UInt16 {}
    export class dynamic {} export class Dynamic {}
    export class DateTime {}
    export class TimeSpan {}
    export class DateOnly {}
    export class TimeOnly {}
    export class DateTimeOffset {}
    export class Guid {}
    export class List<T> {}
    export class HashSet<T> {}
    export class Dictionary<Key,Value> {}
    export class Color {}

    export interface IReturn<T> {}
    export interface IReturnVoid {}

    export interface IGet {}
    export interface IPost {}
    export interface IPut {}
    export interface IPatch {}
    export interface IDelete {}
    export interface IOptions {}

    export interface ICreateDb<Table> {}
    export interface IPatchDb<Table> {}
    export interface IUpdateDb<Table> {}
    export interface IDeleteDb<Table> {}
    export class QueryDb<T> extends QueryBase {}
    export class QueryDb2<From,Into> extends QueryBase {}
    export class QueryBase {}

    export interface IHasSessionId {}
    export interface IHasBearerToken {}

    export class EmptyResponse {}
    export class IdResponse {}
    export class StringsResponse {}
    export class StringResponse {}
    export class IntResponse {}
    export class BoolResponse {}
    export class ErrorResponse {}
    export class ResponseError {}
    export class ResponseStatus {}

    export class AuditBase {
        createdDate: Date
        createdBy: string
        modifiedDate: Date
        modifiedBy: string
        deletedDate?: Date
        deletedBy?: string
    }

    // Assume User DTO exists
    export class User {
        id: string
        userName: string
        email: string
        firstName: string
        lastName: string
        displayName: string
        profileUrl: string
    }

    export type TypeOf = `typeof(${string})`
    export type InputAttrOptions = { type?:string, value?:string, placeholder?:string, help?:string, label?:string, title?:string, size?:string,
        pattern?:string, readOnly?:boolean, required?:boolean, disabled?:boolean, autocomplete?:string, autofocus?:string,
        min?:string, max?:string, step?:string, minLength?:number, maxLength?:number, accept?:string, capture?:string, multiple?:boolean,
        allowableValues?:string[], allowableValuesEnum?:TypeOf, options?:string, ignore?:boolean, evalAllowableValues?:string, evalAllowableEntries?:string, }
    export type ScriptValueOptions = { value?: any,  expression?: string, eval?: string,  noCache?: boolean }

    type ClassDecoratorDef = (
        target: any,
        context: ClassDecoratorContext
    ) => void

    type ClassFieldDecoratorDef = (
        target: any,
        context: ClassFieldDecoratorContext
    ) => void

    type ClassOrFieldDecoratorDef = (
        target: any,
        context: ClassDecoratorContext | ClassFieldDecoratorContext
    ) => void

    export function validateRequest(validator:string) : ClassDecoratorDef
    export function validateIsAuthenticated() : ClassDecoratorDef
    export function validateIsAdmin() : ClassDecoratorDef
    export function validateAuthSecret() : ClassDecoratorDef
    export function validateHasRole(role:string) : ClassDecoratorDef
    export function validateHasRoles(roles:string[]) : ClassDecoratorDef
    export function validateHasPermission(permission:string) : ClassDecoratorDef
    export function validateHasPermissions(permissions:string[]) : ClassDecoratorDef
    export function validateHasClaim(claim:string) : ClassDecoratorDef
    export function validateHasScope(scope:string) : ClassDecoratorDef
    export function validateApiKey(scope?:string) : ClassDecoratorDef

    export function schema(schema:string) : ClassDecoratorDef
    export function compositeKey(columns:string[]) : ClassDecoratorDef
    export function compositeIndex(unique:boolean, columns:string[]) : ClassDecoratorDef
    export function preCreateTable(sql:string) : ClassDecoratorDef
    export function preDropTable(sql:string) : ClassDecoratorDef
    export function postCreateTable(sql:string) : ClassDecoratorDef
    export function postDropTable(sql:string) : ClassDecoratorDef

    export function api(description:string, opt?:{ bodyParameter?:number, requestContentType?:string, isRequired?:boolean }) : ClassDecoratorDef
    export function apiResponse(statusCode:number, description:string, opt?:{ isDefaultResponse?:boolean, responseType?:TypeOf }) : ClassDecoratorDef

    export function dataContract() : ClassDecoratorDef
    export function route(path:string, opt?:{ summary?:string, notes?:string, verbs?:string, priority?:number, matches?:string, }|string) : ClassDecoratorDef
    export function icon(opt?:{ svg?:string, uri?:string, alt?:string, cls?:string, }) : ClassDecoratorDef
    export function field(opt?:InputAttrOptions & { name?:string, fieldCss?:string, inputCss?:string, labelCss?:string, }) : ClassDecoratorDef
    export function tag(name?:string) : ClassDecoratorDef
    export function worker(name:string) : ClassDecoratorDef
    export function notes(notes:string) : ClassDecoratorDef
    export function namedConnection(name:string) : ClassDecoratorDef
    export function explorerCss(opt?:{ form?:string, fieldset?:string, field?:string, }) : ClassDecoratorDef
    export function locodeCss(opt?:{ form?:string, fieldset?:string, field?:string, }) : ClassDecoratorDef

    export enum QueryTerm { Default = 0, And = 1, Or = 2, Ensure = 3, }
    export function queryDb(defaultTerm:QueryTerm) : ClassDecoratorDef
    export function queryData(defaultTerm:QueryTerm) : ClassDecoratorDef
    export function autoFilter(term:QueryTerm, field?:string, opt?:{ operand?:string, template?:string, valueFormat:string }) : ClassDecoratorDef
    export function autoPopulate(field?:string, opt?:ScriptValueOptions) : ClassDecoratorDef
    export function autoApply(name:string|Behavior, args?:string[]) : ClassDecoratorDef

    export class SqlTemplate {
        static IsNull: string
        static IsNotNull: string
        static GreaterThanOrEqual: string
        static GreaterThan: string
        static LessThan: string
        static LessThanOrEqual: string
        static NotEqual: string
        static CaseSensitiveLike: string
        static CaseInsensitiveLike: string
    }
    export enum Behavior {
        AuditQuery,
        AuditCreate,
        AuditModify,
        AuditDelete,
        AuditSoftDelete,
    }

    export function alias(table:string) : ClassOrFieldDecoratorDef
    export function meta(name:string,value:string) : ClassOrFieldDecoratorDef
    export function priority(value:string) : ClassOrFieldDecoratorDef
    export function description(description:string) : ClassOrFieldDecoratorDef

    // Enum decorators
    export function flags() : ClassDecoratorDef
    export function enumMember(opt:{ value:string }) : ClassFieldDecoratorDef

    export function validate(validator?:string) : ClassFieldDecoratorDef
    export function validateNull() : ClassFieldDecoratorDef
    export function validateEmpty() : ClassFieldDecoratorDef
    export function validateEmail() : ClassFieldDecoratorDef
    export function validateNotNull() : ClassFieldDecoratorDef
    export function validateNotEmpty() : ClassFieldDecoratorDef
    export function validateCreditCard() : ClassFieldDecoratorDef
    export function validateLength(min:number, max:number) : ClassFieldDecoratorDef
    export function validateExactLength(length:number) : ClassFieldDecoratorDef
    export function validateMinimumLength(min:number) : ClassFieldDecoratorDef
    export function validateMaximumLength(max:number) : ClassFieldDecoratorDef
    export function validateLessThan(value:number) : ClassFieldDecoratorDef
    export function validateLessThanOrEqual(value:number) : ClassFieldDecoratorDef
    export function validateGreaterThan(value:number) : ClassFieldDecoratorDef
    export function validateGreaterThanOrEqual(value:number) : ClassFieldDecoratorDef
    export function validateScalePrecision(scale:number, precision:number) : ClassFieldDecoratorDef
    export function validateRegularExpression(pattern:string) : ClassFieldDecoratorDef
    export function validateEqualExpression(value:string|number|boolean) : ClassFieldDecoratorDef
    export function validateNotEqualExpression(value:string|number|boolean) : ClassFieldDecoratorDef
    export function validateInclusiveBetween(from:string|number,to:string|number) : ClassFieldDecoratorDef
    export function validateExclusiveBetween(from:string|number,to:string|number) : ClassFieldDecoratorDef

    export function allowReset() : ClassFieldDecoratorDef
    export function denyReset() : ClassFieldDecoratorDef

    export function primaryKey() : ClassFieldDecoratorDef
    export function autoId() : ClassFieldDecoratorDef
    export function autoIncrement() : ClassFieldDecoratorDef
    export function belongTo(BelongToTableType:TypeOf) : ClassFieldDecoratorDef
    export function index(opt?:{ name?:string, unique?:boolean, clustered?:boolean, nonClustered?:boolean, }) : ClassFieldDecoratorDef
    export function compute() : ClassFieldDecoratorDef
    export function computed() : ClassFieldDecoratorDef
    export function persisted() : ClassFieldDecoratorDef
    export function uniqueConstraint(columns:string[]) : ClassFieldDecoratorDef
    export function addColumn() : ClassFieldDecoratorDef
    export function removeColumn() : ClassFieldDecoratorDef
    export function checkConstraint(constraint:string) : ClassFieldDecoratorDef
    export function customField(sql:string, order?:number) : ClassFieldDecoratorDef
    export function customSelect(sql:string) : ClassFieldDecoratorDef
    export function customInsert(sql:string) : ClassFieldDecoratorDef
    export function customUpdate(sql:string) : ClassFieldDecoratorDef
    export function decimalLength(precision:number, scale?:number) : ClassFieldDecoratorDef
    export function Default(value:string|number|boolean) : ClassFieldDecoratorDef
    export function enumAsInt() : ClassFieldDecoratorDef
    export function excludeMetadata() : ClassFieldDecoratorDef
    export function excludeFromDescription() : ClassFieldDecoratorDef
    export function explicitAutoQuery() : ClassFieldDecoratorDef
    export type foreignKeyBehavior = "NO ACTION"|"RESTRICT"|"SET NULL"|"SET DEFAULT"|"CASCADE"
    export function foreignKey(type:string, opt?:{ onDelete?:foreignKeyBehavior, onUpdate?:foreignKeyBehavior, foreignKeyName?:string }) : ClassFieldDecoratorDef
    export function ignore() : ClassFieldDecoratorDef
    export function ignoreOnUpdate() : ClassFieldDecoratorDef
    export function ignoreOnInsert() : ClassFieldDecoratorDef
    export function ignoreDataMember() : ClassFieldDecoratorDef
    export function reference(opt?:{ selfId?:string, refId?:string, refLabel?:string }) : ClassFieldDecoratorDef
    export function referenceField(model:TypeOf, id?:string, field?:string) : ClassFieldDecoratorDef
    export function references(type:TypeOf) : ClassFieldDecoratorDef
    export function required() : ClassFieldDecoratorDef
    export function returnOnInsert() : ClassFieldDecoratorDef
    export function rowVersion() : ClassFieldDecoratorDef
    export function unique() : ClassFieldDecoratorDef

    export enum ValueStyle { Single, Multiple, List, }
    export function queryDbField(opt?:{ term:QueryTerm, operand?:string, template?:string, field?:string, valueFormat?:string, valueStyle?:ValueStyle, valueArity?:number }) : ClassFieldDecoratorDef
    export function queryDataField(opt?:{ term:QueryTerm, condition?:string, field?:string }) : ClassFieldDecoratorDef

    export enum AutoUpdateStyle { Always, NonDefaults }
    export function autoUpdate(style:AutoUpdateStyle) : ClassFieldDecoratorDef
    export function autoDefault(opt:ScriptValueOptions) : ClassOrFieldDecoratorDef
    export function autoMap(to:string) : ClassOrFieldDecoratorDef
    export function autoIgnore() : ClassFieldDecoratorDef

    export function apiMember(opt?:{ name?:string, verb?:string, parameterType?:string, description?:string, dataType?:string,
        format?:string, isRequired?:boolean, isOptional?:boolean, allowMultiple?:boolean, route?:string, excludeInSchema?:boolean
    }) : ClassFieldDecoratorDef
    export function apiAllowableValues(name:string, opt?:{ type?:"RANGE"|"LIST", min?:number, max?:number, values?:string[] }) : ClassFieldDecoratorDef

    export function dataMember(opt?:{ name?:string, order?:number, isRequired?:boolean }) : ClassFieldDecoratorDef
    export function input(opt?:InputAttrOptions) : ClassFieldDecoratorDef
    export function fieldCss(opt?:{ field?:string, input?:string, label?:string, }) : ClassFieldDecoratorDef
    export function uploadTo(location:string) : ClassFieldDecoratorDef
    export function ref(opt?:{ modelType?:TypeOf, model?:string, refId?:string, refLabel?:string, selfId?:string, queryType?:TypeOf, none?:boolean, }) : ClassFieldDecoratorDef
    export type FormatMethods = "currency"|"bytes"|"icon"|"iconRounded"|"attachment"|"link"|"linkMailTo"|"linkTel"|"enumFlags"|"hidden"
    export function format(method:FormatMethods, opt?:{ options?:string, locale?:string }) : ClassFieldDecoratorDef

    export enum IntlFormat { Number, DateTime, RelativeTime }
    export enum NumberStyle { Undefined=0, Decimal, Currency, Percent, Unit, }
    export enum DateStyle { Undefined=0, Full, Long, Medium, Short, }
    export enum TimeStyle { Undefined=0, Full, Long, Medium, Short, }
    export enum Numeric { Undefined=0, Always, Auto, }

    export enum DatePart { Undefined=0, Numeric, Digits2, }
    export enum DateMonth { Undefined=0, Numeric, Digits2, Narrow, Short, Long, }
    export enum DateText { Undefined=0, Narrow, Short, Long }

    export enum CurrencyDisplay { Undefined=0, Symbol, NarrowSymbol, Code, Name, }
    export enum CurrencySign { Undefined=0, Accounting, Standard, }
    export enum SignDisplay { Undefined=0, Always, Auto, ExceptZero, Negative, Never, }
    export enum RoundingMode { Undefined=0, Ceil, Floor, Expand, Trunc, HalfCeil, HalfFloor, HalfExpand, HalfTrunc, HalfEven, }

    export enum UnitDisplay { Undefined=0, Long, Short, Narrow }
    export enum Notation { Undefined=0, Standard, Scientific, Engineering, Compact, }

    export type IntlOptions = { locale?:string, options?:string, number?:NumberStyle, date?:DateStyle, time?:TimeStyle, numeric?:Numeric,
        currency?:string, currencyDisplay?:CurrencyDisplay, currencySign?:CurrencySign, signDisplay?:SignDisplay, roundingMode?:RoundingMode,
        unit?:string, unitDisplay?:UnitDisplay, notation?:Notation,
        minimumIntegerDigits?:number, minimumFractionDigits?:number, maximumFractionDigits?:number, minimumSignificantDigits?:number, maximumSignificantDigits?:number, fractionalSecondDigits?:number,
        weekday?:DateText, era?:DateText, year?:DatePart, month?:DateMonth, day?:DatePart, hour?:DatePart, minute?:DatePart, second?:DatePart,
        timeZoneName?:DateText, timeZone?:string, hour12?:boolean
    }

    export function intl(type:IntlFormat, opt?:IntlOptions) : ClassFieldDecoratorDef
    export function intlNumber(number?:NumberStyle|IntlOptions, opt?:IntlOptions) : ClassFieldDecoratorDef
    export function intlDateTime(date?:DateStyle, time?:TimeStyle) : ClassFieldDecoratorDef
    export function intlRelativeTime(numeric?:Numeric) : ClassFieldDecoratorDef

    //RequestAttrs & TypeAttrs & DataModelAttrs & RequestPropAttrs & DataModelPropAttrs
    export class All {
        // RequestAttrs
        api:typeof api
        apiResponse:typeof apiResponse
        validateRequest:typeof validateRequest
        validateIsAuthenticated:typeof validateIsAuthenticated
        validateIsAdmin:typeof validateIsAdmin
        validateAuthSecret:typeof validateAuthSecret
        validateHasRole:typeof validateHasRole
        validateHasRoles:typeof validateHasRoles
        validateHasPermission:typeof validateHasPermission
        validateHasPermissions:typeof validateHasPermissions
        validateHasClaim:typeof validateHasClaim
        validateHasScope:typeof validateHasScope
        validateApiKey:typeof validateApiKey

        queryDb:typeof queryDb
        queryData:typeof queryData
        autoFilter:typeof autoFilter
        autoPopulate:typeof autoPopulate
        autoApply:typeof autoApply

        route:typeof route
        field:typeof field
        tag:typeof tag
        notes:typeof notes

        // Type and Attrs
        dataContract:typeof dataContract

        // DataModelAttrs
        schema:typeof schema
        compositeKey:typeof compositeKey
        preCreateTable:typeof preCreateTable
        preDropTable:typeof preDropTable
        postCreateTable:typeof postCreateTable
        postDropTable:typeof postDropTable

        namedConnection:typeof namedConnection
        icon:typeof icon
        locodeCss: typeof locodeCss
        explorerCss: typeof explorerCss

        // Class or Field Attrs
        alias:typeof alias
        meta:typeof meta // Type
        flags:typeof flags // Enum

        // RequestPropAttrs
        validate:typeof validate
        validateNull:typeof validateNull
        validateEmpty:typeof validateEmpty
        validateEmail:typeof validateEmail
        validateNotNull:typeof validateNotNull
        validateNotEmpty:typeof validateNotEmpty
        validateCreditCard:typeof validateCreditCard
        validateLength:typeof validateLength
        validateExactLength:typeof validateExactLength
        validateMinimumLength:typeof validateMinimumLength
        validateMaximumLength:typeof validateMaximumLength
        validateLessThan:typeof validateLessThan
        validateLessThanOrEqual:typeof validateLessThanOrEqual
        validateGreaterThan:typeof validateGreaterThan
        validateGreaterThanOrEqual:typeof validateGreaterThanOrEqual
        validateScalePrecision:typeof validateScalePrecision
        validateRegularExpression:typeof validateRegularExpression
        validateEqualExpression:typeof validateEqualExpression
        validateNotEqualExpression:typeof validateNotEqualExpression
        validateInclusiveBetween:typeof validateInclusiveBetween
        validateExclusiveBetween:typeof validateExclusiveBetween
        allowReset:typeof allowReset
        denyReset:typeof denyReset

        queryDbField:typeof queryDbField
        queryDataField:typeof queryDataField
        autoUpdate:typeof autoUpdate
        autoDefault:typeof autoDefault
        autoMap:typeof autoMap
        autoIgnore:typeof autoIgnore

        apiMember:typeof apiMember
        apiAllowableValues:typeof apiAllowableValues
        dataMember:typeof dataMember
        input:typeof input
        fieldCss:typeof fieldCss
        uploadTo:typeof uploadTo

        enumMember:typeof enumMember

        // DataModelPropAttrs
        // alias:typeof alias
        // meta:typeof meta
        priority:typeof priority
        description:typeof description

        primaryKey:typeof primaryKey
        autoId:typeof autoId
        autoIncrement:typeof autoIncrement
        index:typeof index
        compute:typeof compute
        computed:typeof computed
        persisted:typeof persisted
        uniqueConstraint:typeof uniqueConstraint
        addColumn:typeof addColumn
        removeColumn:typeof removeColumn
        belongTo:typeof belongTo
        checkConstraint:typeof checkConstraint
        customField:typeof customField
        customSelect:typeof customSelect
        customInsert:typeof customInsert
        customUpdate:typeof customUpdate
        decimalLength:typeof decimalLength
        Default:typeof Default
        enumAsInt:typeof enumAsInt
        excludeMetadata:typeof excludeMetadata
        excludeFromDescription:typeof excludeFromDescription
        explicitAutoQuery:typeof explicitAutoQuery
        foreignKey:typeof foreignKey
        ignore:typeof ignore
        ignoreOnUpdate:typeof ignoreOnUpdate
        ignoreOnInsert:typeof ignoreOnInsert
        ignoreDataMember:typeof ignoreDataMember
        reference:typeof reference
        referenceField:typeof referenceField
        references:typeof references
        required:typeof required
        returnOnInsert:typeof returnOnInsert
        rowVersion:typeof rowVersion
        unique:typeof unique

        ref:typeof ref
        format:typeof format
        intl:typeof intl
        intlNumber:typeof intlNumber
        intlDateTime:typeof intlDateTime
        intlRelativeTime:typeof intlRelativeTime
    }
    export const Read : All
    export const Write : All
    export const Create : All
    export const Update : All
    export const Delete : All
}

export {}