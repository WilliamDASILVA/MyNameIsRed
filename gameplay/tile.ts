class Tile extends Elements{
	constructor(world : any){
		super(0);

		this.setType("tile");
		this.setCentred(false);

		var drawable = new Render.Drawable(textures['ground'], 0,0,100,100);
		this.assignDrawable(drawable);
		this.setDepth(2);
	}


	setRock(number){
		var drawable = new Render.Drawable(textures['rock' + number], 0,0,100,100);
		this.drawables[0] = drawable;
	}
}