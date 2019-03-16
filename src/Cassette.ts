const fs = require('fs');

export interface RecordedRequest {
    url: string;
    method: string;
    headers: Object;
    status: number;
    responseBody: string;
}

export default class Cassette {
    private path: string;
    private recordedData: RecordedRequest[];

    constructor(path: string) {
        this.path = path;
        this.recordedData = [];
    }

    get requests(): RecordedRequest[] {
        let fileContents: string = '';
        let recordedData: RecordedRequest[] = [];

        if (!this.exists) {
            return [];
        }

        try {
            fileContents = fs.readFileSync(this.path);
        } catch (e) {
            console.error(`Encountered an error while reading cassette ${this.path}!`);
            console.error(`The error was: ${e}`);
            return [];
        }

        try {
            recordedData = JSON.parse(fileContents);
        } catch(e) {
            console.error(`Encountered an error while parsing cassette ${this.path}!`);
            console.error(`The error was: ${e}`);
            return [];
        }

        if (!(recordedData instanceof Array)) {
            console.error(`The format of cassette ${this.path} is invalid!`);
            console.error("The cassette data should be a JSON array, but it isn't.");
            return [];
        }

        return recordedData;
    }

    get exists() {
        return fs.existsSync(this.path);
    }

    recordRequest(requestData: any): void {
        if (!this.exists) {
            this.recordedData.push({
                url: requestData.url,
                method: requestData.method,
                headers: requestData.headers,
                status: requestData.status,
                responseBody: requestData.responseBody
            });
        }
    }

    persist(): void {
        fs.writeFileSync(this.path, JSON.stringify(this.recordedData));
    }
}