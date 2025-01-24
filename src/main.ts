import * as process from 'process'
import {defaultAmd64ImageId, defaultArm64ImageId, runInstance, terminateInstance} from './instance'
import {saveState, setFailed, setOutput} from '@actions/core'
import {EC2Client} from '@aws-sdk/client-ec2'
import {SSMClient} from '@aws-sdk/client-ssm'
import {loadConfig} from './config'

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    const tags = config.tags ?? {}
    if (tags['Name'] === undefined) {
      tags['Name'] = config.name
    }
    const ssmClient = new SSMClient({region: config.region, maxAttempts: 5, retryMode: 'adaptive'})
    const ec2Client = new EC2Client({region: config.region, maxAttempts: 5, retryMode: 'adaptive'})
    if (process.env['STATE_isPost'] === 'true') {
      // post
      if (config.terminateOnPost) {
        const instanceId = process.env['STATE_instanceId'] || ''
        if (instanceId !== '') {
          console.log(`Terminating instance ${instanceId}`)
          await terminateInstance(ec2Client, instanceId)
        }
        return
      }
    } else {
      // main
      saveState('isPost', 'true') // next step is post
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
        rootDevice: config.rootDevice,
        associatePublicIpAddress: config.associatePublicIpAddress,
        subnetId: config.subnetId,
        keyName: config.keyName,
        tags,
        userData: config.userData,
        instanceShutdownBehavior: config.instanceShutdownBehavior,
        instanceProfile: config.instanceProfile
      })
      setOutput('instance-id', id)
      saveState('instanceId', id)
      console.log(`Instance ${id} started`)
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
