const highlightJSON = (obj) => {
  let json = JSON.stringify(obj, null, 2);
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  json = json.replace(/("(?:[^"\\]|\\.)*")/g, function (match, p1, offset) {
    if (/^\s*"/.test(match) && /^\s*:/.test(json.substring(offset + match.length, offset + match.length + 10))) {
      return '<span class="json-key">' + match + '</span>';
    }
    return '<span class="json-string">' + match + '</span>';
  });
  return json;
};
console.log(highlightJSON({ limit: '5', value: 'hello' }));
