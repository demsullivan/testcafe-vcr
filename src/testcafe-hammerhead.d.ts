declare module 'testcafe-hammerhead' {
    interface RequestOptions {
        headers:     Object;
        body:        Buffer;
        url:         string;
        protocol:    string;
        hostname:    string;
        host:        string;
        port:        Number;
        path:        String;
        method:      String;
        credentials: Object;
        proxy:       Object;
    }

    class ResponseMock {
        constructor(body: string, statusCode: number, headers: Object);
    }
}