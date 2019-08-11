function getBlockStyle(block) { 
	switch (block.getType()) {
    	case 'blockquote': return 'RichEditor-blockquote';
		default: return null;
	}
}

function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }

  return '';
}