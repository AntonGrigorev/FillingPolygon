var canvas = document.getElementById('paint');
var context = canvas.getContext('2d');

var flag = 0;
var start = 1;
var draw_poly = 0;
var x_begin, y_begin;
var points = [];
var lines = [];
var add = 0;

var maxy = 0, miny = 0;

var idata = context.getImageData(0, 0, canvas.width, canvas.height);
console.log(idata);

canvas.addEventListener("click", function(event){
	if(start == 1){
                        if (!flag) {
                                x0 = event.offsetX;
                                y0 = event.offsetY;
								points.push({x: x0, y: y0});
                                flag = 1;
								x_begin = x0;
								y_begin = y0;
                        } else {
                                x1 = event.offsetX;
                                y1 = event.offsetY;
								points.push({x: x1, y: y1});
                                drawLine(x0, y0, x1, y1);
                                flag = 0;
								start = 0;
								draw_poly = 1;
                        }
	}
	if(draw_poly == 1){
		x0 = x1;
		y0 = y1;
		x1 = event.offsetX;
        y1 = event.offsetY;
		if(add == 1){
			points.push({x: x1, y: y1});
		}
		add = 1;
        drawLine(x0, y0, x1, y1);
	}
                });

canvas.addEventListener("contextmenu", function(event){
	drawLine(x1, y1, x_begin, y_begin);
	draw_poly = 0;
	points.push({x: x_begin, y: y_begin});
	var minY = points[0].y;
	var maxY = points[0].y;
	for (var i = 0; i < points.length; i++) {
		var temp = points[i].y;
		if (temp < minY)
			minY = temp;
		else if (temp > maxY)
			maxY = temp;
	}
	
	for (var i = 1; i < points.length; i++) {
		lines.push(new Line(points[i - 1], points[i]));
	}
		
	context.strokeStyle = "#0af";
	context.beginPath();
	for (var y = minY; y < maxY; y++) {
		var meetPoint = getMeetPoint(y);
		for (var i = 1; i < meetPoint.length; i += 2) {
			context.moveTo(meetPoint[i - 1], y);
			context.lineTo(meetPoint[i], y);
		}
	}
	context.stroke();
                });
				
function getMeetPoint(y) {
    var meet = [];
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (l.isValidY(y)) {
            meet.push(l.getX(y));
        }
    }

    for (var i = 0; i < meet.length; i++)
        for (var j = i; j < meet.length; j++) {
            if (meet[i]>meet[j]) {
                var temp =meet[i];
                meet[i]=meet[j];
                meet[j]=temp;
            }
        }
    return  meet;
}
				
function Line(start, end) {
    this.x0 = start.x;
    this.x1 = end.x;
    this.y0 = start.y;
    this.y1 = end.y;
    this.m = (this.y1 - this.y0) / (this.x1 - this.x0);
    this.getX = function (y) {
        return 1 / this.m * (y - this.y0) + this.x0;
    }

    this.isValidY = function (y) {
        if (y >= this.y0 && y < this.y1) {
            return true;
        }
        if (y >= this.y1 && y < this.y0) {
            return true;
        }
	}
}

function drawLine(Xd, Yd, Xf, Yf){
			var Dx,Dy,Dx2,Dy2,Dxy,S;
			var Xinc,Yinc,X,Y;
			var col, i;
			col = 5;
			if (Xd < Xf) Xinc = 1; else Xinc = -1;
			if (Yd < Yf) Yinc = 1; else Yinc = -1;
			Dx = Math.abs(Xd - Xf);
			Dy = Math.abs(Yd - Yf);
			Dx2 = Dx + Dx; Dy2 = Dy + Dy;
			X = Xd; Y = Yd;
				if (Dx > Dy){
				S = Dy2 - Dx;
				Dxy = Dy2 - Dx2;
				for (i=0; i < Dx; i++){
					if (S >= 0){
						Y = Y + Yinc;
						S = S + Dxy;
 					} else S = S + Dy2;
					X = X + Xinc;
					context.fillRect(X,Y,1,1);
				}
			}
            else{
                S = Dx2 - Dy;
                Dxy = Dx2 - Dy2;
                for (i=0; i < Dy; i++){
                    if ( S >= 0){
                        X = X + Xinc;
                        S = S + Dxy;
                    } else S = S + Dx2;
                    Y = Y + Yinc;
                    context.fillRect(X,Y,1,1);
                }
            }
}