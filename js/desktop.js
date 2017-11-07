
(function(){
	var clock = document.querySelector("#clock");
	(function update(){
		clock.innerText = (new Date()).toTimeString().substr(0,8);
		setTimeout(update, 1000);
	})();
})();

class Desktop {
	constructor(selector){
		var i = 0;
		this.parent = document.querySelector(selector);
		this.panels = [];
		this.rows = [];
		while (i < 9){
			this.panels[i++] = createElement('div', {className: "app closed", index:i});
		}
		i = 0;
		while (i < 3){
			this.rows[i] = createElement('div', {className: "window-row closed", index:i});
			for (let j = 0; j < 3; j++){
				console.log((i * 3) + j, i,j);
				this.rows[i].appendChild(this.panels[(i * 3) + j]);
			}
			this.parent.appendChild(this.rows[i++]);
		}
		this.open(Terminal);
	}
	get_window(){
		var i = 0;
		while (i < 9){
			if (this.panels[i].classList.contains("closed")){
				this.panels[i].classList.remove("closed");
				this.panels[i].parentElement.classList.remove("closed");
				return (this.panels[i]);
			}
			i++;
		}	
		return (0);
	}
	close_window(p){
		let i = Math.floor(p / 3) * 3; 
		this.panels[p].classList.add("closed");
		if (this.panels.slice(i, i + 3).every(e => e.classList.contains("closed")))
			this.rows[p].classList.add("closed");
	}
	close(app){
		this.close_window(this.panels.indexOf(app.root));
		app.close();
		app.constructor.instances.delete(app);
	}
	open(app){
		let panel = this.get_window();
		if (panel){
			return (new app(panel));
		}
		return (0);
	}
}

DB = Rhaboo.persistent('bot.net_db');
desktop = new Desktop(".windows");

window.addEventListener('message', function(e) {
	console.log(e);
	switch (e.data.msg){
		case "browser-log":
			document.getElementById(e.data.fid).browser.urlChange(e.data.href);
			break;
	}
});
