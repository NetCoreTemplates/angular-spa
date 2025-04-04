import type { ApiFormat } from './types'
import { fromXsdDuration, indexOfAny, isDate, toDate, dateFmt, enc, apiValue, timeFmt12, appendQueryString, omit, FormatInfo, } from "@servicestack/client"
import { formatBytes, getFileName, getExt, canPreview, iconFallbackSrc, iconOnError } from './files'
import { toAppUrl, htmlTag, linkAttrs, isPrimitive, dateInputFormat, scopedExpr } from './utils'

// Calc TZOffset: (defaultFormats.assumeUtc ? new Date().getTimezoneOffset() * 1000 * 60 : 0)
let nowMs = () => new Date().getTime()

let DateChars = ['/','T',':','-']

export type DefaultFormats = ApiFormat & { maxFieldLength?: number, maxNestedFields?: number, maxNestedFieldLength?: number }

let defaultFormats:DefaultFormats = {
    //locale: null,
    assumeUtc: true,
    //number: null,
    date: {
        method: "Intl.DateTimeFormat",
        options: "{dateStyle:'medium'}"
    },
    maxFieldLength: 150,
    maxNestedFields: 2,
    maxNestedFieldLength: 30,
}

let defaultRtf = new Intl.RelativeTimeFormat(defaultFormats.locale, {})
let year =  24 * 60 * 60 * 1000 * 365
let units:{[k:string|Intl.RelativeTimeFormatUnit]:number} = {
    year,
    month : year/12,
    day   : 24 * 60 * 60 * 1000,
    hour  : 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
}

let Formatters:{[k:string]:Function} = {
    currency,
    bytes,
    link,
    linkTel,
    linkMailTo,
    icon,
    iconRounded,
    attachment,
    hidden,
    time,
    relativeTime,
    relativeTimeFromMs,
    formatDate,
    formatNumber,
}
if (!('iconOnError' in globalThis)) (globalThis as any).iconOnError = iconOnError

/** Available format methods to use in <PreviewFormat /> */
export class Formats
{
    public static currency:FormatInfo =           { method: 'currency' }
    public static bytes:FormatInfo =              { method: 'bytes' }
    public static link:FormatInfo =               { method: 'link' }
    public static linkTel:FormatInfo =            { method: 'linkTel' }
    public static linkMailTo:FormatInfo =         { method: 'linkMailTo' }
    public static icon:FormatInfo =               { method: 'icon' }
    public static iconRounded:FormatInfo =        { method: 'iconRounded' }
    public static attachment:FormatInfo =         { method: 'attachment' }
    public static time:FormatInfo =               { method: 'time' }
    public static relativeTime:FormatInfo =       { method: 'relativeTime' }
    public static relativeTimeFromMs:FormatInfo = { method: 'relativeTimeFromMs' }
    public static date:FormatInfo =               { method: 'formatDate' }
    public static number:FormatInfo =             { method: 'formatNumber' }
    public static hidden:FormatInfo =             { method: 'hidden' }
    public static enumFlags:FormatInfo =          { method: 'enumFlags' }
}

/** Set default locale, number and Date formats */
export function setDefaultFormats(newFormat:DefaultFormats) {
    defaultFormats = Object.assign({}, defaultFormats, newFormat)
}

/** Register additional formatters for use in <PreviewFormat /> */
export function setFormatters(formatters:{[name:string]:Function}) {
    Object.keys(formatters || {}).forEach(name => {
        if (typeof formatters[name] == 'function') {
            Formatters[name] = formatters[name]
        }
    })
}
export function getFormatters() {
    return Formatters
}

function fmtAttrs(s:string, attrs?:any) {
    return attrs ? htmlTag('span', s, attrs) : s
}

/** Format number as Currency */
export function currency(val:number, attrs?:any) {
    const remaining = omit(attrs, ['currency'])
    return fmtAttrs(new Intl.NumberFormat(undefined,{style:'currency',currency:attrs?.currency||'USD'}).format(val), remaining)
}

