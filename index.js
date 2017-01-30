const tmp = require('tmp');
tmp.setGracefulCleanup();
const npmCheck = require('npm-check');
const request = require('request');
const fs = require('fs');

const githubToken = repo => {
  if (repo.githubUrl === 'github.omnilab.our.buildo.io') {
    return process.env.OMNI_GITHUB_TOKEN;
  }
  return process.env.GITHUB_TOKEN;
};
const apiUrl = repo => {
  if (repo.githubUrl === 'github.omnilab.our.buildo.io') {
    return `${repo.githubUrl}/api/v3`;
  }
  return `api.${repo.githubUrl}`;
};

const _outdated = (params) => {
  const tmpDir = params.tmpDir;
  const packageContents = params.packageContents;
  const backporting = params.backporting;
  console.log('> running outdated in', tmpDir);
  fs.writeFileSync(`${tmpDir}/package.json`, packageContents, 'utf8');
  return npmCheck({ cwd: tmpDir }).then(state =>
    state.get('packages')
    .map(p => ({
      wanted: p.packageWanted,
      latest: p.latest,
      package: p.moduleName
    }))
    .filter(p => backporting.indexOf(p.package) !== -1)
  );
};

const _packageContents = (params) => new Promise((resolve, reject) => {
  const repo = params.repo;
  const url = `https://${apiUrl(repo)}/repos/${repo.owner}/${repo.repo}/contents/${repo.dir ? `${repo.dir}/` : ''}package.json`;
  console.log('> fetching', url);
  request({
    url,
    headers: {
      Authorization: `token ${githubToken(repo)}`,
      Accept: 'application/vnd.github.v3.raw',
      'User-Agent': 'curl/7.43.0'
    }
  }, (err, resp, contents) => {
    if (err) {
      reject(err);
    } else {
      resolve(contents);
    }
  });
});

const _tmpDir = (params) => new Promise((resolve, reject) => {
  console.log(`> creating a tmpDir for`, params.repo.url);
  tmp.dir({ unsafeCleanup: true }, (err, path) => {
    if (err) {
      reject(err);
    } else {
      resolve(path);
    }
  });
});

const cacheFetch = require('avenger/lib/cache/operators').cacheFetch;
const Cache = require('avenger/lib/cache/Cache').Cache;
const Expire = require('avenger/lib/cache/strategies').Expire;
const compose = require('avenger/lib/fetch/operators').compose;
const product = require('avenger/lib/fetch/operators').product;

const expire1Hour = new Expire(1000 * 60 * 60);

const __outdated = cacheFetch(_outdated, expire1Hour, new Cache({ name: 'outdated' }));
const packageContents = cacheFetch(_packageContents, expire1Hour, new Cache({ name: 'packageContents' }));
const tmpDir = cacheFetch(_tmpDir, expire1Hour, new Cache({ name: 'tmpDir' }));

module.exports = (config) => {
  console.log('> backporto');

  const outdated = compose(
    product([tmpDir, packageContents]),
    ps => ({ tmpDir: ps[0], packageContents: ps[1], backporting: config.backporting }),
    __outdated
  );

  return Promise.all(
    config.repos.map(repo =>
      outdated([{ repo }, { repo }]).then(outdated => ({ repo, outdated }))
    )
  );
};
