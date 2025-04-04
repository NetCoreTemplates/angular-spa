import { enc, omit, toDate, toTime } from "@servicestack/client"

/** Format Date into required input[type=date] format */
export function dateInputFormat(value:Date|string|Object) {
    if (value == null || typeof value == 'object') return ''
    const d = toDate(value)
    if (d == null || d.toString() == 'Invalid Date') return ''
    return d.toISOString().substring(0,10) ?? ''
}

export function dateTimeInputFormat(value:Date|string|Object) {
    if (value == null || typeof value == 'object') return ''
    const d = toDate(value)
    if (d == null || d.toString() == 'Invalid Date') return ''
    return d.toISOString().substring(0,19) ?? ''
}

/** Format TimeSpan or Date into required input[type=time] format */
export function timeInputFormat(s?:string|number|Date|null) { return s == null ? '' : toTime(s) }

export function textInputValue(type:string, value:any) {
    let ret = type === 'date'
        ? dateInputFormat(value) 
        : type === 'datetime-local'
            ? dateTimeInputFormat(value) 
            : type === 'time'
                ? timeInputFormat(value) 
                : value
    const t = typeof ret
    ret = ret == null
        ? ''
        : t == 'boolean' || t == 'number'
            ? `${ret}`
            : ret
    return ret
}

/** Resolve Request DTO name from a Request DTO instance */
export function getTypeName(type?:string|InstanceType<any>|Function) {
    if (!type) return null
    if (typeof type == 'string')
        return type
    const dto = typeof type == 'function' 
        ? new type() 
        : typeof type == 'object' 
            ? type
            : null
    if (!dto) 
        throw new Error(`Invalid DTO Type '${typeof type}'`)
    if (typeof dto['getTypeName'] != 'function') 
        throw new Error(`${JSON.stringify(dto)} is not a Request DTO`)
    const ret = dto.getTypeName() as string
    if (!ret) 
        throw new Error('DTO Required')
    return ret
}

/** Resolve Absolute URL from relative path */
export function toAppUrl(url:string) {
    //return assetsPathResolver(url)
    return url
}

/** HTML Tag builder */
export function htmlTag(tag:string,child?:string,attrs?:any) {
    if (!attrs) attrs = {}
    let cls = attrs.cls || attrs.className || attrs['class']
    if (cls) {
        attrs = omit(attrs,['cls','class','className'])
        attrs['class'] = cls
    }
    return child == null
        ? `<${tag}` + htmlAttrs(attrs) + `/>`
        : `<${tag}` + htmlAttrs(attrs) + `>${child||''}</${tag}>`
}

/** Convert object dictionary into encoded HTML attributes */
export function htmlAttrs(attrs:any) {
    return Object.keys(attrs).reduce((acc,k) => `${acc} ${k}="${enc(attrs[k])}"`, '')
}

/** Convert HTML Anchor attributes into encoded HTML attributes */
export function linkAttrs(attrs:{href:string,cls?:string,target?:string,rel?:string}) {
    return Object.assign({target:'_blank',rel:'noopener','class':'text-blue-600'},attrs)
}

let scalarTypes = ['string','number','boolean','null','undefined']

/** Check if value is a scalar type */
export function isPrimitive(value:any) { return scalarTypes.indexOf(typeof value) >= 0 || value instanceof Date }

/** Check if value is a non-scalar type */
export function isComplexType(value:any) { return !isPrimitive(value) }

export function scopedExpr(src:string, ctx:Record<string,any>) {
    const invalidTokens = ['function','Function','eval','=>',';']
    if (invalidTokens.some(x => src.includes(x))) {
        throw new Error(`Unsafe script: '${src}'`)
    }

    const scope = Object.assign(Object.keys(globalThis).reduce((acc,k) => { 
        acc[k] = undefined; return acc 
        }, {} as Record<string,any>)
        , ctx)
    return (new Function( "with(this) { return (" + src + ") }")).call(scope)
}
