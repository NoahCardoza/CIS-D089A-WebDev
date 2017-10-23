var API = function(endpoint, data){
	return new Promise( function( resolve, reject ) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "../api/"+endpoint, true); // this will have to chage
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader("X-lax-HTTP", "1.4.05");
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				resolve(JSON.parse(xhr.response));
			} else {
				alert("HTTP Error: "+this.status);
				console.error(endpoint, this.status, xhr.statusText);
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			}
		};
		xhr.onerror = function () {
			alert("HTTP Error: "+this.status);
			console.error(endpoint, this.status, xhr.statusText);
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		};
		xhr.send('data='+JSON.stringify(data));
	});
};