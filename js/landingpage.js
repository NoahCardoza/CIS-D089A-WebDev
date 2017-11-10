NotificationCenter = new NotificationCenter();

var $ = {
	btn: {
		register: document.querySelector("#btn-register"),
		login: document.querySelector("#btn-login")
	},
	block: {
		register: document.querySelector("#register-block")
	},
	input: {
		username: document.querySelector('[name="username"]'),
		email: document.querySelector('[name="email"]'),
		password: document.querySelector('[name="password"]')
	},
	img: {
		logo: document.querySelector('#logo')
	}
}

function onKey(key, fn){
	return (e) => {
		if (e.which == key) fn();
	}
}

// $.btn.login.addEventListener('click', function onLoginClick(){
// 	if (!$.block.register.classList.contains("open")){
// 		$.block.register.addEventListener('keydown', onKey(13, () => $.btn.login.click()));
// 		$.btn.register.classList.add("hidden");
// 		$.input.username.classList.remove('hidden');
// 		$.input.password.classList.remove('hidden');
// 		$.img.logo.classList.remove("hidden");
// 		$.block.register.classList.add("open");
// //				$.img.logo.classList.add("open");
// 	} else {
// 		NotificationCenter.notify({time:3,type:"error",title:"API Error",msg:"The API has not yet been connected to the server on this host. To see the real site click <a href='http://battleofthe.net'>here</a>."})
// 		// API("login", {
// 		// 	username: $.input.username.value,
// 		// 	password: $.input.password.value
// 		// }).then((r) => {
// 		// 	if (r.status)
// 		// 		location.reload();
// 		// 	else {
// 		// 		//notify(1, "error", "Error", r.msg);
// 		// 	}
// 		// });
// 	}
	
	
// });

$.btn.register.addEventListener('click', function onRegisterClick(){
	if (!$.block.register.classList.contains("open")){
		$.block.register.addEventListener('keydown', onKey(13, () => $.btn.register.click()));
		// $.btn.login.classList.add("hidden");
		$.input.username.classList.remove('hidden');
		$.input.email.classList.remove('hidden');
		$.input.password.classList.remove('hidden');
		$.block.register.classList.add("open");
		$.img.logo.classList.remove("hidden");
	} else {
		NotificationCenter.notify({time:3,type:"error",title:"API Error",msg:"The API has not yet been connected to the server on this host. To see the real site click <a href='http://battleofthe.net'>here</a>."})
		// API.bind({}, "register", {
		// 	username: $.input.username.value,
		// 	email: $.input.email.value,
		// 	password: $.input.password.value
		// }).then(r => {
		// 	if (r.status){
		// 		//notify(1, "Success", "Error", r.msg);
		// 	}
		// 	else {
		// 		//notify(1, "error", "Error", r.msg);
		// 	}
		// });
	}
});