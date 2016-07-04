module Maps{


	export class Download extends Events{

		private request : any;

		constructor(mapName : string){
			super();

			this.request = new Global.XHR("maps/" + mapName + "/map.json?cache=" + (Math.random() * Math.random())*100);
			this.request.ready((data) => {
				if(data.readyState == 4){
					var jsonData = JSON.parse(data.response);
					if(jsonData){
						this.emit("ready", jsonData);
					}
				}
			});
		}
	}

	export class Load extends Events{

		private data : any;
		private elements : any
		private letters : any;
		private spikes : any;
		private hitboxes : any;

		constructor(mapName){
			super();

			this.elements = [];
			this.letters = [];
			this.spikes = [];
			this.hitboxes = [];

			var mapDownload = new Maps.Download(mapName);
			mapDownload.on("ready", (data) => {
				console.log("Map downloaded");

				if(data){
					var spawnPosition = {x:0, y:0};

					this.data = data;

					// Generate map
					var size = this.getSize();
					var mapData = this.getMap();
					console.log(mapData);

					// Split the map data into multiple lines
					var lines = [];
					for (var i = 0; i < size.height; ++i) {
						var lineData = [];
						for (var k = i*size.width; k < size.width + (i*size.width); ++k) {
							lineData.push(mapData[k]);
						}
						lines.push(lineData);
					}

					// Generate map
					var tempTiles = [];
					for (var y = 0; y < lines.length; ++y) {
						for (var x = 0; x < lines[y].length; ++x) {

							// 1 => ground normal
						    // 2 => ground rock
						    // 3 => letter r
						    // 4 => letter e
						    // 5 => letter d
						    // 6 => spikes
						    // 7 => box
						    // 8 => boombox

							var element = null;
							var offset = {x:0, y:0};
						    switch (lines[y][x]) {
						    	case 1:
									element = new Tile(world);
									tempTiles.push({x : x*100, y : y*100, height : 100, width : 100, haveHitbox : false});
						    		break;
						    	case 2:
									element = new Tile(world);
									element.setRock(1);
									tempTiles.push({x : x*100, y : y*100, height : 100, width : 100, haveHitbox : false});
						    		break;
						    	case 10:
									element = new Tile(world);
									element.setRock(2);
									tempTiles.push({x : x*100, y : y*100, height : 100, width : 100, haveHitbox : false});
						    		break;
						    	case 3:
									element = new Letter(world, "r");
									this.letters.push(element);
									offset = {x:25, y:25};
						    		break;
						    	case 4:
									element = new Letter(world, "e");
									this.letters.push(element);
									offset = {x:25, y:25};
						    		break;
						    	case 5:
									element = new Letter(world, "d");
									this.letters.push(element);
									offset = {x:25, y:25};
						    		break;
						    	case 6:
									element = new Spike(world);
									this.spikes.push(element);
						    		break;
						    	case 11:
						    		spawnPosition = {x : x*100, y : y*100};
						    		break;
						    }

							if(element){
								element.setPosition(x*100 + offset.x, y*100 + offset.y);
								this.elements.push(element);
							}
						}
					}

					function getTileIndex(x, y){
						for (var z = 0; z < tempTiles.length; ++z) {
							if(tempTiles[z].x == x && tempTiles[z].y == y){
								return z;
							}
						}
					}

					// Create tiles hitboxes
					var tempHitbox = []; // Store the temporary hitboxes
					console.log(tempTiles);
					for (var i = 0; i < tempTiles.length; ++i) {
						if(!tempTiles[i].haveHitbox){

							console.log("c1");


							var have1 = false;
							var have2 = false;
							var have3 = false;

							var tile1 = tempTiles[i];

							// For each tile, calculate if there is a ?1, ?2, ?3
							for (var j = 0; j < tempTiles.length; ++j) {
								var current = tempTiles[j];

								// Check if 2
								if(tile1.x + 100 == current.x && tile1.y == current.y){
									have1 = true;
								}

								// Check if 3
								if(tile1.x == current.x && tile1.y + 100 == current.y){
									have2 = true;
								}

								// Check if 4
								if(tile1.x + 100 == current.x && tile1.y + 100 == current.y){
									have3 = true;
								}
							}

							if(have1 && have2 && have3){
								var hitbox = {
									x : tile1.x,
									y : tile1.y,
									width : 200,
									height : 200
								};

								tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
								tempTiles[getTileIndex(tile1.x + 100, tile1.y)].haveHitbox = true;
								tempTiles[getTileIndex(tile1.x, tile1.y + 100)].haveHitbox = true;
								tempTiles[getTileIndex(tile1.x + 100, tile1.y + 100)].haveHitbox = true;

								tempHitbox.push(hitbox);
							}
							else if(have1 && !have2 && !have3){
								var hitbox = {
									x : tile1.x,
									y : tile1.y,
									width : 200,
									height : 100
								};

								tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
								tempTiles[getTileIndex(tile1.x + 100, tile1.y)].haveHitbox = true;

								tempHitbox.push(hitbox);
							}
							else if(have1 && have2 && !have3){
								var hitbox = {
									x : tile1.x,
									y : tile1.y,
									width : 200,
									height : 100
								};

								tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
								tempTiles[getTileIndex(tile1.x + 100, tile1.y)].haveHitbox = true;

								tempHitbox.push(hitbox);

								var hitbox = {
									x : tile1.x,
									y : tile1.y + 100,
									width : 100,
									height : 100
								};

								tempTiles[getTileIndex(tile1.x, tile1.y + 100)].haveHitbox = true;

								tempHitbox.push(hitbox);
							}
							else if(!have1 && have2 && !have3){
								var hitbox = {
									x : tile1.x,
									y : tile1.y,
									width : 100,
									height : 200
								};
								tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
								tempTiles[getTileIndex(tile1.x, tile1.y+100)].haveHitbox = true;
								tempHitbox.push(hitbox);
							}
							else if(!have1 && !have2 && !have3){
								var hitbox = {
									x : tile1.x,
									y : tile1.y,
									width : 100,
									height : 100
								};
								tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
								tempHitbox.push(hitbox);
							}
						}
					}

					// Create the generated hitboxes
					for (var h = 0; h < tempHitbox.length; ++h) {
						var hit = new Hitbox(world, tempHitbox[h].width, tempHitbox[h].height);
						hit.setPosition(tempHitbox[h].x, tempHitbox[h].y);

						this.hitboxes.push(hit);
					}

					// Add elements to render
					for (var i = 0; i < this.elements.length; ++i) {
						mainCanvas.set(this.elements[i]);
					}

					this.emit("ready", spawnPosition, data.time);

				}
				else{
					console.log("Couldn't get map.");
				}
			});
		}

		getName(){
			return this.data.name;
		}

		getSize(){
			return this.data.size;
		}

		getMap(){
			return this.data.map[0];
		}

		getLetters(){
			return this.letters;
		}
		getSpikes(){
			return this.spikes;
		}


		destroy(){
			for (var i = 0; i < this.hitboxes.length; i++) {
				this.hitboxes[i].destroy();
			}

			for (var i = 0; i < this.spikes.length; i++) {
				mainCanvas.del(this.spikes[i]);
				this.spikes[i].destroy();
			}

			for (var i = 0; i < this.letters.length; i++) {
				mainCanvas.del(this.letters[i]);
				this.letters[i].destroy();
			}
			
			for (var i = 0; i < this.elements.length; i++) {
				if(this.elements[i]){
					mainCanvas.del(this.elements[i]);
					this.elements[i].destroy();
				}
			}

			this.elements = [];
			this.spikes = [];
			this.letters = [];
			this.hitboxes = [];

		}

	}

}