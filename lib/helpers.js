'use strict';

const { tmpdir } = require('os');
const { spawn } = require('child_process');
const socketHelpers = require.main.require('./src/socket.io/helpers');

module.exports = {
  acquireCertificates,
  listCertificates,
  renewCertificates,
  updateContactEmail,
  certbot,
};

function acquireCertificates(domains, email, caller) {
  const args = [ 'certonly', '--webroot', '-w', tmpdir(), '--non-interactive', '--agree-tos', '-m', email ];
  for (const domain of domains) {
    args.push('-d', domain);
  }
  certbot(args, caller);
}

function listCertificates(req, res, next) {
  try {
    certbot([ 'certificates' ], req.user);
    res.end();
  } catch (err) {
    next(err);
  }
}

function renewCertificates(req, res, next) {
  try {
    certbot([ 'renewal' ], req.user);
    res.end();
  } catch (err) {
    next(err);
  }
}

async function updateContactEmail(email, caller) {
  certbot([ 'update_account', '--non-interactive', '--agree-tos', '-m', email ], caller);
}

function certbot(args, user) {
  let content = '', status = '', timeout;
  const output = (data) => {
    if (data) {
      content += data.toString();
    }
    if (!timeout) {
      timeout = setTimeout(() => {
        socketHelpers.emitToUids('event:certbot_output', { content, status }, [ user.uid ]);
        timeout = 0;
      }, 100);       
    }
  };
  const child = spawn('certbot', args);
  child.on('spawn', () => {
    status = 'running';
    output();
  });
  child.on('close', (code) => {
    status = (code === 0) ? 'success' : 'failure';
    output();
  });
  child.on('error', (err) => {
    status = 'error';
    output(err.message);
  });
  child.stdout.on('data', output);
  child.stderr.on('data', output); 
}