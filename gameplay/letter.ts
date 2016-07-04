class Letter extends Elements{

	public beenTaken : boolean;
	public letter : string;

	constructor(world : any, letter : string){
		super(0);

		this.beenTaken = false;
		this.letter = letter;

		this.setType("letter");
		this.canCollideWith(null);
		this.setCentred(false);

		var drawable = new Render.Drawable(textures['letter_'+letter], 0,0,50,50);
		this.assignDrawable(drawable);
		this.setDepth(2);

		var shape = new p2.Box({width : 50, height : 50});
		this.addShape(shape);


		if(world){
			world.addBody(this);
		}
	}

	setTaked(value){
		if(value){
			this.getAssignedDrawables()[0].setOpacity(0.1);
		}
		else{
			this.getAssignedDrawables()[0].setOpacity(1);
		}
	}

	getLetter(){
		return this.letter;
	}


}