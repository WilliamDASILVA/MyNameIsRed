class Hitbox extends Elements{
	constructor(world : any, width : number, height : number){
		super(0);

		this.setType("hitbox");
		this.canCollideWith("player");
		this.setCentred(false);

		var shape = new p2.Box({width : width, height : height});
		this.addShape(shape);


		if(world){
			world.addBody(this);
		}

	}
}