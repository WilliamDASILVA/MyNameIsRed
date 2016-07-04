module playerBehaviour{

	var isActive = false;
	var playerElement = null;
	var keyboardEvents = {};
	var controlsEnabled = false;
	var direction = null;
	var canJump = true;
	var lastJump = 0;
	var isMoving = false;
	var isJumping = false;

	export function setActive(value){
		isActive = true;
		Update.on(() => {
			if(isActive){
				if(direction == "left"){
					moveLeft();
				}
				else if(direction == "right"){
					moveRight();
				}
			}
		});

		var soundInterval = setInterval(() => {
			if(isMoving){
				var tempSound = new Sounds.Sound("assets/sounds/running.ogg");
				tempSound.play();
			}
		}, 250);

		keyboardEvents['jump'] = new Input.Key(32); // espace
		keyboardEvents['left'] = new Input.Key(37);
		keyboardEvents['right'] = new Input.Key(39);
		keyboardEvents['up'] = new Input.Key(38);

		keyboardEvents['jump'].on("up", () => {
			if(isActive && controlsEnabled){
				doJump();
			}
		});
		keyboardEvents['up'].on("up", () => {
			if(isActive && controlsEnabled){
				doJump();
			}
		});
		keyboardEvents['left'].on("down", () => {
			if(isActive && controlsEnabled){
				direction = "left";
				playerElement.getAssignedDrawables()[0].isFlipped(true);
				playerElement.setAnimation("running");

				isMoving = true;
			}
		});
		keyboardEvents['left'].on("up", () => {
			direction = null;
			playerElement.setAnimation("idle");
			isMoving = false;
		});
		keyboardEvents['right'].on("down", () => {
			if(isActive && controlsEnabled){
				direction = "right";
				playerElement.getAssignedDrawables()[0].isFlipped(false);
				playerElement.setAnimation("running");

				isMoving = true;
			}
		});
		keyboardEvents['right'].on("up", () => {
			direction = null;
			playerElement.setAnimation("idle");
			isMoving = false;

		});
	}

	export function getPlayer(){
		return playerElement;
	}

	function doJump(){
		if(playerElement && canJump){
			if(Date.now() - lastJump > 400){
				isJumping = true;
				if(isMoving){
					playerElement.disableAnimation("running");
				}
				playerElement.setAnimation("jump");

				sounds['jump'].play();

				var velocity = playerElement.getVelocity();
				playerElement.setVelocity(velocity.x, -2000);

				setTimeout(() => {
					isJumping = false;
					playerElement.enableAnimation("running");
				}, 400);
				
				lastJump = Date.now();	
			}
		}
	}

	function moveLeft(){
		if(playerElement){
			var velocity = playerElement.getVelocity();
			playerElement.setVelocity(-700, velocity.y);
		}
	}

	function moveRight(){
		if(playerElement){
			var velocity = playerElement.getVelocity();
			playerElement.setVelocity(700, velocity.y);
		}
	}

	export function setPlayer(player){
		playerElement = player;
	}

	export function setControlsEnabled(value){
		controlsEnabled = value;
	}
}