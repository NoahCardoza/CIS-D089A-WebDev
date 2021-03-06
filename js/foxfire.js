
// window.addEventListener("message", function(e){
// 	console.log(e)
// }, false);


class Foxfire {
	constructor(selector){
		Foxfire.instances.add(this);
		this.history = -1;
		this.history_back = 0;
		this.e = {
			parent	: selector, //document.querySelector(selector),
			navbar	: createElement('div', {className:"url"}),
			prev	: createElement('div', {className:"arrow-left unavailable"}),
			next	: createElement('div', {className:"arrow-right unavailable"}),
			reload	: createElement('div', {className:"reload", onclick:() => this.go(this.url)}),
    		input	: createElement('input', {type:"text", autocapitalize:false}),
    		iframe	: createElement('iframe', {browser:this, id:Math.random()})
		};

		this.e.parent.classList.add("app-foxfire");
		this.e.navbar.appendChild(this.e.prev);
		this.e.navbar.appendChild(this.e.next);
		this.e.navbar.appendChild(this.e.reload);
		this.e.navbar.appendChild(this.e.input);
		this.e.parent.appendChild(this.e.navbar);
		this.e.parent.appendChild(this.e.iframe);
		this.prevonclick = () => {
				if (!--this.history)
					this.e.prev.classList.add('unavailable');
				this.history_back++;
				this.e.next.classList.remove('unavailable');
				this.e.reload.classList.add("loading");
				this.e.iframe.contentWindow.history.back()
				setTimeout(()=>{
					this.e.input.value = this.e.iframe.contentWindow.location.href;
				}, 100);
		}
		this.nextonclick = () => {
			var href = this.e.iframe.contentWindow.location.href;
			this.history++;
			this.history_back--;
			this.e.reload.classList.add("loading");
			this.e.iframe.contentWindow.history.forward()
			if (!this.history_back)
				this.e.next.classList.add('unavailable');
			if (this.history)
				this.e.prev.classList.remove('unavailable');
			setTimeout(()=>{
				this.e.input.value = this.e.iframe.contentWindow.location.href;
			}, 100);
		}

		this.e.prev.addEventListener("click", this.prevonclick);
		this.e.next.addEventListener("click", this.nextonclick);
		this.onload = this.onload.bind(this);
		this.e.iframe.addEventListener("load", this.onload);

		this.onkeydown = this.onkeydown.bind(this);
		this.e.input.addEventListener("keydown", this.onkeydown);

		this.go('welcome.html')
	}
	onkeydown(){
		if (e.keyCode == 13)
			this.go();
	}
	onload(){
		this.e.reload.classList.remove("loading");
	}
	// This sends an api request submitting whatever is in the prompt
	go(url){
		if (url === undefined){
			this.e.next.classList.add('unavailable');
			this.history_back = 0;
			url = this.e.input.value;
		}
		this.history += (this.url != url);
		this.url = url;
		// else if (url.constructor === Number)
		// {
		// 	if (0 <= this.histori + url && this.histori + url < this.history.length){
		// 		this.url = this.history[(this.histori += url)];
		// 	}
		// 	this.e.prev.classList.remove('unavailable');
		// 	this.e.next.classList.remove('unavailable');
		// 	if (this.histori == 0)
		// 		this.e.prev.classList.add('unavailable');
		// 	else if (this.histori == this.history - 1)
		// 		this.e.next.classList.add('unavailable');
		// 	this.e.reload.classList.add("loading");
		// 	this.e.iframe.src = this.url;
		// 	return;
		// }

		// if (this.url != url)
		// this.history[++this.histori] = (this.url = url);
		if (this.history)
			this.e.prev.classList.remove('unavailable');
		this.e.reload.classList.add("loading");
		this.e.input.value = this.e.iframe.src = url;

		// if (!url.match(/^https?:\/\//))
		// {
		// 	url = "https://" + url;
		// 	this.e.input.value = url;
		// }


		// DB.terminal.history.push(cmd);
		// this.history = DB.terminal.history.length;
		// prompt.replaceChild(createElement('span', {innerText:prompt.lastChild.value}), prompt.lastChild);
		// prompt.className = 'prompt';
		// this.e.stdout.appendChild(prompt);
		// this.e.stdout.scrollTop = this.e.stdout.scrollHeight;

		// this.e.input.value = '';
		// this.e.input.setAttribute('disabled', '')
		// API("terminal", {stdin:cmd, env:this.env}).then(this.exe.bind(this, prompt)) 
	}
	// This is used to send messages to the terminal screen

	urlChange(href){
		if (!href)
			return;
		var reloads = 0;
		this.history++;
		this.history_back = 0;
		this.e.prev.classList.remove('unavailable');
		this.e.next.classList.add('unavailable');
		this.e.input.value  = (this.url = href);
		//  (function recall (){
		//  	if (reloads > 10)
		//  		return;
		// 	if (this.e.iframe.contentWindow.location.href == href)
		// 		this.e.input.value = this.e.iframe.contentWindow.location.href;
		// 	else 
		// 		setTimeout(recall.bind(this), 500);
		// }.bind(this))()
	}
}
Foxfire.instances = new Set();
