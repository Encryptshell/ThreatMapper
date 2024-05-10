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
import type { ModelContainerImage } from './ModelContainerImage';
import {
    ModelContainerImageFromJSON,
    ModelContainerImageFromJSONTyped,
    ModelContainerImageToJSON,
} from './ModelContainerImage';

/**
 * 
 * @export
 * @interface ModelRegistryAccount
 */
export interface ModelRegistryAccount {
    /**
     * 
     * @type {Array<ModelContainerImage>}
     * @memberof ModelRegistryAccount
     */
    container_images: Array<ModelContainerImage> | null;
    /**
     * 
     * @type {string}
     * @memberof ModelRegistryAccount
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ModelRegistryAccount
     */
    node_id: string;
    /**
     * 
     * @type {string}
     * @memberof ModelRegistryAccount
     */
    registry_type: string;
    /**
     * 
     * @type {boolean}
     * @memberof ModelRegistryAccount
     */
    syncing: boolean;
}

/**
 * Check if a given object implements the ModelRegistryAccount interface.
 */
export function instanceOfModelRegistryAccount(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "container_images" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "node_id" in value;
    isInstance = isInstance && "registry_type" in value;
    isInstance = isInstance && "syncing" in value;

    return isInstance;
}

export function ModelRegistryAccountFromJSON(json: any): ModelRegistryAccount {
    return ModelRegistryAccountFromJSONTyped(json, false);
}

export function ModelRegistryAccountFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelRegistryAccount {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'container_images': (json['container_images'] === null ? null : (json['container_images'] as Array<any>).map(ModelContainerImageFromJSON)),
        'name': json['name'],
        'node_id': json['node_id'],
        'registry_type': json['registry_type'],
        'syncing': json['syncing'],
    };
}

export function ModelRegistryAccountToJSON(value?: ModelRegistryAccount | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'container_images': (value.container_images === null ? null : (value.container_images as Array<any>).map(ModelContainerImageToJSON)),
        'name': value.name,
        'node_id': value.node_id,
        'registry_type': value.registry_type,
        'syncing': value.syncing,
    };
}