/** Format number in human readable disk size */
export function bytes(val:number, attrs?:any) {
    return fmtAttrs(formatBytes(val), attrs)
}

/** Format URL as <a> link */
export function link(href:string, opt?:{cls?:string,target?:string,rel?:string}) {
    return htmlTag('a', href, linkAttrs({ ...opt, href }))
}

/** Format Phone Number as <a> tel: link */
export function linkTel(tel:string, opt?:{cls?:string,target?:string,rel?:string}) {
    return htmlTag('a', tel, linkAttrs({...opt, href:`tel:${tel}` }))
}

/** Format email as <a> mailto: link */
export function linkMailTo(email:string, opt?:{subject?:string,body?:string,cls?:string,target?:string,rel?:string}) {
    if (!opt) opt = {}
    let { subject, body } = opt
    let attrs = omit(opt, ['subject','body'])
    let args:{[k:string]:string} = {}
    if (subject) args['subject'] = subject
    if (body) args['body'] = body
    return htmlTag('a', email, linkAttrs({...attrs, href:`mailto:${appendQueryString(email,args)}` }))
}

/** Format Image URL as an Icon */
export function icon(url:string,attrs?:any) {
    return htmlTag('img', undefined, Object.assign({ 'class': 'w-6 h-6', title:url, src:toAppUrl(url), onerror:"iconOnError(this)" }, attrs))
}

/** Format Image URL as a full rounded Icon */
function iconRounded(url:string,attrs?:any) {
    return htmlTag('img', undefined, Object.assign({ 'class': 'w-8 h-8 rounded-full', title:url, src:toAppUrl(url), onerror:"iconOnError(this)" }, attrs))
}

/** Format File attachment URL as an Attachment */
export function attachment(url:string,attrs?:any) {
    let fileName = getFileName(url)
    let ext = getExt(fileName)
    let imgSrc = ext == null || canPreview(url)
        ? toAppUrl(url)
        : iconFallbackSrc(url)
    const src = toAppUrl(imgSrc!)
    let iconClass = attrs && (attrs['icon-class'] || attrs['iconClass'])
    let img = htmlTag('img', undefined, Object.assign({ 'class': 'w-6 h-6', src, onerror:"iconOnError(this,'att')" }, iconClass ? { 'class': iconClass } : null))
    let span = `<span class="pl-1">${fileName}</span>`
    return htmlTag('a', img + span, Object.assign({ 'class':'flex', href:toAppUrl(url), title:url }, attrs ? omit(attrs,['icon-class','iconClass']) : null))
}

/** Format as empty string */
export function hidden(o:any) { return '' }

/** Format duration in time format */
export function time(o:any, attrs?:any) {
    let date = typeof o == 'string'
        ? new Date(fromXsdDuration(o) * 1000)
        : isDate(o)
            ? toDate(o)
            : null
    return fmtAttrs(date ? timeFmt12(date) : o, attrs)
}

/** Format as Date */
export function formatDate(d:Date|string|number, attrs?:any) {
    if (d == null) return ''
    let date = typeof d == 'number'
        ? new Date(d)
        : typeof d == 'string'
            ? toDate(d)
            : d
    if (!isDate(date)) {
        console.warn(`${date} is not a Date value`)
        return d == null ? '' : `${d}`
    }
    let f = defaultFormats.date
        ? formatter(defaultFormats.date)
    : null
    return fmtAttrs(typeof f == 'function' ? f(date) : dateFmt(date), attrs)
}

/** Format as Number */
export function formatNumber(n:number, attrs?:any) {
    if (typeof n != 'number') return n
    let f = defaultFormats.number
        ? formatter(defaultFormats.number)
        : null
    let ret = typeof f == 'function' ? f(n) : `${n}`
    if (ret === '') {
        console.warn(`formatNumber(${n}) => ${ret}`, f)
        ret = `${n}`
    }
    return fmtAttrs(ret, attrs)
}

