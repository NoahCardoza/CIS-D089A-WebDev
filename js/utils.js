String.prototype.toDOM= function(){

	var frag = document.createDocumentFragment();
	var nodes = (new DOMParser()).parseFromString(this, 'text/html').body.childNodes;
	for (var i = nodes.length - 1; i >= 0; i--) {
		frag.appendChild(nodes[i]);
	}
	return (frag);
};

function getSelectedText() {
	var text = "";
	if (typeof window.getSelection != "undefined") {
		text = window.getSelection().toString();
	} else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
		text = document.selection.createRange().text;
	}
	return text;
}

function createElement(type, attrs)
{
	var elm = document.createElement(type);
	for (var attr in attrs) {
		elm[attr] = attrs[attr]
	}
	return (elm);
}

function TryCatch(fn){
	return (new Promise(function(resolve, reject){
			resolve(fn());
	}));
}
