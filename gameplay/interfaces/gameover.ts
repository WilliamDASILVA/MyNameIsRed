module GameoverInterface{

	var elements = {};
	var isActive = false;
	var functionsToCallWhenRetry = [];
	var currentScore = 0;

	export function create(){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		elements['background'] = new Render.Draw.Rectangle(0,0, sX, sY);
		elements['background'].setColor("#e6e6e6");
		elements['retry_btn'] = new Render.Drawable(textures['retry_btn'], 0.5*sX - (0.15*sX), 0.4*sY, 0.3*sX, (0.3*sX)/(427/130));
		elements['twitter_btn'] = new Render.Drawable(textures['twitter_btn'], 0.5*sX - (0.175*sX), 0.4*sY + (0.3*sX)/(427/130) + 10, 0.35*sX, (0.35*sX)/(535/135));

		elements['text'] = new Render.Draw.Text(0,0.4*sY - 0.1 * sY,"Score: 0 points", sX, sY);
		elements['text'].setFont("badaboom");
		elements['text'].setFontSize(50);
		elements['text'].setAlign("center");
		elements['text'].setColor("#000");


		var retryClick = new Input.Mouse(0.5*sX - (0.15*sX), 0.4*sY, 0.3*sX, (0.3*sX)/(427/130));
		retryClick.on("up", (x, y, button) => {
			doRetry();
		});

		var retryTouch = new Input.Touch(0.5*sX - (0.15*sX), 0.4*sY, 0.3*sX, (0.3*sX)/(427/130));
		retryTouch.on("down", (x, y) => {
			doRetry();
		});

		var twitterClick = new Input.Mouse(0.5*sX - (0.175*sX), 0.4*sY + (0.3*sX)/(427/130) + 10, 0.35*sX, (0.35*sX)/(535/135));
		twitterClick.on("up", (x, y, button) => {
			doTwitter();
		});

		var twitterTouch = new Input.Touch(0.5*sX - (0.175*sX), 0.4*sY + (0.3*sX)/(427/130) + 10, 0.35*sX, (0.35*sX)/(535/135));
		twitterTouch.on("down", (x, y) => {
			doTwitter();
		});

		var retryButton = new Input.Key(13);
		retryButton.on("up", () => {
			doRetry();
		});

		function doTwitter(){
			if(isActive){
				sounds['click'].play();
				var message = "I got " + currentScore + " points on 'My Name is RED', a game by @willia_am for the @EpicGameJam !";
				window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(message));
			}
		}

		function doRetry(){
			if(isActive){
				sounds['click'].play();
				for (var i = 0; i < functionsToCallWhenRetry.length; i++) {
					functionsToCallWhenRetry[i]();
				}
			}
		}
	}

	export function onRetry(functionToCall){
		functionsToCallWhenRetry.push(functionToCall);
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

	export function setScore(score){
		currentScore = score-1;
		elements['text'].setValue("Score: " + (score-1) + " points");
	}

}