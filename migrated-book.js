(() => {
  const ids = new Set(["alibi","deja-vu-and-the-end-of-history","turkiye-halk-istirakiyun-firkasi","zindiklar-ve-mulhidler","plantations","rule-of-experts-egypt","right-to-the-city-novels","defending-materialism","history-of-philosophy","experimental-beijing","yikarak-yapmak","thinking-art","friction","rickert-gegenstand-der-erkenntnis"]);
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!ids.has(id)) return;
  const query = new URLSearchParams({chapter:params.get('chapter') || '',lang:params.get('view') || 'zh'});
  if (location.hash) query.set('anchor',decodeURIComponent(location.hash.slice(1)));
  location.replace('/union.html#/read/' + encodeURIComponent(id) + '?' + query);
})();
