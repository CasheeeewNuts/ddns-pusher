import {APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult} from "aws-lambda";
import * as AWS from "aws-sdk"
import {DEFAULT_TTL, updateARecord} from "../Core/UpdateARecord";
import {InvalidRequestError} from "../Errors/InvalidRequestError";

export async function handler(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> {
    try {
        if (event.body == null || event.body === '') {
            throw new InvalidRequestError("request body is empty")
        }

        const { domainName } = JSON.parse(event.body)

        if (domainName == null || domainName.length === 0) {
            throw new InvalidRequestError("invalid domain name")
        }

        const {sourceIp: clientIp} = event.requestContext.identity
        const {HOSTED_ZONE_ID, TTL: _TTL} = process.env

        if (HOSTED_ZONE_ID == null) {
            throw new Error("HOSTED_ZONE_ID is not specified")
        }

        const TTL = _TTL ? Number(_TTL) : DEFAULT_TTL

        await updateARecord({
            ip: clientIp,
            domainName: domainName,
            hostedZoneId: HOSTED_ZONE_ID,
            route53: new AWS.Route53(),
            ttl: TTL
        })

        return {
            statusCode: 200,
            body: ''
        }
    } catch (err) {
        if (err instanceof InvalidRequestError) {
            return {
                statusCode: 400,
                body: err.toString()
            }
        } else if (err instanceof Error) {
            return {
                statusCode: 500,
                body: err.toString()
            }
        }

        throw err
    }
}