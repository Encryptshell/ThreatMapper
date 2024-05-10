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
 * @interface UtilsScanSbomRequest
 */
export interface UtilsScanSbomRequest {
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    container_name?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    host_name?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    image_id?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    image_name?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    kubernetes_cluster_name?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    mode?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    node_id?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    node_type?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    registry_id?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    sbom: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    sbom_file_path?: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    scan_id: string;
    /**
     * 
     * @type {string}
     * @memberof UtilsScanSbomRequest
     */
    scan_type?: string;
    /**
     * 
     * @type {boolean}
     * @memberof UtilsScanSbomRequest
     */
    skip_scan?: boolean;
}

/**
 * Check if a given object implements the UtilsScanSbomRequest interface.
 */
export function instanceOfUtilsScanSbomRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "sbom" in value;
    isInstance = isInstance && "scan_id" in value;

    return isInstance;
}

export function UtilsScanSbomRequestFromJSON(json: any): UtilsScanSbomRequest {
    return UtilsScanSbomRequestFromJSONTyped(json, false);
}

export function UtilsScanSbomRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UtilsScanSbomRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'container_name': !exists(json, 'container_name') ? undefined : json['container_name'],
        'host_name': !exists(json, 'host_name') ? undefined : json['host_name'],
        'image_id': !exists(json, 'image_id') ? undefined : json['image_id'],
        'image_name': !exists(json, 'image_name') ? undefined : json['image_name'],
        'kubernetes_cluster_name': !exists(json, 'kubernetes_cluster_name') ? undefined : json['kubernetes_cluster_name'],
        'mode': !exists(json, 'mode') ? undefined : json['mode'],
        'node_id': !exists(json, 'node_id') ? undefined : json['node_id'],
        'node_type': !exists(json, 'node_type') ? undefined : json['node_type'],
        'registry_id': !exists(json, 'registry_id') ? undefined : json['registry_id'],
        'sbom': json['sbom'],
        'sbom_file_path': !exists(json, 'sbom_file_path') ? undefined : json['sbom_file_path'],
        'scan_id': json['scan_id'],
        'scan_type': !exists(json, 'scan_type') ? undefined : json['scan_type'],
        'skip_scan': !exists(json, 'skip_scan') ? undefined : json['skip_scan'],
    };
}

export function UtilsScanSbomRequestToJSON(value?: UtilsScanSbomRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'container_name': value.container_name,
        'host_name': value.host_name,
        'image_id': value.image_id,
        'image_name': value.image_name,
        'kubernetes_cluster_name': value.kubernetes_cluster_name,
        'mode': value.mode,
        'node_id': value.node_id,
        'node_type': value.node_type,
        'registry_id': value.registry_id,
        'sbom': value.sbom,
        'sbom_file_path': value.sbom_file_path,
        'scan_id': value.scan_id,
        'scan_type': value.scan_type,
        'skip_scan': value.skip_scan,
    };
}

