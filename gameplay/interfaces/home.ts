module HomeInterface{

	var elements = {};
	var isActive = false;
	var functionsToCallWhenPlay = [];

	export function create(){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		elements['background'] = new Render.Draw.Rectangle(0,0, sX, sY);
		elements['background'].setColor("#e6e6e6");
		elements['home_background'] = new Render.Drawable(textures['home_background'],0, 0, (0.5*sX)*(815/720), sY);
		elements['logo'] = new Render.Drawable(textures['logo'], ((0.5*sX)*(815/720))/2-(0.25*sX), 0.1*sY, 0.3*sX, (0.3*sX)/(408/254));
		elements['home_text'] = new Render.Drawable(textures['home_text'], 0.5*sX, 0.1*sY, 0.4*sX, (0.4*sX)/(604/197));
		elements['arrows'] = new Render.Drawable(textures['arrows'], 0.635*sX, 0.38*sY, 0.2*sX, (0.2*sX)/(254/141));
		elements['play_btn'] = new Render.Drawable(textures['play_btn'], 0.55*sX, 0.6*sY, 0.38*sX, (0.38*sX)/(475/210));
		elements['website_btn'] = new Render.Drawable(textures['link_btn'], 0.635*sX, 0.9*sY, 0.3*sX, (0.3*sX)/(393/75));


		var playClick = new Input.Mouse(0.55*sX, 0.6*sY, 0.38*sX, (0.38*sX)/(475/210));
		playClick.on("up", (x, y, button) => {
			doPlay();
		});

		var playTouch = new Input.Touch(0.55*sX, 0.6*sY, 0.38*sX, (0.38*sX)/(475/210));
		playTouch.on("down", (x, y) => {
			doPlay();
		});

		var websiteClick = new Input.Mouse(0.635*sX, 0.9*sY, 0.3*sX, (0.3*sX)/(393/75));
		websiteClick.on("up", (x, y, button) => {
			doWebsite();
		});

		var websiteTouch = new Input.Touch(0.635*sX, 0.9*sY, 0.3*sX, (0.3*sX)/(393/75));
		websiteTouch.on("down", (x, y) => {
			doWebsite();
		});

		var retryButton = new Input.Key(13);
		retryButton.on("up", () => {
			doPlay();
		});

		function doWebsite(){
			if(isActive){
				sounds['click'].play();
				window.open("https://www.williamdasilva.fr");
			}
		}

		function doPlay(){
			if(isActive){
				sounds['click'].play();
				for (var i = 0; i < functionsToCallWhenPlay.length; i++) {
					functionsToCallWhenPlay[i]();
				}
			}
		}
	}

	export function onPlay(functionToCall){
		functionsToCallWhenPlay.push(functionToCall);
	}

	export function hide(){
		sounds['home'].stop();

		for (var i in elements) {
			interfaceCanvas.del(elements[i]);
		}

		isActive = false;
	}

	export function show(){
		sounds['home'].play();
		for (var i in elements) {
			interfaceCanvas.set(elements[i]);
		}

		isActive = true;
	}


}