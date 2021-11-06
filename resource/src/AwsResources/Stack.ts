import * as cdk from '@aws-cdk/core';
import * as apiGateway from "@aws-cdk/aws-apigateway"
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs"
import * as secretsManager from "@aws-cdk/aws-secretsmanager"
import {createExecutionRole} from "./Role";


export class DdnsPusherStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, hostedZoneId: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const lambdaFunction: NodejsFunction = new NodejsFunction(this, 'DdnsPusher', {
            entry: 'src/AwsResources/Lambda.ts',
            environment: {
                HOSTED_ZONE_ID: hostedZoneId
            },
            role: createExecutionRole(this)
        })

        const secret = new secretsManager.Secret(this, "DdnsPusherSecret", {
            description: "A APIkey for APIGateway that is entrypoint of DDNS-Pusher",
            secretName: "DdnsPusherAPIKey",
            generateSecretString: {
                generateStringKey: "apiKey",
                secretStringTemplate: "{}",
                excludeCharacters: ' %+~`#$&*()|[]{}:;<>?!\'/@"\\',
            }
        })

        const gateway: apiGateway.RestApi = new apiGateway.RestApi(this, 'DdnsPusherGateway')
        const apiKey: apiGateway.ApiKey = new apiGateway.ApiKey(this, 'DdnsPusherAPIKey', {
            apiKeyName: 'DdnsPusherAPIKey',
            value: secret.secretValueFromJson('apiKey').toString(),
            enabled: true
        })

        gateway.addUsagePlan('DdnsPusherUsagePlan', {
            name: 'DdnsPusherUsagePlan',
            apiKey: apiKey,
            throttle: {
                rateLimit: 10,
                burstLimit: 100
            }
        }).addApiStage({stage: gateway.deploymentStage})

        gateway.root.addMethod('POST', new apiGateway.LambdaIntegration(lambdaFunction), {
            apiKeyRequired: true
        })


    }
}