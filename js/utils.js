
function TryCatch(fn){
	return (new Promise(function(resolve, reject){
			resolve(fn());
	}));
}
