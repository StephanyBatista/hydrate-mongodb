import * as model from "../../fixtures/model";
import {MappingRegistry} from "../../../src/mapping/mappingRegistry";
import {EntityMapping} from "../../../src/mapping/entityMapping";
import {ClassMapping} from "../../../src/mapping/classMapping";

var registry = new MappingRegistry();

var partyMapping = new EntityMapping();
partyMapping.classConstructor = model.Party;
var personMapping = new EntityMapping(partyMapping);
personMapping.classConstructor = model.Person;
var addressMapping = new ClassMapping();
addressMapping.classConstructor = model.Address;

registry.addMapping(partyMapping);
registry.addMapping(personMapping);
registry.addMapping(addressMapping);

module.exports = registry;

