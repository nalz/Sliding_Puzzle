/*
	The puzzle class maintains the state of the 4X4 grid. It is also 
	responsible for handling DOM interactions, adding/removing classes,
	keeping track of the number of moves the user took to get to the target node. 

	All private functions are prefixed with _ and can be found at the bottom of the class. 

	@author: Nalin Ahuja
 */

;(function() {
	/**
	 * Represents the puzzle
	 * @constructor
	 *
	 * Properties: 
	 * templateClasses - The background classes which the grid can have. Each class has a different
	 * 					 background image except the text class
	 * difficulty - The difficulty level the user selected. It can be between 1-3
	 * targetNode - Target Node class, the order of which never changes. It is the final state
	 * 				the user is trying to get to. 
	 * currentNode - The current combination that the grid holds. This node is updated everytime
	 * 				 the user selects a grid item
	 * name 	   - Name entered by the user
	 * moves 	   - Number of attempts made by the user. A hint counts as 3 attempts	
	 */
	var Puzzle = function() {

		this.templateClasses = ["text", "image_1", "image_2", "image_3", "image_4"],
		this.difficulty = 0,

		this.targetNode = {},

		this.currentNode = {},

		this.difficulty = 0,
		this.name = "",
		this.moves = 0;
	};

	Puzzle.size = 4;
	Puzzle.shuffleMultiplier = 10;

	Puzzle.fn = Puzzle.prototype = {

		/**
		 * Reset function resets the classes and order of the nodes to the target state. 
		 *
		 * Its only being used right now when the puzzle first loads
		 */
		reset: function() {

			
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

		/**
		 * The addEvents function queries all the buttons that are present in the dom and uses their id attribute
		 * to bind click events. For simplicity we use the same function names as id values. 
		 * So for button with id="start", the click handler will be function start()
		 *
		 * It also adds click events on the document. The candidate class are applied on the div elements
		 * that are the current neighbors of the blank div. Since that can change as the user interacts 
		 * with the grid, we need to add this dynamic listener. The callback function updates the moves number on 
		 * the top left of the screen and also updates the grid. Finally it checks, if the user has completed
		 * the puzzle and then shows the scoreboard screen. 
		 */

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
				that.moves++;
				that._updateMoves();
				
				that._moveGridItem($(this));

				if(that.finished(that.currentNode)) {
					that._scoreboard(true);
				}
			});
		},

		/**
		 * When the app first loads, the user is presented with a form. We do validations on name and difficulty fields. 
		 * The name should strictly be alphabetical with no spaces and difficulty should be an integer between 1 and 3. 
		 *
		 * After the validation passes, we set the properties on our puzzle instance and call the private function _change
		 * that selects a random template and applies the corresponding class to the grid.
		 * 
		 */

		start: function() {

			var difficulty = $("#difficulty").val(),
				name = $("#name").val(),
				that = this;

			if(isNaN(parseInt(difficulty)) || difficulty>3 || difficulty<1 || !(/^[a-zA-Z() ]+$/.test(name))) {
				$(".error").show();
				return false;
			}

			this.difficulty = difficulty;
			this.name = name;

			$(".popup_container").fadeOut(100);
			$("#grid").fadeIn(500, function() {
				that._change(function() {
					$(".continue").show();
				});
				
			});
		},

		/**
		 * We give a chance for the user to fully see the puzzle before we shuffle it for them. That's what the continue
		 * button is for. Once they press it, we shuffle the grid and display number of moves which is 0 in this case
		 */

		continue: function() {
			var that = this;
			$(".continue").hide();
			this._shuffle(function() {
				$(".begin").show();
				that._updateMoves();
			});
		},

		/**
		 * Checks if the current node is equal to the target node by comparing their keys
		 * which are always unique for each node in the grid.
		 */
		finished: function(node) {
			if(node.getKey() == this.targetNode.getKey()) {
				return true;
			}
			return false;
		},

		/**
		 * The hint function creates an instance of the AStar class and asks it to solve the puzzle
		 * The astar algorithm returns an array of best sequence of nodes that will lead to solve the puzzle. 
		 * In the hint function we take the first node that the algorithm returns and move the grid element. 
		 *
		 * Finally we update the score by 3 points and check if the hint was the final move needed
		 */
		hint: function() {
			var astar = new AStar(),
				result = astar.solve();

			this._moveGridItem($(".pos_" + result[0].blankIndex));
			this.moves += 3;
			this._updateMoves();
			if(this.finished(this.currentNode)) {
				this._scoreboard(true);
			}
		},

		/*
		 * This function works similar to the hint function. Once we have the full sequence, we show
		 * that to the user step by step and set the number of moves to 0. 
		 */
		giveup: function() {

			$(".loading").show();

			var astar = new AStar(),
				result = astar.solve(),
				that = this;
				
			$(".loading").hide();

			moveItem = function(index) {
				if(index <result.length) {
					var node = result[index];
						that._moveGridItem($(".pos_" + node.blankIndex));

					setTimeout(function() {
						moveItem(index + 1);

					}, 250);
				}
				else {
					that.moves = 0;
					that._scoreboard(false);
				}
			};

			moveItem(0);
		},

		/**
		 * Creates candidate nodes which are neighboring nodes (left, top, bottom and right) of the node param
		 * @param { node } Node object of class Node
		 * @return [node] Array of nodes. It can either be an array of 2,3 or 4 nodes
		 */

		getCandidateNodes: function(node) {
			var candidates = this._getCandidatesIndices(node.blankIndex),
				nodes = [];

			for(var i =0;i<candidates.length; i++) {
				var newNode = this._deriveNewNode(node, candidates[i]);
				nodes.push(newNode);
			}

			return nodes;
		},
		/**
		 * We maintain the order of a node in a 1D array, therefore we need a function to convert an index
		 * it into a 2D index. 
		 * 
		 * 
		 * @param  {[int]} index
		 * @return {[int, int]} index2d
		 */
		convertIndexto2D: function(index) {
			var i = Math.floor(index / Puzzle.size),
			j = (index) % Puzzle.size;
			return [i,j];
		},

		/**
		 * @param  {[int, int]} index2d
		 * @return {[int]} index
		 */

		convert2dToIndex: function(index2d) {
			return index2d[0] * Puzzle.size + index2d[1];
		},

		/**
		 * This function is responsible for placing the appropriate position class on the element that
		 * the user moved or selector sent by hint or giveup methods. 
		 * Position classes have top and left attributes defined in the CSS file
		 *
		 * It swaps out the position classes of the blank and the selector element
		 * and then recalculates the neighbor grid items to which the candidate node
		 * needs to be applied. 
		 * @param  {Object} selector jQuery Selector object
		 */
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
		/**
		 * Add candidate class to the neighbors of the blank grid item. The candidate class
		 * has hover effects for the user to see they can move it
		 */
		_addCandidates: function() {

			var candidates = this._getCandidatesIndices(this.currentNode.blankIndex);

			for(var i=0; i<candidates.length; i++) {

				var selector = ".pos_" + candidates[i];

				$(selector).addClass("candidate");
			}

		},

		/**
		 * Calculates all the possible neighboring indices from the blankIndex that was passed in. 
		 * It does that by using the convert2dToIndex function and analyzing which 2D indices are 1 move away
		 * @param {int} blankIndex Index of the blank Element
		 * @return [[int,int]] array of 2d indices
		 */

		_getCandidatesIndices: function(blankIndex) {

			var blank2d = this.convertIndexto2D(blankIndex),
				candidates = [];

				if(blank2d[0] + 1 < Puzzle.size) {
					candidates.push(this.convert2dToIndex([blank2d[0] + 1, blank2d[1]]));
				}
				if(blank2d[1] + 1 < Puzzle.size) {
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
		/**
		 * Get the appropiate position class of the selector
		 * @param  {Object} jQuery Selector
		 * @return string position class. prefixed by pos_(integer)
		 */
		_getPosClass: function(element) {
			var classList = $(element).attr('class').split(/\s+/);
			for(var i=0;i<classList.length; i++){
			    if (classList[i].indexOf("pos_") !== -1) {
			        return classList[i];
			    }
			}
		},
		/**
		 * Updates number of moves taken by user
		 */
		_updateMoves: function() {
			$("#moves_value").html(this.moves);
		},

		/**
		 * Change function picks a random template class and applies it to the elements
		 * of the grid one by one. 
		 * @param  {Function} callback callback is called once all elements have the class template 
		 */
		_change: function(callback) {
			$(".loading").show();
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
		/**
		 * This function is mainly used by getCandidates and _moveGridItem. It creates a new node
		 * from the node that is passed in by swapping out
		 * the blankIndex value and index of the element that was clicked/selected by astar. 
		 *
		 * Also updates the new blankIndex in the order array of the node
		 * 
		 * @param  {node} node  
		 * @param  {int} index index of the element that was clicked on in the grid
		 * @return {node}  new node that was created
		 */
		_deriveNewNode: function(node, index) {

			var newNode = $.extend(true, {}, node);

			newNode.order[node.blankIndex] = node.order[index];
			newNode.blankIndex = index;
			newNode.order[index] = 0;

			return newNode;
		},

		/**
		 * Shuffles the grid based on the diffculty level selected. 
		 *
		 * It selects a random index from one of the candidate indices and also makes sure
		 * that is not selecting the last selected index. 
		 *
		 * We multiply the difficulty level by 10 moves. Higher the difficulty, the longer it 
		 * might take for astar algorithm to calculate the best possible path. 
		 * 
		 * @param  {Function} callback called when the shuffle is done
		 */
		_shuffle: function(callback) {
			var that = this,

			startShuffle = function(index, lastRandom) {
				if(index < that.difficulty * Puzzle.shuffleMultiplier){
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
			startShuffle(0, null);	
			
		},

		/**
		 * This function routes the user to the scoreboard after we have stored their information 
		 * on the server
		 *
		 *
		 * We calculate the score by multiplying difficulty^2 by shuffle multiplier and dividing by number of moves. And
		 * since we want the score to be in 1-300, we multiply that number by 100
		 * 
		 * @param {boolean} win this boolean is used to determine what to display in the banner text
		 */

		_scoreboard: function(win) {
			
			$(".loading").show();

			var that = this,
				bannerText = "You ",
				score = (that.moves == 0) ? 0 : Math.floor(((that.difficulty * that.difficulty * Puzzle.shuffleMultiplier * 100)/that.moves));

			if(win) {
				bannerText += "Win!";
			}
			else{
				bannerText += "Lose!";
			}
			$(".banner p").html(bannerText);
			$(".banner").fadeIn(300);



			$.ajax({
			        type: "POST",
			        url: '/userscore',
			        data: {
			        	name: that.name,
			        	score: score
			        	
			        },
			        success: function() {
			        	setTimeout( function() {
			        		window.location.href = "/score";
			        	}, 2000);
			            
			        }
			});
		},
		

	};

	var puzzle = new Puzzle();
		puzzle.addEvents();
		puzzle.reset();

		window.puzzle = puzzle;

})();