import * as AWS from "aws-sdk"

type Props = {
    ip: AWS.Route53.RData
    domainName: AWS.Route53.DNSName,
    hostedZoneId: AWS.Route53.ResourceId,
    route53: AWS.Route53
}

export async function updateARecord({ip, domainName, hostedZoneId, route53}: Props): Promise<AWS.Route53.ChangeResourceRecordSetsResponse> {
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
                    TTL: 60,
                    Type: "A"
                }
            }]
        }
    }

    return await route53.changeResourceRecordSets(params).promise()
}