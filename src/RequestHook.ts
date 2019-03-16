import { RequestHook as BaseRequestHook } from 'testcafe';
import Cassette, { RecordedRequest } from './Cassette';
import { RequestOptions, ResponseMock } from 'testcafe-hammerhead';


interface RequestEvent {
    setMock(mock: Object): void;
    requestOptions: RequestOptions;
    _requestInfo: {
        id: string;
        url: string;
        method: string;
        headers: Object;
    };
}

interface InternalRequest {
    id: string;
    url: string;
    method: string;
    headers: Object;
}

export default class RequestHook extends BaseRequestHook {
    vcr: Object;
    cassette: Cassette;
    private internalRequests: { [key: string]: InternalRequest };

    constructor(requestFilterRules: any, responseEventConfigureOpts: any) {
        super();
        this.vcr = responseEventConfigureOpts.vcr;
        this.cassette = responseEventConfigureOpts.cassette;
        this.internalRequests = {};
    }

    begin(): void {
        return;
    }

    end(): void {
        this.cassette.persist();
    }

    // noinspection JSAnnotator
    async onRequest(event: RequestEvent) {
        if (this.cassette.exists) {
            const requests = this.cassette.requests.filter(request => {
                return request.method === event.requestOptions.method &&
                    request.url === event.requestOptions.url;
            });

            event.setMock(this.createMockFromCassetteRequest(requests[0]));
        } else {
            this.internalRequests[event._requestInfo.id] = {
                id:     event._requestInfo.id,
                url:    event._requestInfo.url,
                method: event._requestInfo.method,
                headers: Object.assign({}, event._requestInfo.headers)
            };
        }
        return;
    }

    // noinspection JSAnnotator
    async onResponse(event: any) {
        const internalRequest = this.internalRequests[event.requestId];

        if (!internalRequest) {
            return;
        }

        this.cassette.recordRequest({
            ...internalRequest,
            status:       event.statusCode,
            responseBody: event.body.toString()
        });
    }

    private createMockFromCassetteRequest(request: RecordedRequest): ResponseMock {
        return new ResponseMock(request.responseBody, request.status, request.headers);
    }
}