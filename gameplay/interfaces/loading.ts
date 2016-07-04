module LoadingInterface{

	var elements = {};
	var progression = 1;

	export function create(){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		elements['background'] = new Render.Draw.Rectangle(0,0, sX, sY);
		elements['background'].setColor("#e6e6e6");
		elements['loading_empty'] = new Render.Drawable(textures['loading_empty'], 0.5*sX - (0.25*sX), 0.5*sY, 0.5*sX, (0.5*sX)/(594/111));
		elements['loading_full'] = new Render.Drawable(textures['loading_full'], 0.5*sX - (0.25*sX), 0.5*sY, (progression*(0.5*sX))/100, (0.5*sX)/(594/111));
		elements['loading_full'].setCrop(0,0,(progression * 594)/100,111);

		elements['text'] = new Render.Draw.Text(0.5*sX - (0.25*sX),0.45*sY,"Loading...", 0.5*sX, 50);
		elements['text'].setFont("badaboom");
		elements['text'].setFontSize(30);
		elements['text'].setColor("#000");
	}

	export function setProgression(percent){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;

		progression = percent;
		elements['loading_full'].setSize((progression*(0.5*sX))/100, (0.5*sX)/(594/111));
		elements['loading_full'].setCrop(0,0,(progression * 594)/100,111);
	}

	export function hide(){
		for (var i in elements) {
			interfaceCanvas.del(elements[i]);
		}
	}

	export function show(){
		for (var i in elements) {
			interfaceCanvas.set(elements[i]);
		}
	}

}