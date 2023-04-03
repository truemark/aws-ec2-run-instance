import {defaultAmd64ImageId, defaultArm64ImageId, runInstance} from './instance'
import {setFailed, setOutput} from '@actions/core'
import {EC2Client} from '@aws-sdk/client-ec2'
import {SSMClient} from '@aws-sdk/client-ssm'
import {config} from './config'

async function run(): Promise<void> {
  try {
    const ssmClient = new SSMClient({region: config.region})
    const ec2Client = new EC2Client({region: config.region})
    let imageId = config.imageId
    if (imageId === 'default-arm64') {
      imageId = await defaultArm64ImageId(ssmClient)
    }
    if (imageId === 'default-amd64') {
      imageId = await defaultAmd64ImageId(ssmClient)
    }

    // const securityGroupId = 'sg-0baf5bcfe9f21efa5'
    // const subnetId = 'subnet-09a35a2abd797dbf9'
    // const imageId = 'default-arm64'
    // let imageId = 'default-amd64'
    // const instanceType = 'c6i.large'
    // 'c6i.large', ''c7g.large'
    // const instanceProfile = 'TruemarkEC2RoleforSSM'
    //arn:aws:iam::617383789573:instance-profile/TruemarkEC2RoleforSSM

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
      // userData: [
      //   '#!/bin/bash',
      //   'sudo yum install docker -y',
      //   'sudo usermod -a -G docker ec2-user',
      //   'sudo systemctl enable docker.service',
      //   'sudo systemctl start docker.service',
      //   'mkdir -p .ssh',
      //   'touch .ssh/authorized_keys',
      //   'chmod 700 .ssh',
      //   'chmod 600 .ssh/authorized_keys'
      //   // 'echo "${props.publicSshKey}" >> .ssh/authorized_keys'
      // ],
    })
    setOutput('instance-id', id)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
