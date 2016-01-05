/// <reference path="../../typings/async.d.ts" />
/// <reference path="../../typings/mongodb.d.ts" />

import * as async from "async";
import * as mongodb from "mongodb";

import {NamingStrategies} from "./namingStrategies";
import {ResultCallback} from "../core/resultCallback";
import {MappingProvider} from "../mapping/providers/mappingProvider";
import {MappingRegistry} from "../mapping/mappingRegistry";
import {ChangeTrackingType} from "../mapping/changeTrackingType";
import {Table} from "../core/table";
import {MappingFlags} from "../mapping/mappingFlags";
import {SessionFactory} from "../sessionFactory";
import {SessionFactoryImpl} from "../sessionFactoryImpl";
import {IdentityGenerator} from "../id/identityGenerator";
import {Lookup} from "../core/lookup";
import {EntityMapping} from "../mapping/entityMapping";
import {NamingStrategy} from "./namingStrategy";
import {ObjectIdGenerator} from "../id/objectIdGenerator";
import {ClassMapping} from "../mapping/classMapping";
import {EnumType} from "../mapping/enumType";
import {PropertyConverter} from "../mapping/propertyConverter";

export class Configuration {

    /**
     * Default identity generator to use.
     */
    identityGenerator: IdentityGenerator = new ObjectIdGenerator();

    /**
     * True if entities are versioned by default; otherwise, false.
     */
    versioned = true;

    /**
     * Default field name to use for optimistic locking.
     */
    versionField = "__v";

    /**
     * Default field name to use for the class discriminator.
     */
    discriminatorField = "__t";

    /**
     * Default change tracking strategy to use.
     */
    changeTracking = ChangeTrackingType.Observe;

    /**
     * Default enum storage strategy to use.
     */
    enumType = EnumType.Ordinal;

    /**
     * Naming strategy to use for collection names.
     */
    collectionNamingStrategy: NamingStrategy = NamingStrategies.CamelCase;

    /**
     * Naming strategy to use for field names.
     */
    fieldNamingStrategy: NamingStrategy = NamingStrategies.CamelCase;

    /**
     * Naming strategy to use for the discriminator value of a class.
     */
    discriminatorNamingStrategy: NamingStrategy = NamingStrategies.None;

    /**
     * Named property converters.
     */
    propertyConverters: { [name: string]: PropertyConverter } = {};


    private _mappings: MappingProvider[] = [];

    /**
     * Adds a mapping provider to the configuration.
     * @param mapping The mapping provider to use.
     */
    addMapping(mapping: MappingProvider): void {

        this._mappings.push(mapping);
    }

    /**
     * Creates a session factory.
     * @param connection The MongoDB connection to use.
     * @param callback Called once the session factory is created.
     */
    createSessionFactory(connection: mongodb.Db, callback: ResultCallback<SessionFactory>): void {

        var registry = new MappingRegistry();

        if(!this._mappings || this._mappings.length == 0) {
            return callback(new Error("No mappings were added to the configuration."));
        }

        // Get the mappings from the mapping providers
        async.each(this._mappings, (provider, done) => {

            provider.getMapping(this, (err, r) => {
                if(err) return done(err, null);

                // Merge all registries. Duplicates will cause an error.
                registry.addMappings(<ClassMapping[]>r);
                done(null, null);
            });
        }, (err) => {
            if(err) return callback(err);

            callback(null, new SessionFactoryImpl(connection, registry));
        });
    }
}