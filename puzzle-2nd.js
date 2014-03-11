// canvas 2d context image functions
//
//drawImage(imageHandle, canvasX, canvasY, canvasDX, canvasDY)
//drawImage(imageHandle, imgX,imgY, imgDX,imgDY, cnvsX,cnvsY, cnvsDX,cnvsDY)

jQuery(function($) {
	var p = $('.puzzle');
	p.i = new Image;
	
	var blankPiece = $('<canvas class="piece"></canvas>');
	
	var loadImage = function(fileName) {
		p.i.src = fileName;
		p.i.onload = function() {
			var w = p.width();
			var h = p.height();
			var dw = Math.round(w / 10);
			var dh = Math.round(h / 10);
			var dx = p.i.width / 10;
			var dy = p.i.height / 10;
			
			for (var x=0; x<p.i.width; x+=dx) {
				for (var y=0; y<p.i.height; y+=dy) {
					var piece = blankPiece.clone(true, true);
					
					piece.css({
						'top': Math.random() * (h - dh),
						'left': Math.random() * (w - dw),
						'width': dw,
						'height': dh
					});
					piece.attr('width', dw);
					piece.attr('height', dh);
					
					piece[0].getContext('2d')
						.drawImage(p.i, x,y, dx,dy, 0, 0, dw,dh);
					
					piece.appendTo(p);
				}
			}
		};
	};
	
	var combine = function(piece1, piece2) {
		// TODO
	};
	
	var checkPuzzle = function(piece) {
		piece = $(piece);
		$('.puzzle .piece').each(function() {
			// TODO
		});
	};
	
	$(document).on('mousedown', '.puzzle .piece', function(e) {
		var self = $(this);
		self.data('mouse', {
			dx: e.clientX - p[0].offsetLeft - parseFloat(self.css('left')),
			dy: e.clientY - p[0].offsetTop - parseFloat(self.css('top'))
		});
		self.addClass('dragging');
	});
	
	$(document).on('mousemove', '.puzzle .piece.dragging', function(e) {
		var self = $(this);
		self.css({
			'left': e.clientX - p[0].offsetLeft - self.data('mouse').dx,
			'top': e.clientY - p[0].offsetTop - self.data('mouse').dy
		});
	});
	
	$(document).on('mouseup', '.puzzle .piece', function(e) {
		var self = $(this);
		self.removeClass('dragging');
		// check puzzle for new matches
		// TODO
	});
	
	loadImage('3d-printed-lunar-base.jpg');
});
