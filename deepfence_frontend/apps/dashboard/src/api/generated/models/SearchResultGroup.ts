/* tslint:disable */
/* eslint-disable */
/**
 * Deepfence ThreatMapper
 * Deepfence Runtime API provides programmatic control over Deepfence microservice securing your container, kubernetes and cloud deployments. The API abstracts away underlying infrastructure details like cloud provider,  container distros, container orchestrator and type of deployment. This is one uniform API to manage and control security alerts, policies and response to alerts for microservices running anywhere i.e. managed pure greenfield container deployments or a mix of containers, VMs and serverless paradigms like AWS Fargate.
 *
 * The version of the OpenAPI document: 2.2.1
 * Contact: community@deepfence.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SearchResultGroup
 */
export interface SearchResultGroup {
    /**
     * 
     * @type {number}
     * @memberof SearchResultGroup
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof SearchResultGroup
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchResultGroup
     */
    severity?: string;
}

/**
 * Check if a given object implements the SearchResultGroup interface.
 */
export function instanceOfSearchResultGroup(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SearchResultGroupFromJSON(json: any): SearchResultGroup {
    return SearchResultGroupFromJSONTyped(json, false);
}

export function SearchResultGroupFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchResultGroup {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': !exists(json, 'count') ? undefined : json['count'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'severity': !exists(json, 'severity') ? undefined : json['severity'],
    };
}

export function SearchResultGroupToJSON(value?: SearchResultGroup | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'count': value.count,
        'name': value.name,
        'severity': value.severity,
    };
}

