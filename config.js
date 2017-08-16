module.exports.backporting = [
  // react (no react-dom as they must be in sync anyway)
  'react',
  // components
  'buildo-react-components',
  'rc-datepicker',
  'react-flexview',
  'react-autosize-textarea',
  'react-cookie-banner',
  'react-input-children',
  'revenge',
  // data
  'buildo-react-container',
  'avenger',
  'react-avenger',
  'buildo-state',
  'buildo-state-react-router',
  'react-formo',
  // build & scripts
  'sass-variables-loader',
  'scriptoni',
  'smooth-release',
  'babel-preset-buildo',
  // misc
  'metarpheus-js-http-api',
  'local-date',
  'metarpheus-tcomb'
];

module.exports.repos = [
  // final projects
  { url: 'git@github.com:buildo/lexdoit.git', dir: 'web' },
  { url: 'git@github.com:buildo/bobafett.git', dir: 'web' },
  { url: 'git@github.com:buildo/gdsm.git', dir: 'web' },
  { url: 'git@github.com:buildo/gdsm.git', dir: 'backoffice' },
  { url: 'git@github.omnilab.our.buildo.io:buildo/alinity-pro.git', dir: 'qia/web' },
  { url: 'git@github.com:buildo/buildo.io.git' },
  { url: 'git@github.com:buildo/webseed.git' },
  // libs
  { url: 'git@github.com:buildo/state-react-router.git' },
  { url: 'git@github.com:buildo/react-components.git' },
  { url: 'git@github.com:buildo/react-flexview.git' },
  { url: 'git@github.com:buildo/react-autosize-textarea.git' },
  { url: 'git@github.com:buildo/react-placeholder.git' },
  { url:  'git@github.com:buildo/react-input-children.git' },
  { url: 'git@github.com:buildo/metarpheus-js-http-api.git' },
  { url: 'git@github.com:buildo/formo.git' },
  { url: 'git@github.com:buildo/scriptoni.git' },
  { url: 'git@github.com:buildo/state.git' },
  { url: 'git@github.com:buildo/react-avenger.git' },
  { url: 'git@github.com:buildo/react-container.git' },
  { url: 'git@github.com:buildo/rc-datepicker.git' }
].map(repo => {
  const parts = repo.url.replace('git@', '').split(':');
  const repoParts = parts[parts.length - 1].replace('.git', '').split('/');
  return Object.assign({}, repo, {
    owner: repoParts[0],
    repo: repoParts[1],
    githubUrl: parts[0]
  });
});
