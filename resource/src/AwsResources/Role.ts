import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam"
import {AmazonRoute53FullAccess, AWSLambdaBasicExecutionRole} from "./Policy";


export function createExecutionRole(scope: cdk.Construct): iam.IRole {

    const role: iam.Role = new iam.Role(scope, 'PusherRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    })

    role.addManagedPolicy(AWSLambdaBasicExecutionRole(scope))
    role.addManagedPolicy(AmazonRoute53FullAccess(scope))

    return role
}