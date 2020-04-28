'use strict';

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('main', '/handler.js', 'main');

describe('main', () => {
    before((done) => {
        done();
    });

    it('displays greeting message', async () => {
        const response = await wrapped.run({});
        const body = JSON.parse(response.body);

        expect(body.message).to.equal('Welcome to serverless-now');
    });

    it('displays a status code 200', async () => {
        const response = await wrapped.run({});
        expect(response.statusCode).to.equal(200);
    });


    it('displays URL query strings back', async () => {

        const ticketId = 'REQ1337';

        const response = await wrapped.run({
            queryStringParameters: { ticketId: ticketId }
        });

        const body = JSON.parse(response.body);
        expect(body.message).to.contain(`Returning ServiceNow ticket with ID: ${ticketId}`);
    })

    it('responds to POST requests', async () => {

        const upi = 'skav012';

        const response = await wrapped.run({
            httpMethod: 'POST',
            authorizer: {},
            headers: {},
            body: {
                upi: upi,
                comment: 'Example ticket comment.'
            }
        });

        const body = JSON.parse(response.body);
        expect(body.object).deep.to.contain({ upi: upi });
    })

    it('returns a secret from AWS parameter store', async () => {

        const response = await wrapped.run({});
        const body = JSON.parse(response.body);

        expect(body.aws_message).to.equal('Welcome to serverless-now from AWS');
    });

    it('returns a ticket by a hardcoded ticket id',async  () => {

        const ticketId = 'REQ1216647';

        const response = await wrapped.run({
            queryStringParameters: { ticketId: ticketId }
        });

        const body = JSON.parse(response.body);
        expect(body.short_description).to.contain(`Storage request 123`);

    });
    xit('returns the UPI of the requestor');
    xit('returns an error if an unauthenticated user accesses this function');


});
