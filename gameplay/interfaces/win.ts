module WinInterface{

	var elements = {};
	var isActive = false;

	export function create(){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		elements['background'] = new Render.Draw.Rectangle(0,0, sX, sY);
		elements['background'].setColor("#e6e6e6");
		elements['twitter_btn'] = new Render.Drawable(textures['twitter_btn'], 0.5*sX - (0.175*sX), 0.4*sY + (0.3*sX)/(427/130) + 10, 0.35*sX, (0.35*sX)/(535/135));

		elements['text'] = new Render.Draw.Text(0,0.4*sY - 0.1 * sY,"YOU WIN!", sX, sY);
		elements['text'].setFont("badaboom");
		elements['text'].setFontSize(50);
		elements['text'].setAlign("center");
		elements['text'].setColor("#000");

		var twitterClick = new Input.Mouse(0.5*sX - (0.175*sX), 0.4*sY + (0.3*sX)/(427/130) + 10, 0.35*sX, (0.35*sX)/(535/135));
		twitterClick.on("up", (x, y, button) => {
			doTwitter();
		});

		var twitterTouch = new Input.Touch(0.5*sX - (0.175*sX), 0.4*sY + (0.3*sX)/(427/130) + 10, 0.35*sX, (0.35*sX)/(535/135));
		twitterTouch.on("down", (x, y) => {
			doTwitter();
		});


		function doTwitter(){
			if(isActive){
				sounds['click'].play();
				var message = "Play 'My Name is RED', a game by @willia_am for the @EpicGameJam !";
				window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(message));
			}
		}
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