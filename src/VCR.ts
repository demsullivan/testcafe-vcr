import Cassette from './Cassette';
import RequestHook from './RequestHook';
import { t } from 'testcafe';

const path = require('path');

export default class VCR {
    cassettePath: string;

    constructor() {
        this.cassettePath = '.';
    }

    configure(options: Object) {

    }

    async useCassette(cassetteName: string, callback: Function) {
        const cassette = new Cassette(path.join(this.cassettePath, cassetteName));
        const requestHook = new RequestHook('', {
            vcr: this,
            cassette
        });

        requestHook.begin();
        await t.addRequestHooks(requestHook);
        await callback();
        await t.removeRequestHooks(requestHook);
        requestHook.end();
    }
}