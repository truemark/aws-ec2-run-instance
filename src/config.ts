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

export function undefinedIfEmpty(value: string): string | undefined {
  if (!value || value === '') return undefined
  return value
}

export interface Config {
  region: string
  securityGroupId: string
  subnetId: string
  instanceType: string
  instanceProfile: string
  imageId: string
  volumeSize?: number
  associatePublicIpAddress?: boolean
  keyName?: string
  tags?: {[key: string]: string}
  userData?: string[]
  instanceShutdownBehavior?: string
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
    userData: optionalJson<string[]>(getInput('user-data')),
    instanceShutdownBehavior: optionalValues(getInput('instance-shutdown-behavior'), ['stop', 'terminate'])
  }
}
