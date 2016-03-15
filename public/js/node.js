;(function() {

	var Node = function(blankIndex, order) {
		this.order = order,
		this.blankIndex = blankIndex,
		this.gCost = 0,
		this.hCost = 0,
		this.parent = {};
	};

	Node.fn = Node.prototype = {

		getFCost: function() {
			return this.gCost + this.hCost;
		},

		getKey: function() {
			return JSON.stringify({
					order : this.order,
					blankIndex : this.blankIndex
			});
		},

		compareTo: function(node1, node2) {
			if(node1.getFCost() > node2.getFCost()) {
				return 1;
			}
			else if(node1.getFCost() < node2.getFCost()) {
				return -1;
			}

			if(node1.hCost > node2.hCost) {
				return 1;
			}

			return -1;
		}

	};

	window.Node = Node;

})();