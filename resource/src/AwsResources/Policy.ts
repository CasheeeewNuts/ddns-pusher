import * as iam from "@aws-cdk/aws-iam";
import {Construct} from "@aws-cdk/core";


export const AWSLambdaBasicExecutionRole: (scope: Construct) => iam.IManagedPolicy = (scope) => iam.ManagedPolicy.fromManagedPolicyArn(scope, "DdnsPusherExecuteRole", 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole')
export const AmazonRoute53FullAccess: (scope: Construct) => iam.IManagedPolicy = (scope) => iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRoute53FullAccess')