/** Format human readable ms */
export function humanifyMs(ms:number): string {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
        return `${days}d ${humanifyMs(ms - days * 24 * 60 * 60_000)}`
    } else if (hours > 0) {
        return `${hours}h ${humanifyMs(ms - hours*60 * 60_000)}`
    } else if (minutes > 0) {
        return `${minutes}m ${humanifyMs(ms - minutes*60_000)}`
    } else if (seconds > 0) {
        return `${seconds}s`
    }
    return `${ms}ms`
}

/** Format human readable number */
export function humanifyNumber(n:number) {
    if (n >= 1_000_000_000)
        return (n / 1_000_000_000).toFixed(1) + "b"
    if (n >= 1_000_000)
        return (n / 1_000_000).toFixed(1) + "m"
    if (n >= 1_000)
        return (n / 1_000).toFixed(1) + "k"
    return n.toLocaleString()
}

/** Format an API Response value */
export function apiValueFmt(o:any, format?:FormatInfo|null, attrs?:any) {
    let ret = apiValue(o)
    let fn = format ? formatter(format) : null
    if (typeof fn == 'function') {
        let useAttrs = attrs
        if (format?.options) {
            try {
                useAttrs = scopedExpr(format.options, attrs)
            } catch(e) {
                console.error(`Could not evaluate '${format.options}'`, e, ', with scope:', attrs)
            }
        }
        return fn(o,useAttrs)
    }
    let fmt = (ret != null
        ? isDate(ret)
            ? formatDate(ret,attrs)
            : typeof ret == 'number' 
                ? formatNumber(ret,attrs)
                : ret
        : null)
    return fmt == null ? '' : fmt
}

/** Format any value or object graph */
export function formatValue(value:any, format?:FormatInfo|null, attrs?:any) {
    return isPrimitive(value) 
        ? apiValueFmt(value, format, attrs)
        : formatObject(value, format, attrs)
}

export function toRelativeNumber(val:string|Date|number) {
    if (val == null) return NaN
    if (typeof val == 'number')
        return val
    if (isDate(val))
        return (val as Date).getTime() - nowMs()
    if (typeof val === 'string') {
        let num = Number(val)
        if (!isNaN(num))
            return num
        if (val[0] === 'P' || val.startsWith('-P'))
            return fromXsdDuration(val) * 1000 * -1
        if (indexOfAny(val, DateChars) >= 0)
            return toDate(val).getTime() - nowMs()
    }
    return NaN
}

/** Format time in ms as Relative Time from now */
export function relativeTimeFromMs(elapsedMs:number,rtf?:Intl.RelativeTimeFormat) {
    for (let u in units) {
        if (Math.abs(elapsedMs) > units[u] || u === 'second')
            return (rtf || defaultRtf).format(Math.round(elapsedMs/units[u]), u as Intl.RelativeTimeFormatUnit)
    }
    return ''
}

/** Format Date as Relative Time from now */
export function relativeTime(val:string|Date|number,rtf?:Intl.RelativeTimeFormat) {
    let num = toRelativeNumber(val)
    if (!isNaN(num))
        return relativeTimeFromMs(num,rtf)
    return ''
}

/** Format difference between dates as Relative Time */
export function relativeTimeFromDate(d:Date, from?:Date) {
    return relativeTimeFromMs(d.getTime()-(from ? from.getTime() : nowMs()))
}

export function formatter(format:FormatInfo) {
    if (!format) return null
    let { method, options } = format
    let key = `${method}(${options})`
    let f = Formatters[key] || Formatters[method]
    if (typeof f == 'function') return f
    let loc = format.locale || defaultFormats.locale
    if (method.startsWith('Intl.')) {
        let locStr = loc ? `'${loc}'` : 'undefined'
        let intlExpr = `return new ${method}(${locStr},${options||'undefined'})`
        try {
            let intlFn = Function(intlExpr)()
            f = method === 'Intl.DateTimeFormat'
                ? (val:string|Date) => intlFn.format(toDate(val))
                : method === 'Intl.NumberFormat'
                    ? (val:string|number) => intlFn.format(Number(val))
                    : method === 'Intl.RelativeTimeFormat'
                        ? (val:string|Date|number) => relativeTime(val,intlFn)
                        : (val:any) => intlFn.format(val)
            return Formatters[key] = f
        } catch(e) {
            console.error(`Invalid format: ${intlExpr}`,e)
        }
    } else {
        let fmt = (globalThis as any)[method]
        if (typeof fmt == 'function') {
            let opt = options != null
                ? Function("return " + options)()
                : undefined
            f = (val:string) => fmt(val,opt,loc)
            return Formatters[key] = f
        }
        console.error(`No '${method}' function exists`, Object.keys(Formatters))
    }
    return null
}

