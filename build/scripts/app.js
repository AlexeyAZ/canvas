/*global $*/

var app = {

	load: function () {
		app.events();
	},

	events: function () {
		var BODY = document.body;
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
		var timer;
		var currentFrame;
		var moveStatus = [];

		var rectOptions = {
			left: 100,
			top: 100,
			width: 50,
			height: 50
		};

		canvas.addEventListener("click", function (e) {
			currentFrame = -1;
			var mousePos = getClickCoords(canvas, e);
			var revert;

			if (mousePos.x < rectOptions.left || mousePos.y < rectOptions.top) {
				revert = true;
			} else {
				revert = false;
			}

			if (moveStatus.length) {
				clearInterval(timer);
				drawRect({ left: moveStatus[moveStatus.length - 1][0], top: moveStatus[moveStatus.length - 1][1], width: rectOptions.width, height: rectOptions.height });
				moveRect(mousePos.x, mousePos.y, revert);
			} else {
				moveRect(mousePos.x, mousePos.y, revert);
			}
			draw();
		});

		function getClickCoords(canvas, event) {
			var rect = canvas.getBoundingClientRect();

			return {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};
		}

		window.addEventListener("resize", resizeCanvas);

		function resizeCanvas() {
			canvas.height = "400";
			canvas.width = document.querySelector(".canvas__wrap").clientWidth;

			draw();
		}
		resizeCanvas();

		function draw() {
			context.clearRect(0, 0, canvas.width, canvas.height);

			drawRect(rectOptions);
		}

		function drawRect(options) {
			context.fillRect(options.left, options.top, options.width, options.height);
		}

		function moveRect(x, y, revert) {
			var maxValueX = Math.max(rectOptions.left + rectOptions.width / 2, x);
			var minValueX = Math.min(rectOptions.left + rectOptions.width / 2, x);

			var maxValueY = Math.max(rectOptions.top + rectOptions.height / 2, y);
			var minValueY = Math.min(rectOptions.top + rectOptions.height / 2, y);

			var pathLength = Math.sqrt(Math.pow(maxValueY - minValueY, 2) + Math.pow(maxValueX - minValueX, 2));

			var coef = 100;
			var points = [];
			for (var j = 1; j <= coef; j++) {
				var kLength = pathLength / coef * j;
				var k = kLength / pathLength;
				var kX = minValueX + (maxValueX - minValueX) * k;
				var kY = minValueY + (maxValueY - minValueY) * k;

				points.push([kX, kY]);
			}

			if (revert === true) {
				var points1 = [];
				for (var i = points.length - 1; i > 0; i--) {
					points1.push(points[i]);
				}
				points = points1;
			}

			function move() {
				currentFrame++;

				rectOptions.left = points[currentFrame][0] - rectOptions.width / 2;
				rectOptions.top = points[currentFrame][1] - rectOptions.height / 2;

				draw();

				if (currentFrame < points.length) {
					moveStatus.push([points[currentFrame][0], points[currentFrame][1]]);
					timer = setTimeout(move, 1000 / 60);
				} else {
					clearInterval(timer);
					moveStatus = [];
				}
			}

			move();
		}

		window.addEventListener("keydown", keyDownHandler);

		function keyDownHandler(event) {
			var key = event.which;

			if (key === 83) {
				rectOptions.top += 1;
			}

			draw();
		}
	}
};

window.addEventListener("load", app.load);
//# sourceMappingURL=app.js.map
