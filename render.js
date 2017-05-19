const React = require('react');
const ReactDOMServer = require('react-dom/server');
const semver = require('semver');

const e = React.createElement;

const latest = (b, out) => {
  for (o of out) {
    for (oo of o.outdated) {
      if (oo.package === b) {
        return oo.latest;
      }
    }
  }
  return '?';
};

const cell = (backporting, out) => {
  const outdated = out.outdated.filter(o => o.package === backporting)[0];
  if (!outdated) {
    return '';
  }
  if (semver.gte(outdated.wanted, outdated.latest)) {
    return '👍'
  }
  if (semver.diff(outdated.wanted, outdated.latest) === 'major') {
    return `💩 (${outdated.wanted})`;
  }
  return `😑 (${outdated.wanted})`;
};

module.exports = (config, out) => ReactDOMServer.renderToStaticMarkup(
  e('table', { style: { textAlign: 'center' } }, [
    e('thead', null,
      [e('th', { key: '' }, '\\')].concat(config.backporting.map(b => e('th', { key: b }, `${b} (${latest(b, out)})`)))
    ),
    e('tbody', null,
      out.map((o, i) => e('tr', { key: `${o.repo.repo}-${o.repo.dir || '/'}`, style: { backgroundColor: i % 2 === 0 ? '#f0f0f0' : '#fff' } },
        [e('td', { key: '' }, `${o.repo.repo}${o.repo.dir ? `/${o.repo.dir}` : ''}`)].concat(config.backporting.map(b => e('td', { key: b }, cell(b, o))))
      ))
    )
  ])
);