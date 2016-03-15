;(function() {

	var Puzzle = function() {

		this.templateClasses = ["text", "image_1", "image_2", "image_3", "image_4"],
		this.difficulty = 0,

		this.targetNode = {},

		this.currentNode = {},

		this.difficulty = 0,
		this.name = "";
	};

	Puzzle.fn = Puzzle.prototype = {

		_reset: function() {

			this.targetNode = new Node(15, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]);

			this.currentNode = $.extend(true, {}, this.targetNode);
			this.difficulty = 0;

			var grid_items = $(".grid_item");

			for(var i =0; i<grid_items.length; i++) {
				var selector = $(grid_items[i]),
				posClass = this._getPosClass(selector);

				$(selector).removeClass("blank candidate " + posClass);
				
				$(selector).addClass("pos_" + i);
			}
			
			$("#grid_0").addClass("blank");

			this._addCandidates();
		},

		_change: function(callback) {

			var template = this.templateClasses[Math.floor(Math.random() * this.templateClasses.length)],

			that = this,

			items = $(".grid_item");

			applyClass = function(index) {
				setTimeout(function() {
					var element = items[index];
					if(typeof element !== "undefined") {
						$(element).addClass(template);
						applyClass(index + 1);
					}
					else {
						callback();
					}
				}, 100);
			};

			applyClass(0);
			
		},

		addEvents: function() {

			var that = this,

			actions = $(".btn_primary");

			for(var i=0; i<actions.length; i++) {
				$(actions[i]).click(function() {
					var id = $(this).attr("id");
					if(id in that && typeof that[id] === "function") {
						that[id]();
					}
				});
			}

			$(document).on("click", ".candidate", function() {

				that._moveGridItem($(this));
			});
		},

		_shuffle: function(callback) {
			$(".loading").show();
			var that = this,

			startShuffle = function(index, lastRandom) {
				if(index < that.difficulty * 10){
					setTimeout(function() {
						var candidates = $(".candidate");

						if(lastRandom !== null) {
							var randomId = $(lastRandom).attr("id");
							for(var i=0; i<candidates.length; i++) {
								if($(candidates[i]).attr("id") === randomId) {
									candidates.splice(i, 1);
									break;
								}
							}
						}
						var randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
						that._moveGridItem(randomCandidate);
						startShuffle(index + 1, randomCandidate);
					}, 100);
				}
				else {
					$(".loading").hide();
					callback();
				}	
			};
			that._change(function() {
				setTimeout(function() {
					startShuffle(0, null);
				}, 2000);
				
			});
			
		},

		start: function() {

			var difficulty = $("#difficulty").val(),
				name = $("#name").val(),
				that = this;

			if(isNaN(parseInt(difficulty)) || difficulty>3 || difficulty<1 || !(/^[a-zA-Z()]+$/.test(name))) {
				$(".error").show();
				return false;
			}

			this.difficulty = difficulty;
			this.name = name;

			$(".popup_container").fadeOut(100);
			$("#grid").fadeIn(500, function() {
				that._shuffle(function() {
					$("#actions").show();
				});
			});
		},

		hint: function() {
			var astar = new AStar(),
				result = astar.solve();

			this._moveGridItem($(".pos_" + result[0].blankIndex));
		},

		giveup: function() {

			$(".loading").show();

			var astar = new AStar(),
				result = astar.solve(),
				that = this;
				
			$(".loading").hide();

			delete solver;

			moveItem = function(index) {
				if(index <result.length) {
					var node = result[index];
						that._moveGridItem($(".pos_" + node.blankIndex));

					setTimeout(function() {
						moveItem(index + 1);

					}, 250);
				}
			};

			moveItem(0);
		},

		getCandidateNodes: function(node) {
			var candidates = this._getCandidatesIndices(node.blankIndex),
				nodes = [];

			for(var i =0;i<candidates.length; i++) {
				var newNode = this._deriveNewNode(node, candidates[i]);
				newNode.gCost = (newNode.parent.gCost || 0) + 1;
				nodes.push(newNode);
			}

			return nodes;
		},

		_getCandidatesIndices: function(blankIndex) {

			var blank2d = this.convertIndexto2D(blankIndex),
				candidates = [];

				if(blank2d[0] + 1 < 4) {
					candidates.push(this.convert2dToIndex([blank2d[0] + 1, blank2d[1]]));
				}
				if(blank2d[1] + 1 < 4) {
					candidates.push(this.convert2dToIndex([blank2d[0], blank2d[1] + 1]));
				}
				if(blank2d[0] - 1 > -1) {
					candidates.push(this.convert2dToIndex([blank2d[0] - 1, blank2d[1]]));
				}
				if(blank2d[1] - 1 > -1) {
					candidates.push(this.convert2dToIndex([blank2d[0], blank2d[1] - 1]));
				}

			return candidates;
		},

		_deriveNewNode: function(node, index) {

			var newNode = $.extend(true, {}, node);

			newNode.order[node.blankIndex] = node.order[index];
			newNode.blankIndex = index;
			newNode.order[index] = 0;
			newNode.gCost = node.gCost;
			newNode.hCost = node.hCost;

			return newNode;
		},

		convert2dToIndex: function(index2d) {
			return index2d[0] * 4 + index2d[1];
		},

		convertIndexto2D: function(index) {
			var i = Math.floor(index / 4),
			j = (index) % 4;
			return [i,j];
		},

		_moveGridItem: function(selector) {

			var that = this,
				blankPosClass = that._getPosClass($(".blank")),
				currentPosClass = that._getPosClass($(selector)),
				index = parseInt(currentPosClass.split("pos_")[1]);

			that.currentNode = that._deriveNewNode(that.currentNode, index);
			
			$(".blank").removeClass(blankPosClass);
			$(".blank").addClass(currentPosClass);

			$(selector).removeClass(currentPosClass);
			$(selector).addClass(blankPosClass);

			$(".candidate").removeClass("candidate");

			that._addCandidates();
		},

		_addCandidates: function() {

			var candidates = this._getCandidatesIndices(this.currentNode.blankIndex);

			for(var i=0; i<candidates.length; i++) {

				var selector = ".pos_" + candidates[i];

				$(selector).addClass("candidate");
			}

		},

		_getPosClass: function(element) {
			var classList = $(element).attr('class').split(/\s+/);
			for(var i=0;i<classList.length; i++){
			    if (classList[i].indexOf("pos_") !== -1) {
			        return classList[i];
			    }
			}
		}

	};

	var puzzle = new Puzzle();
		puzzle.addEvents();
		puzzle._reset();

		window.puzzle = puzzle;

})();