import {EC2Client, RunInstancesCommand, TerminateInstancesCommand} from '@aws-sdk/client-ec2'
import {GetParameterCommand, SSMClient} from '@aws-sdk/client-ssm'

/**
 * Returns the default image id for amd64 pulled from SSM.
 * @param client SSM client
 */
export async function defaultAmd64ImageId(client: SSMClient): Promise<string> {
  return await getImageId(client, '/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64')
}

/**
 * Returns the default image id for arm64 pulled from SSM.
 * @param client SSM client
 */
export async function defaultArm64ImageId(client: SSMClient): Promise<string> {
  return await getImageId(client, '/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64')
}

/**
 * Get the image id from the parameter store
 * @param client SSM client
 * @param name Parameter name
 */
export async function getImageId(client: SSMClient, name: string): Promise<string> {
  const command = new GetParameterCommand({
    Name: name
  })
  const output = await client.send(command)
  if (output.Parameter == null || output.Parameter.Value == null) throw new Error(`Parameter ${name} not found`)
  return output.Parameter.Value
}

/**
 * Properties for running an instance
 */
export interface RunInstanceProps {
  readonly securityGroupId: string
  readonly imageId: string
  readonly instanceType: string
  readonly volumeSize?: number
  readonly associatePublicIpAddress?: boolean
  readonly subnetId: string
  readonly keyName?: string
  readonly tags: {[key: string]: string}
  readonly userData?: string[]
  readonly instanceShutdownBehavior?: string
  readonly instanceProfile?: string
  readonly useSpot?: boolean
}

/**
 * Runs an EC2 instance
 * @param client the EC2 client
 * @param props the properties for the instance
 * @returns the instance id
 */
export async function runInstance(client: EC2Client, props: RunInstanceProps): Promise<string> {
  const command = new RunInstancesCommand({
    ImageId: props.imageId,
    InstanceType: props.instanceType,
    MinCount: 1,
    MaxCount: 1,
    InstanceInitiatedShutdownBehavior: props.instanceShutdownBehavior ?? 'terminate',
    KeyName: props.keyName,
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/xvda',
        Ebs: {
          VolumeSize: props.volumeSize ?? 8,
          DeleteOnTermination: true,
          VolumeType: 'gp3'
        }
      }
    ],
    NetworkInterfaces: [
      {
        DeviceIndex: 0,
        AssociatePublicIpAddress: props.associatePublicIpAddress ?? true,
        SubnetId: props.subnetId,
        DeleteOnTermination: true,
        Groups: [props.securityGroupId]
      }
    ],
    UserData: props.userData ? Buffer.from(props.userData.join('\n')).toString('base64') : undefined,
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: Object.entries(props.tags).map(([key, value]) => ({Key: key, Value: value}))
      }
    ],
    IamInstanceProfile: {
      Name: props.instanceProfile
    }
  })
  try {
    const output = await client.send(command)
    if (output.Instances == null || output.Instances.length === 0 || output.Instances[0].InstanceId == null)
      throw new Error('No instance returned')
    return output.Instances[0].InstanceId
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Unknown error')
  }
}

export async function terminateInstance(client: EC2Client, instanceId: string): Promise<void> {
  const command = new TerminateInstancesCommand({
    InstanceIds: [instanceId]
  })
  try {
    await client.send(command)
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Unknown error')
  }
}
