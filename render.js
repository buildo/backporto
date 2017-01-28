React = require('react');
ReactDOMServer = require('react-dom/server');
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
  if (outdated.wanted === outdated.latest) {
    return '👍'
  }
  return `💩 (${outdated.wanted})`;
};

module.exports = (config, out) => ReactDOMServer.renderToStaticMarkup(
  e('table', { style: { textAlign: 'center' } }, [
    e('thead', null,
      [e('th', { key: '' }, '\\')].concat(config.backporting.map(b => e('th', { key: b }, `${b} (${latest(b, out)})`)))
    ),
    e('tbody', null,
      out.map((o, i) => e('tr', { key: o.repo.repo, style: { backgroundColor: i % 2 === 0 ? '#f0f0f0' : '#fff' } },
        [e('td', { key: '' }, o.repo.repo)].concat(config.backporting.map(b => e('td', { key: b }, cell(b, o))))
      ))
    )
  ])
);