class Player extends Elements{

	public isAlive : boolean;
	public letters : any;
	private animations : any;
	private disabledAnimation : string;

	constructor(world : any){
		super();

		this.isAlive = true;
		this.letters = {
			r : false,
			e : false,
			d : false
		};

		this.setType("player");
		this.canCollideWith("hitbox");
		this.setMass(100);
		this.setCentred(false);
		this.setFixedRotation(true);

		// Prepare animations
		this.animations = {
			idle : new Render.Sprite(textures['idle'], 0, 0, 100*(139/336), 100, 139, 336, 6),
			running : new Render.Sprite(textures['running'], 0, 0, 100*(217/358), 100, 217, 358, 16),
			jump : new Render.Sprite(textures['jump'], 0, 0, 100*(277/399), 100, 277, 399, 16)
		};

		for (var i in this.animations) {
			this.animations[i].setOffset(0,-20);
		}

		this.animations['running'].setFrameSpeed(32);
		this.animations['jump'].setFrameSpeed(32);
		this.animations['jump'].setUniqueLoop(true);

		this.setAnimation("idle");

		var shape = new p2.Box({width : 50, height : 80});
		this.addShape(shape);

		this.setDepth(1);


		if(world){
			world.addBody(this);
		}

	}

	setAnimation(animationName){
		if(this.disabledAnimation != animationName){
			this.setDrawable(this.animations[animationName]);
			if(animationName == "jump"){
				this.getAssignedDrawables()[0].playUniqueLoop();
			}
			else{

				this.getAssignedDrawables()[0].setUniqueLoop(false);
			}
		}
	}

	disableAnimation(animationName){
		this.disabledAnimation = animationName;
	}

	enableAnimation(animationName){
		this.disabledAnimation = null;
	}

	setLetter(letter){
		this.letters[letter] = true;
	}

	hasWon(){
		var won = true;
		for(var i in this.letters){
			if(!this.letters[i]){
				won = false;
			}
		}

		return won;
	}

	reset(){
		this.respawn();
		
		this.letters = {
			r : false,
			e : false,
			d : false
		};
	}


	kill(){
		this.isAlive = false;
	}

	respawn(){
		this.isAlive = true;
	}

	getLetters(){
		return this.letters;
	}

}