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
 * @interface ModelDeleteRegistryBulkReq
 */
export interface ModelDeleteRegistryBulkReq {
    /**
     * 
     * @type {Array<string>}
     * @memberof ModelDeleteRegistryBulkReq
     */
    registry_ids: Array<string> | null;
}

/**
 * Check if a given object implements the ModelDeleteRegistryBulkReq interface.
 */
export function instanceOfModelDeleteRegistryBulkReq(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "registry_ids" in value;

    return isInstance;
}

export function ModelDeleteRegistryBulkReqFromJSON(json: any): ModelDeleteRegistryBulkReq {
    return ModelDeleteRegistryBulkReqFromJSONTyped(json, false);
}

export function ModelDeleteRegistryBulkReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelDeleteRegistryBulkReq {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'registry_ids': json['registry_ids'],
    };
}

export function ModelDeleteRegistryBulkReqToJSON(value?: ModelDeleteRegistryBulkReq | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'registry_ids': value.registry_ids,
    };
}

