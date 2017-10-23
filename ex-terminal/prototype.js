String.prototype.insertAt = function(s, i) {
		return this.substring(0, i) + s + this.substring(i, this.length);
};

String.prototype.delAt = function(i) {
		return this.substring(0, i) + this.substring(i+1, this.length);
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}