const superagent = require('superagent');

const postString = '{"msg": "Hello World!"}';

const postData = {msg: "Hello World!"};
let postDataAsString;
try {
    postDataAsString = JSON.stringify(postData);
} catch (error) {
    postDataAsString = {};
}

const HRBR_BEACON_URL = 'https://harbor-stream.hrbr.io/beacon';

const API_KEY = 'abe3a65c99e93631a97bf4bb73ddf919';

// Now you need to have a valid appVersionId. To get one, create an app in your account. appVersionId's use a naming
// convention similar to a lot of bundle/docker ids which is a combination of RDNS and semantic versioning. Example:
// io.coolcompany.helloword:1.0.0. Feel free to use the appVersionId shown below for this tutorial.

const APP_VERSION_ID = 'scott:1.0.0';

// You also need to have a beacon registered to your app in order for Harbor to accept the post. Beacons have a
// beaconVersionId which follows the same convention as the appVersionId, above. Let's use: io.hrbr.howdybeacon:1.0.0.

// You will need to add this beacon to your app by going to the app details page on the website, then clicking + BEACON.
// The beaconVersionId must match EXACTLY with what is below.

const BEACON_VERSION_ID = 'scott:1.0.0';

const BEACON_MESSAGE_TYPE = 'HELLO_WORLD';

/**
 * Send our request
 */
superagent
    .post(HRBR_BEACON_URL)

    /**
     * Data to send (a string).  If you started w/ an Object then you could use .send(JSON.stringify(postData))
     */
    .send(postString)
    .type('json')

    /**
     * Always a good idea to be explicit about what you want back!
     */
    .accept('json')

    /**
     * beaconMessageType isn't required, but to use Foghorns, Tugs, Views, etc. you will want to set it.
     */
    .set('beaconMessageType', BEACON_MESSAGE_TYPE)

    /**
     * dataTimestamp is optional. If you don't set it, Harbor will mark it with the arrival time of the message.
     * However, if you are caching messages for a while before sending, you will want to set this with the time
     * at which the parameters were actually measured.
     * .set('dataTimestamp', new Date().getTime())
     */

    /**
     * API Key goes in the header like so.
     */
    .set('apikey', API_KEY)

    /**
     * beaconVersionId goes in the header like so.
     */
    .set('beaconVersionId', BEACON_VERSION_ID)

    /**
     * appVersionId goes in the header like so.
     */
    .set('appVersionId', APP_VERSION_ID)
    .then(res => {
        // Success goes here.
        //res.status = 201, res.body = 1;

        // res.body, res.headers, res.status

        if (res.ok) {
            console.log("Success");
            if (res && res.body) {
                console.log(res.body); // Should produce 1
                const json = JSON.parse(res.body); // Should produce 1 too
            }
        } else {
            console.warn("Unexpected result: " + res.status);
        }
    })
    .catch(err => {
        // Bad (or missing) API Key goes here.
        // err.status = 403, err.message = "Forbidden", err.response.body.error.message has text;
        // Bad (or missing) AppID goes here.
        // err.status = 406, err.message = "Not Acceptable", err.response.body.error.message has text;
        // Bad (or missing) BeaconID goes here.
        // err.status = 406, err.message = "Not Acceptable", err.response.body.error.message has text;
        // No (or non JSON parable) data goes here.
        // err.status = 400, err.message = "Bad Request" err.response.body is empty object

        // err.message, err.response

        console.error('Error: %d %s\n%s', err.status, err.message, err);

        if (err && err.response && err.response.body) {
            console.error(err.response.body);
        }
        if (err && err.response && err.response.body && err.response.body.error && err.response.body.error.message) {
            console.error(err.response.body.error.message);
        }
    });

/**
 * Our request is asynchronous, so you may get here faster than you wanted.  If that's the case you'll need to
 * look into async/await or promises to wait for your result.
 */

console.log("After our request");