/** Truncate text that exceeds maxLength with an ellipsis */
export function truncate(str:string, maxLength:number) {
    return !str ? '' 
        : str.length > maxLength 
            ? str.substring(0, maxLength) + '...'
            : str
}

function scrubStr(s:string) {
    return s.substring(0, 6) === '/Date('
        ? formatDate(toDate(s))
        : s
}
function displayObj(val:any) {
    return indentJson(scrub(val)).replace(/"/g,'')
}

function parseJson(o?:string|Object|any) {
    if (o == null || o === '') return ''
    if (typeof o == 'string') {
        try {
            return JSON.parse(o)
        } catch (e) {
            console.warn(`couldn't parse as JSON`, o)
        }
    }
    return o    
}

/** Only indent json */
export function indentJson(o:any, space=4) {
    o = parseJson(o)
    if (typeof o != 'object') return typeof o == 'string' ? o : `${o}`
    return JSON.stringify(o, undefined, space) 
}

/** Prettify & scrub an API JSON Response for human readability */
export function prettyJson(o:any) {
    o = parseJson(o)
    if (typeof o != 'object') return typeof o == 'string' ? o : `${o}`

    o = Object.assign({},o)
    o = scrub(o)
    return indentJson(o)
}

/** Traverse object and replace API values with readable formatted values */
export function scrub(o:any):any {
    if (o == null) return null
    if (typeof o == 'string') return scrubStr(o)
    if (isPrimitive(o)) return o
    if (o instanceof Date) return formatDate(o)
    if (Array.isArray(o)) return o.map(scrub)
    if (typeof o == 'object') {
        let to:{[k:string]:any} = {}
        Object.keys(o).forEach(k => {
            if (k == '__type') return
            to[k] = scrub(o[k])
        })
        return to
    }
    return o
}

export function formatObject(val:any, format?:FormatInfo|null, attrs?:any) {
    let obj = val
    if (Array.isArray(val)) {
        if (isPrimitive(val[0])) {
            return obj.join(',')
        }
        if (val[0] != null) obj = val[0]
    }
    if (obj == null) return ''
    if (obj instanceof Date) return formatDate(obj, attrs)
    
    let keys = Object.keys(obj)
    let sb = []
    for (let i=0; i<Math.min(defaultFormats.maxNestedFields!,keys.length); i++) {
        let k = keys[i]
        let val = `${scrub(obj[k])}`
        sb.push(`<b class="font-medium">${k}</b>: ${enc(truncate(scrubStr(val),defaultFormats.maxNestedFieldLength!))}`)
    }
    if (keys.length > 2) sb.push('...')
    return htmlTag('span', '{ ' + sb.join(', ') + ' }', Object.assign({ title:enc(displayObj(val)) }, attrs))
}

export function useFormatters() {

    return {
        Formats,
        setDefaultFormats,
        getFormatters,
        setFormatters,
        formatValue,
        formatter,
        dateInputFormat,
        currency,
        bytes,
        link,
        linkTel,
        linkMailTo,
        icon,
        iconRounded,
        attachment,
        hidden,
        time,
        relativeTime,
        relativeTimeFromDate,
        relativeTimeFromMs,
        formatDate,
        formatNumber,
        humanifyMs,
        humanifyNumber,
        
        indentJson,
        prettyJson,
        scrub,
        truncate,
        apiValueFmt,
        iconOnError,
    }
}
