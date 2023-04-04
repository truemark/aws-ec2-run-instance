<p align="center">
  <a href="https://github.com/truemark/aws-ec2-run-instance-action"><img alt="typescript-action status" src="https://github.com/truemark/aws-ec2-run-instance-action/workflows/build-test/badge.svg"></a>
</p>

# AWS EC2 Run Instance Action

This action will create and run an AWS EC2 instance.

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
        uses: truemark/aws-ec2-run-instance-action@cc24476fab0b70762e2bdfc2bf7690f545727f58
        with:
          security-group-id: "sg-0baf5bcfe9f21efa0"
          subnet-id: "subnet-09a35a2abd797dbf0"
          image-id: "default-arm64"
          instance-type: "c7g.large"
          instance-profile: "TruemarkEC2RoleforSSM"
          region: "us-east-2"
```

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

## Publishing

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
