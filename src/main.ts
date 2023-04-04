import {defaultAmd64ImageId, defaultArm64ImageId, runInstance} from './instance'
import {setFailed, setOutput} from '@actions/core'
import {EC2Client} from '@aws-sdk/client-ec2'
import {SSMClient} from '@aws-sdk/client-ssm'
import {loadConfig} from './config'

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    const ssmClient = new SSMClient({region: config.region})
    const ec2Client = new EC2Client({region: config.region})

    // const ssmClient = new SSMClient({region: 'us-east-2'})
    // const ec2Client = new EC2Client({region: 'us-east-2'})

    let imageId = config.imageId
    if (imageId === 'default-arm64') {
      imageId = await defaultArm64ImageId(ssmClient)
    }
    if (imageId === 'default-amd64') {
      imageId = await defaultAmd64ImageId(ssmClient)
    }

    const id = await runInstance(ec2Client, {
      securityGroupId: config.securityGroupId,
      imageId,
      instanceType: config.instanceType,
      volumeSize: config.volumeSize,
      associatePublicIpAddress: config.associatePublicIpAddress,
      subnetId: config.subnetId,
      keyName: config.keyName,
      tags: config.tags,
      userData: config.userData,
      instanceShutdownBehavior: config.instanceShutdownBehavior,
      instanceProfile: config.instanceProfile
    })
    setOutput('instance-id', id)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
