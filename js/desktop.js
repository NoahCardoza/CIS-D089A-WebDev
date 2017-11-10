
(function(){
	var clock = document.querySelector("#clock");
	(function update(){
		clock.innerText = (new Date()).toTimeString().substr(0,8);
		setTimeout(update, 1000);
	})();
})();

class Desktop {
	constructor(selector, sys){
		var i = 0;
		this.sys = sys;
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
			return (new app(panel, this.sys));
		}
		return (0);
	}
}

class WebSk {
	constructor(url){
		this.ws = new (window.WebSocket || window.MozWebSocket)(url)
		this.callbacks = {};
		this.ws.onopen = () => console.info("WebSocket connection successful.");
		this.ws.onerror = () => console.error(e);
		this.ws.onmessage = (msg) => {
			msg = JSON.parse(msg.data);
			if (this.callbacks[msg.cb])
				this.callbacks[msg.cb](msg.data);
			else
				console.warn("WebSocket no callback found for %s.", msg.cb)
		}
	}

	on(cb, fn){
		this.callbacks[cb] = fn;
		return (this);
	}
	// get(cb){
	// 	this.send(cb);
	// }
}


class FileSystem {
	constructor(sys){
		this.sys = sys;
		this.structure = {};
		this.errno = -1;
		this.update = this.update.bind(this);
		console.log(sys.ws)
		this.sys.ws.on('fsupdate', this.update)
		// this.sys.ws.get('fsupdate')
	}

	getPath(path){
		var path = path.substr(1).split('/').filter(e => e);
		var file = this.structure['/'];
		for (let dir = 0; dir < path.length; dir++){
			file = file[path[dir]]
				if (!file){
					this.errno = 2; // no such file or directory
					return (0) 
				}
		}
		return (file);
	}

	isPathFile(path){
		if ((path = this.isPath(path))){
			if (path.c != undefined);
			return (path);
			this.errno = 21;
		}
		return (0);
	}

	isPathDir(path){
		if ((path = this.isPath(path))){
			if (path.c == undefined)
				return (path);
			this.errno = 20;
		}
		return (0);
	}

	isPath(path){
		if (typeof (path = this.getPath(path)) != 'number')
			return (path);
	}

	touch(path){
		var dir = path.split('/');
		dir = dir.splice(0, dir.length - 1).join('/');
		if (!this.isPath(path) && (dir = this.isPathDir(dir))){
			dir[path.split('/').pop()] = {p: 2, c: ""};
		} else
			this.errno = dir;
	}

	mkdir(path){
		var dir = path.split('/')
			dir = dir.splice(0, dir.length - 1).join('/');
		if (!this.isPath(path) && (dir = this.isPathDir(dir))){
			dir[path.split('/').pop()] = {};
		} else {
			this.errno = dir;
		}
	}
	mv(src, dest){
		var path = src.split('/');
		var dir = path.splice(0, path.length - 1).join('/');
		var dpath = dest.split('/');;
		if (src = this.isPath(src)) {
			if ((dest = this.isPathDir(dest))){
				let file = path.pop();
				dest[file] = src;
				delete (this.getPath(dir)[file]);
				return (1);
			} else if ((dest = this.isPathDir(dir))) {
				let sfile = path.pop();
				let dfile = dpath.pop();
				dest[dfile] = src;
				delete (this.getPath(path.join('/'))[sfile]);
				console.log("Valid 2", dest, dfile)
					return (1);
			}
		}
		console.log("Error")
			this.errno = 2;
		return (0)
	}
	read(path){
		var file; 
		if ((file = this.isPathFile(path)))
			if (file.p > 0)
				return (file.c);
			else
				this.errno = 13;
		return (0);
	}
	write(path, content){
		var file; 
		if ((file = this.isPathFile(path)))
			if (file.p > 1)
				file.c = content;
			else
				this.errno = 13;
		else
			return (0);
	}
	append(path, content){
		var file; 
		if ((file = this.isPathFile(path)))
			if (file.p > 1)
				file.c += content;
			else
				this.errno = 13;
		else
			return (0);
	}
	//chown(file, oct){}
	// stat(path){}
	update(struct){
		this.structure = struct;
		console.log(this)
	}
}

DB = Rhaboo.persistent('bot.net_db');

class OS {
	constructor(){
		// this.ws = new WebSk('ws://127.0.0.1:1337');
		// this.nc = new NotificationCenter(this);
		// this.fs = new FileSystem(this);
		this.ui = new Desktop(".windows", this);
	}
}

os = new OS();
// desktop = new Desktop(".windows");

// window.addEventListener('message', function(e) {
// 	console.log(e);
// 	switch (e.data.msg){
// 		case "browser-log":
// 			document.getElementById(e.data.fid).browser.urlChange(e.data.href);
// 			break;
// 	}
// });
