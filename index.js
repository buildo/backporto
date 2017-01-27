const backporting = [
  'buildo-react-container',
  'buildo-react-components',
  'avenger',
  'react-avenger',
  'rc-datepicker',
  'react-flexview',
  'react-autosize-textarea',
  'metarpheus-js-http-api',
  'local-date',
  'react-cookie-banner',
  'sass-flex-mixins',
  'sass-variables-loader',
  'metarpheus-tcomb',
  'scriptoni',
  'revenge',
  'eslint-config-buildo',
  'eslint-plugin-tcomb',
  'smooth-release',
];

repos = [
  // { url: 'git@github.com:buildo/lexdoit.git', dir: 'web' },
  // { url: 'git@github.com:buildo/bobafett.git', dir: 'web' },
  { url: 'git@github.com:buildo/gdsm.git', dir: 'web' },
  // { url: 'git@github.com:buildo/hailadoc.git', dir: 'web' },
  // { url: 'git@github.omnilab.our.buildo.io:buildo/aliniq.git', dir: 'qia/web' },
  // { url: 'git@github.com:buildo/ipercron.git' },
  // { url: 'git@github.com:buildo/buildo.io.git' },
  // { url: 'git@github.com:buildo/state-react-router.git' },
  // { url: 'git@github.com:buildo/oxway.git', dir: 'web' },
].map(repo => {
  const parts = repo.url.replace('git@', '').split(':');
  const repoParts = parts[parts.length - 1].replace('.git', '').split('/');
  return Object.assign({}, repo, {
    owner: repoParts[0],
    repo: repoParts[1],
    githubUrl: parts[0]
  });
});

const tmp = require('tmp');
const npmCheck = require('npm-check');
const request = require('request');
const fs = require('fs');

const githubToken = repo => {
  return process.env.GITHUB_TOKEN;
};
const apiUrl = repo => {
  return `api.${repo.githubUrl}`;
};

const outdated = (folder) => {
  console.log('> running outdated in', folder);
  return npmCheck({ cwd: folder }).then(state => state.get('packages').map(p => ({
    wanted: p.packageWanted,
    latest: p.latest,
    name: p.moduleName
  })).reduce((acc, p) => Object.assign({}, acc, {
    [p.name]: p
  }), {}));
};

const fetchPackage = (repo, path) => new Promise((resolve, reject) => {
  console.log('fetching', repo.url, 'package.json');
  request({
    url: `https://${apiUrl(repo)}/repos/${repo.owner}/${repo.repo}/contents/${repo.dir ? `${repo.dir}/` : ''}package.json`,
    headers: {
      Authorization: `token ${githubToken(repo)}`,
      Accept: 'application/vnd.github.v3.raw',
      'User-Agent': 'curl/7.43.0'
    }
  }, (err, resp, contents) => {
    if (err) {
      reject(err);
    } else {
      fs.writeFileSync(`${path}/package.json`, contents, 'utf8');
      resolve();
    }
  });
});

const backporto = () =>
  Promise.all(repos.map(repo => new Promise((resolve, reject) => {
    tmp.dir({ unsafeCleanup: true }, (err, path) => {
      if (err) {
        reject(err);
      } else {
        fetchPackage(repo, path).then(() => outdated(path).then(deps => ({
          repo,
          outdated: Object.keys(deps)
            .filter(k => backporting.indexOf(k) !== -1)
            .filter(k => deps[k].wanted !== deps[k].latest)
            .map(k => ({ wanted: deps[k].wanted, latest: deps[k].latest, package: k }))
        }))).then(resolve).catch(reject);
      }
    });
  }))).then(outdatedRepos =>
    outdatedRepos.filter(repo => repo.outdated.length > 0)
      .map(repo =>
        `\n${repo.repo.url}\n${JSON.stringify(repo.outdated, null, 2)}`
      ).join('\n')
  );

const app = require('express')();
app.get('*', (req, res) => {
  backporto().then(out => {
    res.writeHead(200);
    res.end(out);
  }).catch(err => {
    res.writeHead(500);
    res.end(JSON.stringify(err));
  });
});
app.listen(3000)