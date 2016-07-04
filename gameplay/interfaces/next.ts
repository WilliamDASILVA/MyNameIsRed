module NextInterface{

	var elements = {};
	var isActive = false;
	var functionsToCallWhenNext = [];

	export function create(){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		elements['background'] = new Render.Draw.Rectangle(0,0, sX, sY);
		elements['background'].setColor("#e6e6e6");
		elements['next_btn'] = new Render.Drawable(textures['next_btn'], 0.5*sX - (0.15*sX), 0.4*sY, 0.3*sX, (0.3*sX)/(427/130));

		elements['text'] = new Render.Draw.Text(0,0.3*sY,"Well played!", sX, 50);
		elements['text'].setFont("badaboom");
		elements['text'].setFontSize(50);
		elements['text'].setAlign("center");
		elements['text'].setColor("#000");

		var nextClick = new Input.Mouse(0.5*sX - (0.15*sX), 0.4*sY, 0.3*sX, (0.3*sX)/(427/130));
		nextClick.on("up", (x, y, button) => {
			doNext();
		});

		var nextTouch = new Input.Touch(0.5*sX - (0.15*sX), 0.4*sY, 0.3*sX, (0.3*sX)/(427/130));
		nextTouch.on("down", (x, y) => {
			doNext();
		});

		var nextButton = new Input.Key(13);
		nextButton.on("up", () => {
			doNext();
		});

		function doNext(){
			if(isActive){
				sounds['click'].play();
				for (var i = 0; i < functionsToCallWhenNext.length; i++) {
					functionsToCallWhenNext[i]();
				}
			}
		}
	}

	export function onNext(functionToCall){
		functionsToCallWhenNext.push(functionToCall);
	}

	export function hide(){
		for (var i in elements) {
			interfaceCanvas.del(elements[i]);
		}

		isActive = false;
	}

	export function show(){
		for (var i in elements) {
			interfaceCanvas.set(elements[i]);
		}

		isActive = true;
	}


}