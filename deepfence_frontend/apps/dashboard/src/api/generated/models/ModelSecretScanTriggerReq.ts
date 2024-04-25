/* tslint:disable */
/* eslint-disable */
/**
 * Deepfence ThreatMapper
 * Deepfence Runtime API provides programmatic control over Deepfence microservice securing your container, kubernetes and cloud deployments. The API abstracts away underlying infrastructure details like cloud provider,  container distros, container orchestrator and type of deployment. This is one uniform API to manage and control security alerts, policies and response to alerts for microservices running anywhere i.e. managed pure greenfield container deployments or a mix of containers, VMs and serverless paradigms like AWS Fargate.
 *
 * The version of the OpenAPI document: 2.2.0
 * Contact: community@deepfence.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { ModelNodeIdentifier } from './ModelNodeIdentifier';
import {
    ModelNodeIdentifierFromJSON,
    ModelNodeIdentifierFromJSONTyped,
    ModelNodeIdentifierToJSON,
} from './ModelNodeIdentifier';
import type { ModelScanFilter } from './ModelScanFilter';
import {
    ModelScanFilterFromJSON,
    ModelScanFilterFromJSONTyped,
    ModelScanFilterToJSON,
} from './ModelScanFilter';

/**
 * 
 * @export
 * @interface ModelSecretScanTriggerReq
 */
export interface ModelSecretScanTriggerReq {
    /**
     * 
     * @type {boolean}
     * @memberof ModelSecretScanTriggerReq
     */
    deepfence_system_scan?: boolean;
    /**
     * 
     * @type {ModelScanFilter}
     * @memberof ModelSecretScanTriggerReq
     */
    filters: ModelScanFilter;
    /**
     * 
     * @type {boolean}
     * @memberof ModelSecretScanTriggerReq
     */
    is_priority?: boolean;
    /**
     * 
     * @type {Array<ModelNodeIdentifier>}
     * @memberof ModelSecretScanTriggerReq
     */
    node_ids: Array<ModelNodeIdentifier> | null;
}

/**
 * Check if a given object implements the ModelSecretScanTriggerReq interface.
 */
export function instanceOfModelSecretScanTriggerReq(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "filters" in value;
    isInstance = isInstance && "node_ids" in value;

    return isInstance;
}

export function ModelSecretScanTriggerReqFromJSON(json: any): ModelSecretScanTriggerReq {
    return ModelSecretScanTriggerReqFromJSONTyped(json, false);
}

export function ModelSecretScanTriggerReqFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelSecretScanTriggerReq {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'deepfence_system_scan': !exists(json, 'deepfence_system_scan') ? undefined : json['deepfence_system_scan'],
        'filters': ModelScanFilterFromJSON(json['filters']),
        'is_priority': !exists(json, 'is_priority') ? undefined : json['is_priority'],
        'node_ids': (json['node_ids'] === null ? null : (json['node_ids'] as Array<any>).map(ModelNodeIdentifierFromJSON)),
    };
}

export function ModelSecretScanTriggerReqToJSON(value?: ModelSecretScanTriggerReq | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'deepfence_system_scan': value.deepfence_system_scan,
        'filters': ModelScanFilterToJSON(value.filters),
        'is_priority': value.is_priority,
        'node_ids': (value.node_ids === null ? null : (value.node_ids as Array<any>).map(ModelNodeIdentifierToJSON)),
    };
}

