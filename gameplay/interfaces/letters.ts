module LettersInterface{

	var elements = {};

	export function create(){
		var screenSize = Global.getScreenSize();
		var sX = screenSize.width;
		var sY = screenSize.height;

		elements['background'] = new Render.Drawable(textures['name_background'], 0.65*sX, 0.05*sY, 0.3*sX, (0.3*sX)/(318/153));
		elements['letter_r'] = new Render.Draw.Text(0.7*sX,0.18*sY,"R", 0.1*sX, 50);
		elements['letter_r'].setFont("badaboom");
		elements['letter_r'].setFontSize(50);
		elements['letter_r'].setAlign("center");
		elements['letter_r'].setColor("#171717");
		elements['letter_e'] = new Render.Draw.Text(0.75*sX,0.18*sY,"E", 0.1*sX, 50);
		elements['letter_e'].setFont("badaboom");
		elements['letter_e'].setFontSize(50);
		elements['letter_e'].setAlign("center");
		elements['letter_e'].setColor("#171717");
		elements['letter_d'] = new Render.Draw.Text(0.8*sX,0.18*sY,"D", 0.1*sX, 50);
		elements['letter_d'].setFont("badaboom");
		elements['letter_d'].setFontSize(50);
		elements['letter_d'].setAlign("center");
		elements['letter_d'].setColor("#171717");
	}

	export function show(){
		for (var i in elements) {
			interfaceCanvas.set(elements[i]);
		}
	}

	export function hide(){
		for (var i in elements) {
			interfaceCanvas.del(elements[i]);
		}
	}

	export function letterTaken(letter){
		elements['letter_' + letter].setColor("#ed1c24");
	}

	export function reset(){
		elements['letter_r'].setColor("#ffffff");
		elements['letter_e'].setColor("#ffffff");
		elements['letter_d'].setColor("#ffffff");
	}
}