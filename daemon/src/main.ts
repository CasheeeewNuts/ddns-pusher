import axios, {AxiosResponse} from "axios";
import {URL} from "url";
import "dotenv/config"


const DEFAULT_TTL = 300

function push(url: URL, domainName: string, apiKey: string) {
    return axios.post(url.toString(), {
        domainName
    }, {
        headers: {
            "x-api-key": apiKey
        }
    })
}

function main() {
    const {ENDPOINT, API_KEY, DOMAIN_NAME, TTL: _TTL} = process.env

    if (!ENDPOINT) {
        throw new Error("endpoint is not specified")
    }

    if (!API_KEY) {
        throw new Error("api key is not specified")
    }

    if (!DOMAIN_NAME) {
        throw new Error("domain name is not specified")
    }

    // For milliseconds, multiply a thousand
    const TTL = (Number(_TTL) ?? DEFAULT_TTL) * 1000
    const timer = setInterval( () => {
        push(new URL(ENDPOINT), DOMAIN_NAME, API_KEY)
            .then(res => console.log(res.statusText))
            .catch(err => {
                console.error(err.response)
                clearInterval(timer)
            })
    }, TTL)
}

main()