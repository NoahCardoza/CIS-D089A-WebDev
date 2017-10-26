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

(function(){
	var clock = document.querySelector("#clock");
	(function update (){
		clock.innerText = (new Date()).toTimeString().substr(0,8);
		setTimeout(update, 1000);
	})();
})();

DB = Rhaboo.persistent('bot.net_db');

terminal = new Terminal('.app-terminal');
// terminal2 = new Terminal('#terminal-154873');
foxfire = new Foxfire('.app-foxfire');
// foxfire2 = new Foxfire('#foxfire-154873');


window.addEventListener('message', function(e) {
	console.log(e);
	switch (e.data.msg){
		case "browser-log":
		document.getElementById(e.data.fid).browser.urlChange(e.data.href);
		break;

 	}

});
