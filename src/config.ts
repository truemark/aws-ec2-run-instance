import {getInput} from '@actions/core'

export function required(value: string | undefined | null): string {
  if (!value) throw new Error('Required input is missing')
  return value
}

export function optionalNumber(value: string): number | undefined {
  if (!value) return undefined
  return parseInt(value, 10)
}

export function optionalBoolean(value: string): boolean | undefined {
  if (!value) return undefined
  return value === 'true'
}

export function optionalJson<T>(value: string): T | undefined {
  if (!value) return undefined
  return JSON.parse(value) as T
}

export function optionalValues(value: string, allowedValues: string[]): string | undefined {
  if (!value) return undefined
  if (!allowedValues.includes(value)) throw new Error(`Invalid value for input: ${value}`)
  return value
}

export function optionalArray(value: string, delimiter?: string): string[] | undefined {
  if (!value) return undefined
  return value.split(delimiter ?? '\n')
}

export function undefinedIfEmpty(value: string): string | undefined {
  if (!value || value === '') return undefined
  return value
}

export interface Config {
  readonly region: string
  readonly securityGroupId: string
  readonly subnetId: string
  readonly instanceType: string
  readonly instanceProfile: string
  readonly imageId: string
  readonly volumeSize?: number
  readonly associatePublicIpAddress?: boolean
  readonly keyName?: string
  readonly tags?: {[key: string]: string}
  readonly userData?: string[]
  readonly instanceShutdownBehavior?: string
  readonly terminateOnPost?: boolean
  readonly name: string
}

export function loadConfig(): Config {
  return {
    region: required(getInput('region')),
    securityGroupId: required(getInput('security-group-id')),
    subnetId: required(getInput('subnet-id')),
    instanceType: required(getInput('instance-type')),
    instanceProfile: required(getInput('instance-profile')),
    imageId: required(getInput('image-id')),
    volumeSize: optionalNumber(getInput('volume-size')),
    associatePublicIpAddress: optionalBoolean(getInput('associate-public-ip-address')),
    keyName: undefinedIfEmpty(getInput('key-name')),
    tags: optionalJson<{[key: string]: string}>(getInput('tags')),
    userData: optionalArray(getInput('user-data')),
    instanceShutdownBehavior: optionalValues(getInput('instance-shutdown-behavior'), ['stop', 'terminate']),
    terminateOnPost: optionalBoolean(getInput('terminate-on-post')),
    name: required(getInput('name'))
  }
}
