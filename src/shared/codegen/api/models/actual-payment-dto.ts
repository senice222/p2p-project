/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import type { Payment } from './payment';

/**
 * 
 * @export
 * @interface ActualPaymentDTO
 */
export interface ActualPaymentDTO {
    /**
     * 
     * @type {string}
     * @memberof ActualPaymentDTO
     */
    'payment_type': string;
    /**
     * 
     * @type {Payment}
     * @memberof ActualPaymentDTO
     */
    'payment': Payment;
}

