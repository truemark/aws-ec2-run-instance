import {getInput} from '@actions/core'

function required(value: string): string {
  if (!value) throw new Error('Required input is missing')
  return value
}

function optionalNumber(value: string): number | undefined {
  if (!value) return undefined
  return parseInt(value, 10)
}

function optionalBoolean(value: string): boolean | undefined {
  if (!value) return undefined
  return value === 'true'
}

function optionalJson<T>(value: string): T | undefined {
  if (!value) return undefined
  return JSON.parse(value) as T
}

function optionalValues(value: string, allowedValues: string[]): string | undefined {
  if (!value) return undefined
  if (!allowedValues.includes(value)) throw new Error(`Invalid value for input: ${value}`)
  return value
}

function undefinedIfEmpty(value: string): string | undefined {
  if (!value) return undefined
  return value
}

export const config = {
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
  instanceShutdownBehavior: optionalValues(getInput('instance-shutdown-behavior'),
    ['stop', 'terminate'])
}
