import * as AWS from "aws-sdk"


type Props = {
    ip: AWS.Route53.RData
    domainName: AWS.Route53.DNSName,
    hostedZoneId: AWS.Route53.ResourceId,
    route53: AWS.Route53,
    ttl: AWS.Route53.TTL
}

export const DEFAULT_TTL = 300

export async function updateARecord({ip, domainName, hostedZoneId, route53, ttl}: Props): Promise<AWS.Route53.ChangeResourceRecordSetsResponse> {
    const params: AWS.Route53.ChangeResourceRecordSetsRequest = {
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
            Changes: [{
                Action: "UPSERT",
                ResourceRecordSet: {
                    Name: domainName,
                    ResourceRecords: [
                        {
                            Value: ip
                        }
                    ],
                    TTL: ttl,
                    Type: "A"
                }
            }]
        }
    }

    return await route53.changeResourceRecordSets(params).promise()
}