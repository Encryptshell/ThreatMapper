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
 * @interface ModelSettingUpdateRequest
 */
export interface ModelSettingUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof ModelSettingUpdateRequest
     */
    key: ModelSettingUpdateRequestKeyEnum;
    /**
     * 
     * @type {string}
     * @memberof ModelSettingUpdateRequest
     */
    value: string;
}


/**
 * @export
 */
export const ModelSettingUpdateRequestKeyEnum = {
    ConsoleUrl: 'console_url',
    FileServerUrl: 'file_server_url',
    InactiveDeleteScanResults: 'inactive_delete_scan_results'
} as const;
export type ModelSettingUpdateRequestKeyEnum = typeof ModelSettingUpdateRequestKeyEnum[keyof typeof ModelSettingUpdateRequestKeyEnum];


/**
 * Check if a given object implements the ModelSettingUpdateRequest interface.
 */
export function instanceOfModelSettingUpdateRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "key" in value;
    isInstance = isInstance && "value" in value;

    return isInstance;
}

export function ModelSettingUpdateRequestFromJSON(json: any): ModelSettingUpdateRequest {
    return ModelSettingUpdateRequestFromJSONTyped(json, false);
}

export function ModelSettingUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelSettingUpdateRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'key': json['key'],
        'value': json['value'],
    };
}

export function ModelSettingUpdateRequestToJSON(value?: ModelSettingUpdateRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'key': value.key,
        'value': value.value,
    };
}

