class Spike extends Elements{

	constructor(world : any){
		super(0);

		this.setType("spike");
		this.canCollideWith(null);
		this.setCentred(false);

		var drawable = new Render.Drawable(textures['spikes'], 0,0,100,100);
		this.assignDrawable(drawable);

		var shape = new p2.Box({width : 100, height : 100});
		this.addShape(shape);


		if(world){
			world.addBody(this);
		}

	}
}