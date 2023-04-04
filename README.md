<p align="center">
  <a href="https://github.com/truemark/aws-ec2-run-instance-action"><img alt="typescript-action status" src="https://github.com/truemark/aws-ec2-run-instance-action/workflows/build-test/badge.svg"></a>
</p>

# AWS EC2 Run Instance Action

This action will create and run an AWS EC2 instance.

## Examples


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
