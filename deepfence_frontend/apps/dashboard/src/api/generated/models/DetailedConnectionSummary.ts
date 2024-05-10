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
 * @interface DetailedConnectionSummary
 */
export interface DetailedConnectionSummary {
    /**
     * 
     * @type {string}
     * @memberof DetailedConnectionSummary
     */
    source?: string;
    /**
     * 
     * @type {string}
     * @memberof DetailedConnectionSummary
     */
    target?: string;
}

/**
 * Check if a given object implements the DetailedConnectionSummary interface.
 */
export function instanceOfDetailedConnectionSummary(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function DetailedConnectionSummaryFromJSON(json: any): DetailedConnectionSummary {
    return DetailedConnectionSummaryFromJSONTyped(json, false);
}

export function DetailedConnectionSummaryFromJSONTyped(json: any, ignoreDiscriminator: boolean): DetailedConnectionSummary {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'source': !exists(json, 'source') ? undefined : json['source'],
        'target': !exists(json, 'target') ? undefined : json['target'],
    };
}

export function DetailedConnectionSummaryToJSON(value?: DetailedConnectionSummary | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'source': value.source,
        'target': value.target,
    };
}

