import MappingError = require("./mappingError");
import MappingFlags = require("./mappingFlags");
import InternalSessionFactory = require("../internalSessionFactory");
import Changes = require("./changes");
import Reference = require("../reference");
import PropertyFlags = require("./propertyFlags");
import InternalSession = require("../internalSession");
import ResultCallback = require("../core/resultCallback");
import ResolveContext = require("./resolveContext");
import ReadContext = require("./readContext");
import Observer = require("../observer");

interface InternalMapping {

    id: number;
    flags: MappingFlags;
    read(context: ReadContext, value: any): any;
    write(value: any, path: string, errors: MappingError[], visited: any[]): any;
    areEqual(documentValue1: any, documentValue2: any): boolean;
    resolve(path: string): ResolveContext;
    resolve(context: ResolveContext): void;
    watch(value: any, observer: Observer, visited: any[]): void;
    walk(session: InternalSession, value: any, flags: PropertyFlags, entities: any[], embedded: any[], references: Reference[]): void;
    fetch(session: InternalSession, parentEntity: any, value: any, path: string[], depth: number, callback: ResultCallback<any>): void;
    fetchInverse(session: InternalSession, parentEntity: any, propertyName: string, path: string[], depth: number, callback: ResultCallback<any>): void;
}

export = InternalMapping;