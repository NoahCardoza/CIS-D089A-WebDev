
// window.addEventListener("message", function(e){
// 	console.log(e)
// }, false);


class Foxfire {
	constructor(selector){
		// if (!DB.foxfire)
			// DB.write('foxfire', {history:[]})
		// this.history = DB.terminal.history.length;
		this.history = -1;
		this.history_back = 0;
		// this.histori = this.history.length;
		this.e = {
			parent	: document.querySelector(selector),
			navbar	: createElement('div', {className:"url"}),
			prev	: createElement('div', {className:"arrow-left unavailable", onclick:() => {
				if (!--this.history)
					this.e.prev.classList.add('unavailable');
				this.history_back++;
				this.e.next.classList.remove('unavailable');
				this.e.reload.classList.add("loading");
				this.e.iframe.contentWindow.history.back()
				setTimeout(()=>{
					this.e.input.value = this.e.iframe.contentWindow.location.href;
				}, 100);
			}}),
			next	: createElement('div', {className:"arrow-right unavailable", onclick:() => {
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

				// setTimeout(()=>{
				// 	this.e.input.value = this.e.iframe.contentWindow.location.href;
				// 	if (this.e.input.value == href)
				// 		this.e.next.classList.add('unavailable');
				// }, 1000);
			}}),
			reload	: createElement('div', {className:"reload", onclick:() => this.go(this.url)}),
    		input	: createElement('input', {type:"text", autocapitalize:false}),
    		iframe	: createElement('iframe', {browser:this, id:Math.random()})
		};

		this.e.navbar.appendChild(this.e.prev);
		this.e.navbar.appendChild(this.e.next);
		this.e.navbar.appendChild(this.e.reload);
		this.e.navbar.appendChild(this.e.input);
		this.e.parent.appendChild(this.e.navbar);
		this.e.parent.appendChild(this.e.iframe);

		this.e.iframe.onload = () => {
			this.e.reload.classList.remove("loading");
		}

		this.e.input.onkeydown = (e) => {
			if (e.keyCode == 13)
				this.go();
		}

		this.e.input.onkeydown = (e) => {
			if (e.keyCode == 13)
				this.go();
		}
		this.go('welcome.html')
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