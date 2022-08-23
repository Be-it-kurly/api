require('app-module-path').addPath(`${__dirname}/src`);

const app = require('app');
const AWS = require('aws-sdk');
const admin = require('firebase-admin');

const serviceAccount = require('./firebase.json');

let awsConn = null;
let fbConn = null;

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line no-param-reassign

  if (awsConn === null) {
    awsConn = AWS.config.loadFromPath('./aws.json');
  }

  if (fbConn === null) {
    fbConn = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  const res = await app(event, context);
  return res;
};
