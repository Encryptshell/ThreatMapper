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
import type { ModelVulnerabilityScanConfigLanguage } from './ModelVulnerabilityScanConfigLanguage';
import {
    ModelVulnerabilityScanConfigLanguageFromJSON,
    ModelVulnerabilityScanConfigLanguageFromJSONTyped,
    ModelVulnerabilityScanConfigLanguageToJSON,
} from './ModelVulnerabilityScanConfigLanguage';

/**
 * 
 * @export
 * @interface ModelAddScheduledTaskRequest
 */
export interface ModelAddScheduledTaskRequest {
    /**
     * 
     * @type {string}
     * @memberof ModelAddScheduledTaskRequest
     */
    action: ModelAddScheduledTaskRequestActionEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof ModelAddScheduledTaskRequest
     */
    benchmark_types: Array<string> | null;
    /**
     * 
     * @type {string}
     * @memberof ModelAddScheduledTaskRequest
     */
    cron_expr?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ModelAddScheduledTaskRequest
     */
    deepfence_system_scan?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ModelAddScheduledTaskRequest
     */
    description?: string;
    /**
     * 
     * @type {ModelScanFilter}
     * @memberof ModelAddScheduledTaskRequest
     */
    filters: ModelScanFilter;
    /**
     * 
     * @type {boolean}
     * @memberof ModelAddScheduledTaskRequest
     */
    is_priority?: boolean;
    /**
     * 
     * @type {Array<ModelNodeIdentifier>}
     * @memberof ModelAddScheduledTaskRequest
     */
    node_ids: Array<ModelNodeIdentifier> | null;
    /**
     * 
     * @type {Array<ModelVulnerabilityScanConfigLanguage>}
     * @memberof ModelAddScheduledTaskRequest
     */
    scan_config: Array<ModelVulnerabilityScanConfigLanguage> | null;
}


/**
 * @export
 */
export const ModelAddScheduledTaskRequestActionEnum = {
    SecretScan: 'SecretScan',
    VulnerabilityScan: 'VulnerabilityScan',
    MalwareScan: 'MalwareScan',
    ComplianceScan: 'ComplianceScan',
    CloudComplianceScan: 'CloudComplianceScan'
} as const;
export type ModelAddScheduledTaskRequestActionEnum = typeof ModelAddScheduledTaskRequestActionEnum[keyof typeof ModelAddScheduledTaskRequestActionEnum];


/**
 * Check if a given object implements the ModelAddScheduledTaskRequest interface.
 */
export function instanceOfModelAddScheduledTaskRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "action" in value;
    isInstance = isInstance && "benchmark_types" in value;
    isInstance = isInstance && "filters" in value;
    isInstance = isInstance && "node_ids" in value;
    isInstance = isInstance && "scan_config" in value;

    return isInstance;
}

export function ModelAddScheduledTaskRequestFromJSON(json: any): ModelAddScheduledTaskRequest {
    return ModelAddScheduledTaskRequestFromJSONTyped(json, false);
}

export function ModelAddScheduledTaskRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelAddScheduledTaskRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'action': json['action'],
        'benchmark_types': json['benchmark_types'],
        'cron_expr': !exists(json, 'cron_expr') ? undefined : json['cron_expr'],
        'deepfence_system_scan': !exists(json, 'deepfence_system_scan') ? undefined : json['deepfence_system_scan'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'filters': ModelScanFilterFromJSON(json['filters']),
        'is_priority': !exists(json, 'is_priority') ? undefined : json['is_priority'],
        'node_ids': (json['node_ids'] === null ? null : (json['node_ids'] as Array<any>).map(ModelNodeIdentifierFromJSON)),
        'scan_config': (json['scan_config'] === null ? null : (json['scan_config'] as Array<any>).map(ModelVulnerabilityScanConfigLanguageFromJSON)),
    };
}

export function ModelAddScheduledTaskRequestToJSON(value?: ModelAddScheduledTaskRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'action': value.action,
        'benchmark_types': value.benchmark_types,
        'cron_expr': value.cron_expr,
        'deepfence_system_scan': value.deepfence_system_scan,
        'description': value.description,
        'filters': ModelScanFilterToJSON(value.filters),
        'is_priority': value.is_priority,
        'node_ids': (value.node_ids === null ? null : (value.node_ids as Array<any>).map(ModelNodeIdentifierToJSON)),
        'scan_config': (value.scan_config === null ? null : (value.scan_config as Array<any>).map(ModelVulnerabilityScanConfigLanguageToJSON)),
    };
}

