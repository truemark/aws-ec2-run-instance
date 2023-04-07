# AWS EC2 Run Instance Action

[![LICENSE](https://img.shields.io/badge/license-BSD3-green)](LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/truemark/aws-ec2-run-instance-action)](https://github.com/truemark/aws-ec2-run-instance-action/releases)
![GitHub closed issues](https://img.shields.io/github/issues-closed/truemark/aws-ec2-run-instance-action)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/truemark/aws-ec2-run-instance-action)
![build-test](https://github.com/truemark/aws-ec2-run-instance-action/workflows/build-test/badge.svg)

This action will create and run an AWS EC2 instance and then optionally terminate it as a post step.

## Examples

```yml
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: "${{ secrets.AWS_ASSUME_ROLE }}"
          aws-region: "us-east-2"
      - name: Setup ARM64 EC2
        id: ec2-arm64
        uses: truemark/aws-ec2-run-instance-action@v3
        with:
          security-group-id: "sg-0baf5bcfe9f21efa0"
          subnet-id: "subnet-09a35a2abd797dbf0"
          image-id: "default-arm64"
          instance-type: "c7g.large"
          instance-profile: "TruemarkEC2RoleforSSM"
          region: "us-east-2"
          user-data: |
            #!/bin/bash
            echo "Do something cool here"
```

You can use default-arm64 and default-amd64 to get the latest Amazon Linux ARM.
You can also use the AMI ID of your own AMI.

## Inputs

| Name                          | Type       | Required | Description                                                                                 |
|-------------------------------|------------|----------|---------------------------------------------------------------------------------------------|
| subnet-id                     | string     | Yes      | Subnet ID to launch the instance in                                                         |
| security-group-id             | string     | Yes      | Security group to apply to the EC2 instance                                                 |
| image-id                      | string     | Yes      | Image ID to use for the EC2 instance. Also accepts default-arm64 and default-amd64 options  |
 | instance-type                 | string     | Yes      | Instance type to use for the EC2 instance                                                   |
| instance-profile              | string     | No       | Instance profile to use for the EC2 instance                                                |
| volume-size                   | number     | No       | Volume size in GB to use for the EC2 instance                                               |
| associate-public-ip-address   | boolean    | No       | Associate a public IP address to the instance                                               |
| tags                          | string     | No       | Tags to apply to the EC2 instance. Format: JSON                                             |
| user-data                     | string     | No       | User data to apply to the EC2 instance                                                      |
| instance-shutdown-behavior    | string     | No       | Shutdown behavior for the EC2 instance. This may be stop or terminate. Default is terminate |
| region                        | string     | Yes      | AWS region to use for the EC2 instance                                                      |
| key-name                      | string     | No       | SSH key name to use for the EC2 instance                                                    |
| terminate-on-post             | boolean    | No       | Terminate the EC2 instance after the post step. Default is true.                            |

## Outputs
| Name                          | Type       | Description                                                                                 |
|-------------------------------|------------|---------------------------------------------------------------------------------------------|
| instance-id                   | string     | Instance ID of the EC2 instance                                                             |





## Development

> Install `node version 16`

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
```
