import { Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppMetadata, MetadataApp, UiConfig } from 'src/components/types';
import { JsonServiceClient, MetadataPropertyType, MetadataType, toDate, toDateTime } from '@servicestack/client';

@Injectable({
    providedIn: 'root'
})
export class MetadataService {
    metadataPath = "/metadata/app.json"
    public ui: Signal<UiConfig>;

    constructor(private router: Router, private client:JsonServiceClient) {
        this.ui = signal<UiConfig>({
            redirectSignIn: '/signin',
            redirectSignOut: '/auth/logout',
            navigate: (url: string) => router.navigateByUrl(url),
            assetsPathResolver: (src: string) => src,
            fallbackPathResolver: (src: string) => src,
            storage: new LocalStore(),
            userIcon: { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#4a5565" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5"/><path fill="#4a5565" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2m7.993 22.926A5 5 0 0 0 19 20h-6a5 5 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0"/></svg>` },
            tableIcon: { svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><g fill='none' stroke='currentColor' stroke-width='1.5'><path d='M5 12v6s0 3 7 3s7-3 7-3v-6'/><path d='M5 6v6s0 3 7 3s7-3 7-3V6'/><path d='M12 3c7 0 7 3 7 3s0 3-7 3s-7-3-7-3s0-3 7-3Z'/></g></svg>` },
        });
        this.loadMetadata({ olderThan:0 })
    }

    metadata = signal<AppMetadata|null>(null)

    /** Check if AppMetadata is valid */
    isMetadataValid(metadata: AppMetadata | null | undefined) {
        return metadata?.api?.operations && metadata.api.operations.length > 0
    }

    /** Get get AppMetadata instance */
    getMetadata(opt?: { assert?: boolean }): any { // use 'any' to avoid type explosion    
        if (!this.tryLoad() && opt?.assert && !this.metadata())
            throw new Error('useMetadata() not configured, see: https://docs.servicestack.net/vue/use-metadata')

        return this.metadata()
    }

    /** Explicitly set AppMetadata and save to localStorage */
    setMetadata(metadata: AppMetadata | null | undefined) {
        if (metadata && this.isMetadataValid(metadata)) {
            metadata.date = toDateTime(new Date())
            this.metadata.set(metadata)
            if (typeof localStorage != 'undefined') localStorage.setItem(this.metadataPath, JSON.stringify(metadata))
            return true
        }
        return false
    }

    /** Delete AppMetadata and remove from localStorage */
    clearMetadata() {
        this.metadata.set(null)
        if (typeof localStorage != 'undefined') localStorage.removeItem(this.metadataPath)
    }

    tryLoad() {
        if (this.metadata() != null) return true
        let metadata: AppMetadata | null = (globalThis as any).Server
        if (this.isMetadataValid(metadata)) {
            this.setMetadata(metadata)
        } else {
            const json = typeof localStorage != 'undefined' ? localStorage.getItem(this.metadataPath) : null
            if (json) {
                try {
                    this.setMetadata(JSON.parse(json) as AppMetadata)
                } catch (e) {
                    console.error(`Could not JSON.parse ${this.metadataPath} from localStorage`)
                }
            }
        }
        return this.metadata() != null
    }

    async downloadMetadata(metadataPath: string, resolve?: () => Promise<Response>) {
        let r = resolve
            ? await resolve()
            : await fetch(metadataPath)
        if (r.ok) {
            let json = await r.text()
            this.setMetadata(JSON.parse(json) as AppMetadata)
        } else {
            console.error(`Could not download ${resolve ? 'AppMetadata' : metadataPath}: ${r.statusText}`)
        }
        if (!this.isMetadataValid(this.metadata())) {
            console.warn('AppMetadata is not available')
        }
    }

    /** Load {AppMetadata} if needed 
     * @param olderThan   - Reload metadata if age exceeds ms
     * @param resolvePath - Override `/metadata/app.json` path use to fetch metadata
     * @param resolve     - Use a custom fetch to resolve AppMetadata
    */
    async loadMetadata(args: {
        olderThan?: number,
        resolvePath?: string,
        resolve?: () => Promise<Response>
    }) {
        const { olderThan, resolvePath, resolve } = args || {}
        let hasMetadata = this.tryLoad() && olderThan !== 0
        const M = this.metadata()
        if (hasMetadata && olderThan) {
            let date = toDate(M?.date)
            if (!date || (new Date().getTime() - date.getTime()) > olderThan) {
                hasMetadata = false
            }
        }
        if (!hasMetadata) {
            // If provided user-defined paths
            if (resolvePath || resolve) {
                await this.downloadMetadata(resolvePath || this.metadataPath, resolve)
                if (M != null) return
            }

            // If has registered API client
            const api = await this.client.api(new MetadataApp())
            if (api.succeeded) {
                this.setMetadata(api.response)
            }
            if (M != null) return

            // Default to /metadata/app.json
            await this.downloadMetadata(this.metadataPath)
        }
        return M as any // avoid type explosion in api.d.ts until needed
    }

    /**
     * Resolve {MetadataType} for DTO name
     * @param name        - Find MetadataType by name
     * @param [namespace] - Find MetadataType by name and namespace 
     */
    typeOf(name?:string|null, namespace?: string|null) {
        const ui = this.ui()
        if (ui.typeResolver) {
            let type = ui.typeResolver(name!, namespace)
            if (type) return type
        }
        let api = this.metadata()?.api
        if (!api || !name) return null
        let type = api.types!.find(x => x.name!.toLowerCase() === name.toLowerCase() && (!namespace || x.namespace == namespace))
        if (type) return type
        let requestOp = this.apiOf(name)
        if (requestOp) return requestOp.request
        let responseOp = api.operations!.find(x => x.response && (x.response!.name!.toLowerCase() === name.toLowerCase() && (!namespace || x.response.namespace == namespace)))
        if (responseOp) return responseOp.response
        return null
    }

    /** Resolve Request DTO {MetadataOperationType} by name */
    apiOf(name: string) {
        const ui = this.ui()
        if (ui.apiResolver) {
            const op = ui.apiResolver(name)
            if (op) return op
        }
        let api = this.metadata()?.api
        if (!api) return null
        let requestOp = api.operations!.find(x => x.request!.name!.toLowerCase() === name.toLowerCase())
        return requestOp
    }

    /** Return all properties (inc. inherited) for {MetadataType} */
    typeProperties(type?:MetadataType|null) {
        if (!type) return []
        let props:MetadataPropertyType[] = []
        let existing:{[k:string]:number} = {}
        function addProps(xs:MetadataPropertyType[]) {
            xs.forEach(p => {
                if (existing[p.name!]) return
                existing[p.name!] = 1
                props.push(p)
            })
        }

        while (type) {
            if (type.properties) addProps(type.properties)
            type = type.inherits ? this.typeOfRef(type.inherits) : null
        }
        return props.map(prop => prop.type!.endsWith('[]')
            ? {...prop, type:'List`1', genericArgs:[prop.type!.substring(0,prop.type!.length-2)] }
            : prop)
    }

    /** Resolve {MetadataType} by {MetadataTypeName} */
    typeOfRef(ref?:{ name?:string, namespace?:string }) {
        return ref ? this.typeOf(ref.name, ref.namespace) : null
    }

    /** Format Enum Flags into expanded enum strings */
    enumFlags(value:number, options:any) {
        return this.expandEnumFlags(value, options).join(', ')
    }
    
    expandEnumFlags(value:number, options:any) {
        if (!options.type) {
            console.error(`enumDescriptions missing {type:'EnumType'} options`)
            return [`${value}`]
        }
        const enumType = this.typeOf(options.type)
        if (!enumType?.enumValues) {
            console.error(`Could not find metadata for ${options.type}`)
            return [`${value}`]
        }
        
        const to = []
        for (let i=0; i<enumType.enumValues.length; i++) {
            const enumValue = parseInt(enumType.enumValues[i])
            if (enumValue > 0 && (enumValue & value) === enumValue) {
                to.push(enumType.enumDescriptions?.[i] || enumType.enumNames?.[i] || `${value}`)
            }
        }
        return to
    }

    /** Resolve Enum entries for Enum Type by name */
    enumOptions(name:string) {
        return this.enumOptionsByType(this.typeOf(name))
    }

    /** Resolve Enum entries for Enum Type by MetadataType */
    enumOptionsByType(type?:MetadataType|null) {
        if (type && type.isEnum && type.enumNames != null) {
            let to:{[name:string]:string} = {}
            for (let i=0; i<type.enumNames.length; i++) {
                const name = (type.enumDescriptions ? type.enumDescriptions[i] : null) || type.enumNames[i]
                const key = (type.enumValues != null ? type.enumValues[i] : null) || type.enumNames[i]
                to[key] = name
            }
            return to
        }
        return null
    }    
}

export class LocalStore implements Storage {
    get length() { return typeof localStorage == "undefined" ? 0 : localStorage.length }
    getItem(key: string) {
        if (typeof localStorage == "undefined") return null
        return localStorage.getItem(key)
    }
    setItem(key: string, value: string) {
        if (typeof localStorage == "undefined") return
        localStorage.setItem(key, value)
    }
    removeItem(key: string) {
        if (typeof localStorage == "undefined") return
        localStorage.removeItem(key)
    }
    clear() {
        if (typeof localStorage == "undefined") return
        localStorage.clear()
    }
    key(index: number) {
        if (typeof localStorage == "undefined") return null
        return localStorage.key(index)
    }
}
