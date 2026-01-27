const dm = require('dommatrix');
console.log('Direct type:', typeof dm);
console.log('Is constructor direct:', typeof dm === 'function' && /class|function/.test(dm.toString()) ? 'Yes' : 'No');
console.log('Has default:', 'default' in dm);
console.log('Has DOMMatrix:', 'DOMMatrix' in dm);

