(function() { // https://developer.mozilla.org/en-US/docs/Web/Events/resize
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    throttle("resize", "optimizedResize");
})();

Array.prototype.rand = function() {
	return this[Math.floor(Math.random()*this.length)];
};

class Strip extends Array {
	constructor(length, slot, col){
		super();
		this.length = length;
		this.slot = slot;
		this.col = col || -length;
		this.speed = (Math.random()*0.4)+0.1;
		this.active = true;
		this.shuffle(1);
	}

	static get max_slot(){return Math.floor(window.innerWidth/Strip.prototype.fontsize);}
	static get max_col(){return Math.ceil(window.innerHeight/Strip.fontsize);}

	shuffle(n){
		if (n > 0.9)
		{
			for (var i = 0; i < this.length; i++) {
				this[i] = ['诶', '比', '西', '迪', '伊', '吉', '艾', '杰', '开', '哦', '屁', '提', '维'].rand();
			}
		}
	}

	print(){
		if (this.active){
			var color;
			for (var char = this.length - 1; char >= 0; char--) {
				color			= this.fillColors[this.length-char-1] || this.fillColors[this.fillColors.length-1];
				c.shadowBlur	= char*10;
				c.shadowColor	= color;
				c.fillStyle		= color;
				c.fillText(this[char], this.slot*this.fontsize, (char * this.fontsize)+(this.col * this.fontsize));
			}
			this.fall();
		} else {
			this.replace();
		}	
	}

	replace(){
		var length;
		var i;
		if (!this.active){
			var inactive_slot;
			for (i = this.que.length - 1; i >= 0; i--) {
				if (!this.que[i].active){
					inactive_slot = this.que[i].slot;
					break;
				}
			}
			if (inactive_slot){
				this.que[i] = undefined;
				length = Math.ceil(Math.random()*10);
				this.que.replace(i, Strip, length, inactive_slot);
			}
		} else if (que.length < Strip.max_slot){
			var slot;
			i = this.que.indexOf(this);
			var slots = que.map(function(e){return e.slot;});
			length = Math.ceil(Math.random()*10);
			do {
				slot = Math.ceil(Math.random()*Strip.max_slot);
			} while(slots.includes(slot));
			this.que[i] = undefined;
			this.que.replace(i, Strip, length, slot);
		} else {
			this.active = false;
		}
	}

	fall(){
		if (this.col > Strip.max_col){
			this.replace();
		} else {
			this.col += this.speed;
		}
	}
}

Strip.fontsize				= 16;
Strip.prototype.fontsize 	= 16;
Strip.prototype.fillColors 	= ['#99FF87', '#77FF60', '#65FF4B', '#2DFF3C', '#1AFC2A', '#00FF00', '#04E405'];

class Que extends Array{

	add(obj){
		var cls = new (obj.bind.apply(obj, Array.from(arguments)))();
		cls.que = this;
		this.push(cls);
	}

	replace(i, obj){
		var cls = new (obj.bind.apply(obj, Array.from(arguments).splice(1)))();
		cls.que = this;
		this[i] = cls;
	}

	batch(i, obj, args){
		var trackme = [];
		while (i--){
			this.add.apply(this, [obj].concat(args(trackme)));
		}
	}

	run(func){
		for (var i = this.length - 1; i >= 0; i--) {
			func.apply(this, [this[i], i]);
		}
	}

	remove(obj){
		var i = this.indexOf(obj);
		this[i] = undefined;
		if (this.onremoval){
			this.onremoval.apply(this, [i]);
		}
	}
}

function animate(){
	c.clearRect(0, 0, canvas.width, canvas.height);
	que.run(function(obj, i){
		// if (Math.random() > 0.5)
		// {
			obj.print();
			obj.shuffle(Math.random());
		// }
	});
	requestAnimationFrame(animate);
}

document.querySelector(".block-x").onclick = () => {
	document.querySelector("body").classList.remove("disable-scrolling");
	document.querySelector(".block-notify").style.display = 'none';
} 

var canvas		= document.querySelector('canvas');
canvas.width	= window.innerWidth;
canvas.height	= window.innerHeight;   

if (window.chrome) // isChrome
{
	WebFont.load({
	  custom: {
	    families: ['Roboto Mono'],
	    urls : ['fonts/roboto-mono-v5-latin/roboto-mono.css']
	  },
	  active:function(){
		c = canvas.getContext('2d');
		c.globalCompositeOperation = 'lighter';
		c.font = "16px Roboto Mono";

		window.addEventListener("optimizedResize", function() {
		    canvas.width				= window.innerWidth;
			canvas.height				= window.innerHeight; 
			c.globalCompositeOperation	= 'lighter';
			c.font						= "16px Roboto Mono";

			if (Strip.max_slot-1 > que.length){
				que.batch(Strip.max_slot-que.length-1, Strip, function(){
					var length 	= Math.ceil(Math.random()*10);
					var col 	= (Math.random()*Strip.max_col)-length;
					return [length, que.length, col];
				});
			} else {
				que.length = Strip.max_slot-1;
			}
		});

		que = new Que();
		que.batch(Strip.max_slot-1, Strip, function(){
			var length 		= Math.ceil(Math.random()*10);
			var col 		= (Math.random()*Strip.max_col)-length;
			return [length, que.length, col];
		});
		requestAnimationFrame(animate);
	}
	});
} else {
	document.querySelector("body").classList.add("disable-scrolling");
	document.querySelector(".block-notify").style.display = 'block';
}

