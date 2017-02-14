module.exports.backporting = [
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
  'babel-preset-buildo'
];

module.exports.repos = [
  { url: 'git@github.com:buildo/lexdoit.git', dir: 'web' },
  { url: 'git@github.com:buildo/bobafett.git', dir: 'web' },
  { url: 'git@github.com:buildo/gdsm.git', dir: 'web' },
  { url: 'git@github.com:buildo/gdsm.git', dir: 'backoffice' },
  { url: 'git@github.com:buildo/hailadoc.git', dir: 'web' },
  { url: 'git@github.omnilab.our.buildo.io:buildo/aliniq.git', dir: 'qia/web' },
  { url: 'git@github.omnilab.our.buildo.io:buildo/ams.git', dir: 'web' },
  { url: 'git@github.com:buildo/ipercron.git' },
  { url: 'git@github.com:buildo/oxway.git', dir: 'web' },
  { url: 'git@github.com:buildo/buildo.io.git' },

  { url: 'git@github.com:buildo/state-react-router.git' },
  { url: 'git@github.com:buildo/react-components.git' },
  { url: 'git@github.com:buildo/metarpheus-js-http-api.git' },
  { url: 'git@github.com:buildo/scriptoni.git' },
  { url: 'git@github.com:buildo/state.git' },
  { url: 'git@github.com:buildo/react-avenger.git' },
].map(repo => {
  const parts = repo.url.replace('git@', '').split(':');
  const repoParts = parts[parts.length - 1].replace('.git', '').split('/');
  return Object.assign({}, repo, {
    owner: repoParts[0],
    repo: repoParts[1],
    githubUrl: parts[0]
  });
});
