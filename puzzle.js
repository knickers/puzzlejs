// canvas 2d context image functions
//
//drawImage(imageHandle, canvasX, canvasY, canvasDX, canvasDY)
//drawImage(imageHandle, imgX,imgY, imgDX,imgDY, cnvsX,cnvsY, cnvsDX,cnvsDY)

var restrict = function(x, low, high) {
	return x < low ? low : (x > high ? high : x);
};

(function($) {
	var P = null; // Puzzle
	var O = null; // Options
	var F = parseFloat;
	var group = $('<div class="puzzlejs_group"></div>').css({
		'position': 'absolute'
	});
	var blank = $('<canvas class="puzzlejs_piece"></canvas>').css({
		'top': 0,
		'left': 0,
		'cursor': 'pointer',
		'position': 'absolute',
		'box-sizing': 'border-box'
	}).on('mouseover', function() {
		$(this).parent('.puzzlejs_group').css('z-index', 9999);
	}).on('mouseout', function() {
		$(this).parent('.puzzlejs_group').css('z-index', 'inherit');
	}).on('mousedown', function(e) {
		var self = $(this).parent('.puzzlejs_group');
		self.data('mouse', {
			dx: e.clientX - P[0].offsetLeft - F(self.css('left')),
			dy: e.clientY - P[0].offsetTop - F(self.css('top'))
		});
		self.addClass('puzzlejs_dragging');
	}).on('mouseup', function(e) {
		var self = $(this);
		self.parent('.puzzlejs_group').removeClass('puzzlejs_dragging');
		// check puzzle for new matches
		checkPiece(self);
	});
	
	$.extend($.fn, {
		puzzle: function(options) {
			O = $.extend({
				difficulty: 5, // 1 - 10
				margin: 10, // allowed margin between two pieces
				xPieces: null, // overrides default difficulty x size
				yPieces: null, // overrides default difficulty y size
				imageURL: null, // string for web hosted images
				imageBlob: null // blob for localy opened images
			}, options);
			
			O.difficulty = restrict(O.difficulty, 1, 10);
			O.xPieces = O.xPieces || O.difficulty * 2;
			O.yPieces = O.yPieces || O.difficulty * 2;
			
			P = $(this);
			P.i = new Image;
			P.$ = $('<div class="puzzlejs_puzzle"></div>').css({
				'width': '100%',
				'height': '100%',
				'display': 'inline-block',
				'position': 'relative',
				'box-sizing': 'border-box'
			}).on('mousemove', function(e) {
				var self = P.$.find('.puzzlejs_group.puzzlejs_dragging')
					.first();
				if (self.length) {
					self.css({
						'top': e.clientY-P[0].offsetTop-self.data('mouse').dy,
						'left': e.clientX-P[0].offsetLeft-self.data('mouse').dx
					});
				}
			});
			P.append(P.$);
			
			function setImage(image) {
				// TODO delete the old image and canvas elements
				P.i.src = image;
				P.i.onload = createPuzzle;
			};
			
			setImage(O.imageURL || O.imageBlob || '');
		}
	});
	
	var createPuzzle = function() {
		// Change the puzzle aspect ratio to match the image
		var imageAspect = P.i.width / P.i.height;
		var puzzleAspect = P.$.width() / P.$.height();
		if (imageAspect > puzzleAspect) {
			P.$.css('height', imageAspect * P.$.width());
		} else {
			P.$.css('width', imageAspect * P.$.height());
		}
		
		O.w = P.$.width();                  // puzzle width
		O.h = P.$.height();                 // puzzle height
		O.dw = Math.round(O.w / O.xPieces); // html piece width
		O.dh = Math.round(O.h / O.yPieces); // html piece height
		O.dx = P.i.width / O.xPieces;       // image piece width
		O.dy = P.i.height / O.yPieces;      // image piece height
		
		for (var x=0; x<O.xPieces; x++) {
			for (var y=0; y<O.yPieces; y++) {
				var piece = group.clone(true, true).css({
						'top': Math.random() * (O.h - O.dh),
						'left': Math.random() * (O.w - O.dw),
						'width': O.dw,
						'height': O.dh
					}).append(
						blank.clone(true, true).css({
							'width': O.dw,
							'height': O.dh
						}).attr({ // canvas uses these to render its images
							'width': O.dw,
							'height': O.dh
						}).data('pos', { // this piece's position in the puzzle
							'x': x,
							'y': y
						})
					);
				
				piece.find('.puzzlejs_piece')[0].getContext('2d')
					.drawImage(P.i, x*O.dx,y*O.dy, O.dx,O.dy, 0, 0, O.dw,O.dh);
				
				if (Math.round(Math.random())) {
					piece.appendTo(P.$);
				} else {
					piece.prependTo(P.$);
				}
			}
		}
	};
	
	var checkPuzzle = function() {
		var gs = P.$.find('.puzzlejs_group');
		if (gs.length == 1) {
			P.$.append($(P.i).css('width', '100%'));
			gs.remove();
		}
	};
	
	var checkPiece = function(piece) {
		if (P.$.find('.puzzlejs_group').length <= 1) {
			checkPuzzle();
			return false;
		}
		piece = $(piece);
		var M = O.margin;
		var G = piece.parent('.puzzlejs_group');
		var X = piece.data('pos').x;
		var Y = piece.data('pos').y;
		var L = F(G.css('left')) + F(piece.css('left'));
		var R = F(piece.css('width')) + L;
		var T = F(G.css('top')) + F(piece.css('top'));
		var B = F(piece.css('height')) + T;
		//console.log('X:' + X, 'Y:' + Y, L, R, T, B);
		var ret = false;
		G.siblings('.puzzlejs_group').each(function(i, g) {
			if (ret) {
				return false;
			}
			g = $(g);
			var gl = F(g.css('left'));
			var gt = F(g.css('top'));
			g.find('.puzzlejs_piece').each(function(j, p) {
				p = $(p);
				var x = p.data('pos').x;
				var y = p.data('pos').y;
				if ((X === x + 1 && Y === y) || // left
					(X === x - 1 && Y === y) || // right
					(Y === y + 1 && X === x) || // above
					(Y === y - 1 && X === x)    // below
				) {
					//console.log('neighbor', p);
					var l = gl + F(p.css('left'));
					var r = O.dw + l;
					var t = gt + F(p.css('top'));
					var b = O.dh + t;
					//console.log('x:' + x, 'y:' + y, l, r, t, b);
					if ((L < r+M && L > r-M && T < t+M && T > t-M) || // left
						(R < l+M && R > l-M && T < t+M && T > t-M) || // right
						(L < l+M && L > l-M && T < b+M && T > b-M) || // above
						(L < l+M && L > l-M && B < t+M && B > t-M)    // below
					) {
						combine(G, g);
						ret = true;
						return false;
					}
				}
			});
		});
		if (P.$.find('.puzzlejs_group').length <= 1) {
			checkPuzzle();
			return false;
		}
	};
	
	var combine = function(g1, g2) {
		//console.log('HOOORRRAAAAYYYYYY!!!!!');
		
		// Set the top, left, width and height of the combined group
		$([ ['left', 'width'], ['top', 'height'] ]).each(function(i, k) {
			var v1 = F(g1.css(k[0]));
			var v2 = F(g2.css(k[0]));
			if (v2 < v1) {
				g1.css(k[0], v2);
			}
			v2 += F(g2.css(k[1]));
			if (v2 > v1 + F(g1.css(k[1]))) {
				g1.css(k[1], v2 - v1);
			}
		});
		
		var pieces = $(g1).find('.puzzlejs_piece')
			.add($(g2).find('.puzzlejs_piece'));
		
		if (g1.data('min') == undefined) {
			g1.data('min', {});
		}
		pieces.each(function(i, p) {
			p = $(p);
			if (g1.data('min').x == undefined ||
				g1.data('min').x > p.data('pos').x
			) {
				g1.data('min').x = p.data('pos').x;
			}
			if (g1.data('min').y == undefined ||
				g1.data('min').y > p.data('pos').y
			) {
				g1.data('min').y = p.data('pos').y;
			}
		});
		
		var l = F(g1.css('left'));
		var t = F(g1.css('top'));
		pieces.each(function(i, p) {
			p = $(p);
			g1.append(p.css({
				'left': (p.data('pos').x - g1.data('min').x) * O.dw,
				'top': (p.data('pos').y - g1.data('min').y) * O.dh
			}));
		});
		g2.remove();
	};
}(jQuery));
