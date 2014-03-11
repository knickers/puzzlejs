jQuery(function($) {
	console.log('loaded');
	var p = $('#puzzle');
	p.c = document.getElementById('puzzle').getContext('2d');
	p.i = new Image;
	
	var piece = $('<canvas class="piece"></canvas>');
	
	var resizeCanvas = function() {
		p.$.attr('width', p.$.width());
		p.$.attr('height', p.$.height());
	};
	
	var loadImage = function() {
		p.i.src = '3d-printed-lunar-base.jpg';
		p.i.onload = function() {
			console.log('canvas  width', p.$.width());
			console.log('canvas height', p.$.height());
			console.log(' image  width', p.i.width);
			console.log(' image height', p.i.height);
			// (handle, startX, startY, width, height)
			//p.c.drawImage(p.i, 0, 0, p.$.width(), p.$.height());
			// (handle, imgX,imgY, imgDX,imgDY, cnvsX,cnvsY, cnvsDX,cnvsDY)
			//p.c.drawImage(p.i, 0,0, 100,50, 0,0, 20,10);
			
			var w = p.$.width();
			var h = p.$.height();
			var dw = w / 10;
			var dh = h / 10;
			var dx = p.i.width / 10;
			var dy = p.i.height / 10;
			
			for (var x=0; x<p.i.width; x+=dx) {
				for (var y=0; y<p.i.height; y+=dy) {
					p.c.drawImage(p.i,
						x,y, dx,dy,
						Math.random()*(w - dw), Math.random()*(h - dh), dw,dh
					);
				}
			}
		};
	};
	
	p.find('.piece').on('mouseDown', function() {
		var self = $(this);
		self.addClass('dragging');
	});
	
	p.find('.piece').on('mouseMove', function() {
		var self = $(this);
	});
	
	p.find('.piece').on('mouseUp', function() {
		var self = $(this);
		self.removeClass('dragging');
		// check puzzle for new matches
	});
	
	resizeCanvas();
	loadImage();
});
