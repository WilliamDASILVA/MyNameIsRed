module CountdownInterface{

	var elements = {};
	var maxTime = 0;
	var isBeating = false;
	var currentTime = 0;
	var isActive = false;

	export function create(){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		elements['background'] = new Render.Drawable(textures['timer_background'], 0.1*sX,0.05*sY,0.4*sX, (0.4*sX)/(376/75));
		elements['brain'] = new Render.Drawable(textures['brain'], 0.05*sX,0.05*sY,0.15*sX, (0.15*sX)/(410/360));
		elements['trotter'] = new Render.Drawable(textures['timer_trotter'], 0.45*sX,0.03*sY,(0.025*sX), (0.025*sX)/(19/96));
		elements['countdown'] = new Render.Draw.Text(0.08*sX,0.08*sY,"15", 0.1*sX, 50);
		elements['countdown'].setFont("badaboom");
		elements['countdown'].setFontSize(50);
		elements['countdown'].setAlign("center");
		elements['countdown'].setColor("#FFFFFF");


		// Beating
		var beatIncrement = 0;
		Update.on(() => {
			if(isBeating && isActive){
				beatIncrement += 0.05 + ((0.0275+(0.005*maxTime)) * (maxTime - currentTime));
				if(beatIncrement >= 2*Math.PI){
					beatIncrement = 0;
					var tempSound = new Sounds.Sound("assets/sounds/timer.ogg");
					tempSound.play();
				}
				var size = ((0.05*sX) * Math.cos(beatIncrement));
				elements['brain'].setSize((0.15*sX) + size, ((0.15*sX) + size)/(410/360));
				elements['brain'].setPosition(0.05*sX - size/2, 0.04*sY - size/2);
			}
		});
	}

	export function show(){
		for (var i in elements) {
			interfaceCanvas.set(elements[i]);
		}

		isActive = true;
	}

	export function hide(){
		for (var i in elements) {
			interfaceCanvas.del(elements[i]);
		}

		isActive = false;
	}

	export function setTime(seconds : number){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		currentTime = seconds;
		elements['countdown'].setValue("" + seconds);

		var trotterPosition = elements['trotter'].getPosition();
		elements['trotter'].setPosition(0.2*sX + (((seconds*100)/maxTime) * 0.25*sX)/100, trotterPosition.y);
	}

	export function setMaxTime(seconds : number){
		maxTime = seconds;
	}

	export function setBeating(value){
		isBeating = value;
	}



}