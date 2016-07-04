var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(world) {
        _super.call(this);
        this.isAlive = true;
        this.letters = {
            r: false,
            e: false,
            d: false
        };
        this.setType("player");
        this.canCollideWith("hitbox");
        this.setMass(100);
        this.setCentred(false);
        this.setFixedRotation(true);
        // Prepare animations
        this.animations = {
            idle: new Render.Sprite(textures['idle'], 0, 0, 100 * (139 / 336), 100, 139, 336, 6),
            running: new Render.Sprite(textures['running'], 0, 0, 100 * (217 / 358), 100, 217, 358, 16),
            jump: new Render.Sprite(textures['jump'], 0, 0, 100 * (277 / 399), 100, 277, 399, 16)
        };
        for (var i in this.animations) {
            this.animations[i].setOffset(0, -20);
        }
        this.animations['running'].setFrameSpeed(32);
        this.animations['jump'].setFrameSpeed(32);
        this.animations['jump'].setUniqueLoop(true);
        this.setAnimation("idle");
        var shape = new p2.Box({ width: 50, height: 80 });
        this.addShape(shape);
        this.setDepth(1);
        if (world) {
            world.addBody(this);
        }
    }
    Player.prototype.setAnimation = function (animationName) {
        if (this.disabledAnimation != animationName) {
            this.setDrawable(this.animations[animationName]);
            if (animationName == "jump") {
                this.getAssignedDrawables()[0].playUniqueLoop();
            }
            else {
                this.getAssignedDrawables()[0].setUniqueLoop(false);
            }
        }
    };
    Player.prototype.disableAnimation = function (animationName) {
        this.disabledAnimation = animationName;
    };
    Player.prototype.enableAnimation = function (animationName) {
        this.disabledAnimation = null;
    };
    Player.prototype.setLetter = function (letter) {
        this.letters[letter] = true;
    };
    Player.prototype.hasWon = function () {
        var won = true;
        for (var i in this.letters) {
            if (!this.letters[i]) {
                won = false;
            }
        }
        return won;
    };
    Player.prototype.reset = function () {
        this.respawn();
        this.letters = {
            r: false,
            e: false,
            d: false
        };
    };
    Player.prototype.kill = function () {
        this.isAlive = false;
    };
    Player.prototype.respawn = function () {
        this.isAlive = true;
    };
    Player.prototype.getLetters = function () {
        return this.letters;
    };
    return Player;
}(Elements));
var Letter = (function (_super) {
    __extends(Letter, _super);
    function Letter(world, letter) {
        _super.call(this, 0);
        this.beenTaken = false;
        this.letter = letter;
        this.setType("letter");
        this.canCollideWith(null);
        this.setCentred(false);
        var drawable = new Render.Drawable(textures['letter_' + letter], 0, 0, 50, 50);
        this.assignDrawable(drawable);
        this.setDepth(2);
        var shape = new p2.Box({ width: 50, height: 50 });
        this.addShape(shape);
        if (world) {
            world.addBody(this);
        }
    }
    Letter.prototype.setTaked = function (value) {
        if (value) {
            this.getAssignedDrawables()[0].setOpacity(0.1);
        }
        else {
            this.getAssignedDrawables()[0].setOpacity(1);
        }
    };
    Letter.prototype.getLetter = function () {
        return this.letter;
    };
    return Letter;
}(Elements));
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(world) {
        _super.call(this, 0);
        this.setType("tile");
        this.setCentred(false);
        var drawable = new Render.Drawable(textures['ground'], 0, 0, 100, 100);
        this.assignDrawable(drawable);
        this.setDepth(2);
    }
    Tile.prototype.setRock = function (number) {
        var drawable = new Render.Drawable(textures['rock' + number], 0, 0, 100, 100);
        this.drawables[0] = drawable;
    };
    return Tile;
}(Elements));
var Hitbox = (function (_super) {
    __extends(Hitbox, _super);
    function Hitbox(world, width, height) {
        _super.call(this, 0);
        this.setType("hitbox");
        this.canCollideWith("player");
        this.setCentred(false);
        var shape = new p2.Box({ width: width, height: height });
        this.addShape(shape);
        if (world) {
            world.addBody(this);
        }
    }
    return Hitbox;
}(Elements));
var Maps;
(function (Maps) {
    var Download = (function (_super) {
        __extends(Download, _super);
        function Download(mapName) {
            var _this = this;
            _super.call(this);
            this.request = new Global.XHR("maps/" + mapName + "/map.json?cache=" + (Math.random() * Math.random()) * 100);
            this.request.ready(function (data) {
                if (data.readyState == 4) {
                    var jsonData = JSON.parse(data.response);
                    if (jsonData) {
                        _this.emit("ready", jsonData);
                    }
                }
            });
        }
        return Download;
    }(Events));
    Maps.Download = Download;
    var Load = (function (_super) {
        __extends(Load, _super);
        function Load(mapName) {
            var _this = this;
            _super.call(this);
            this.elements = [];
            this.letters = [];
            this.spikes = [];
            this.hitboxes = [];
            var mapDownload = new Maps.Download(mapName);
            mapDownload.on("ready", function (data) {
                console.log("Map downloaded");
                if (data) {
                    var spawnPosition = { x: 0, y: 0 };
                    _this.data = data;
                    // Generate map
                    var size = _this.getSize();
                    var mapData = _this.getMap();
                    console.log(mapData);
                    // Split the map data into multiple lines
                    var lines = [];
                    for (var i = 0; i < size.height; ++i) {
                        var lineData = [];
                        for (var k = i * size.width; k < size.width + (i * size.width); ++k) {
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
                            var offset = { x: 0, y: 0 };
                            switch (lines[y][x]) {
                                case 1:
                                    element = new Tile(world);
                                    tempTiles.push({ x: x * 100, y: y * 100, height: 100, width: 100, haveHitbox: false });
                                    break;
                                case 2:
                                    element = new Tile(world);
                                    element.setRock(1);
                                    tempTiles.push({ x: x * 100, y: y * 100, height: 100, width: 100, haveHitbox: false });
                                    break;
                                case 10:
                                    element = new Tile(world);
                                    element.setRock(2);
                                    tempTiles.push({ x: x * 100, y: y * 100, height: 100, width: 100, haveHitbox: false });
                                    break;
                                case 3:
                                    element = new Letter(world, "r");
                                    _this.letters.push(element);
                                    offset = { x: 25, y: 25 };
                                    break;
                                case 4:
                                    element = new Letter(world, "e");
                                    _this.letters.push(element);
                                    offset = { x: 25, y: 25 };
                                    break;
                                case 5:
                                    element = new Letter(world, "d");
                                    _this.letters.push(element);
                                    offset = { x: 25, y: 25 };
                                    break;
                                case 6:
                                    element = new Spike(world);
                                    _this.spikes.push(element);
                                    break;
                                case 11:
                                    spawnPosition = { x: x * 100, y: y * 100 };
                                    break;
                            }
                            if (element) {
                                element.setPosition(x * 100 + offset.x, y * 100 + offset.y);
                                _this.elements.push(element);
                            }
                        }
                    }
                    function getTileIndex(x, y) {
                        for (var z = 0; z < tempTiles.length; ++z) {
                            if (tempTiles[z].x == x && tempTiles[z].y == y) {
                                return z;
                            }
                        }
                    }
                    // Create tiles hitboxes
                    var tempHitbox = []; // Store the temporary hitboxes
                    console.log(tempTiles);
                    for (var i = 0; i < tempTiles.length; ++i) {
                        if (!tempTiles[i].haveHitbox) {
                            console.log("c1");
                            var have1 = false;
                            var have2 = false;
                            var have3 = false;
                            var tile1 = tempTiles[i];
                            // For each tile, calculate if there is a ?1, ?2, ?3
                            for (var j = 0; j < tempTiles.length; ++j) {
                                var current = tempTiles[j];
                                // Check if 2
                                if (tile1.x + 100 == current.x && tile1.y == current.y) {
                                    have1 = true;
                                }
                                // Check if 3
                                if (tile1.x == current.x && tile1.y + 100 == current.y) {
                                    have2 = true;
                                }
                                // Check if 4
                                if (tile1.x + 100 == current.x && tile1.y + 100 == current.y) {
                                    have3 = true;
                                }
                            }
                            if (have1 && have2 && have3) {
                                var hitbox = {
                                    x: tile1.x,
                                    y: tile1.y,
                                    width: 200,
                                    height: 200
                                };
                                tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
                                tempTiles[getTileIndex(tile1.x + 100, tile1.y)].haveHitbox = true;
                                tempTiles[getTileIndex(tile1.x, tile1.y + 100)].haveHitbox = true;
                                tempTiles[getTileIndex(tile1.x + 100, tile1.y + 100)].haveHitbox = true;
                                tempHitbox.push(hitbox);
                            }
                            else if (have1 && !have2 && !have3) {
                                var hitbox = {
                                    x: tile1.x,
                                    y: tile1.y,
                                    width: 200,
                                    height: 100
                                };
                                tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
                                tempTiles[getTileIndex(tile1.x + 100, tile1.y)].haveHitbox = true;
                                tempHitbox.push(hitbox);
                            }
                            else if (have1 && have2 && !have3) {
                                var hitbox = {
                                    x: tile1.x,
                                    y: tile1.y,
                                    width: 200,
                                    height: 100
                                };
                                tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
                                tempTiles[getTileIndex(tile1.x + 100, tile1.y)].haveHitbox = true;
                                tempHitbox.push(hitbox);
                                var hitbox = {
                                    x: tile1.x,
                                    y: tile1.y + 100,
                                    width: 100,
                                    height: 100
                                };
                                tempTiles[getTileIndex(tile1.x, tile1.y + 100)].haveHitbox = true;
                                tempHitbox.push(hitbox);
                            }
                            else if (!have1 && have2 && !have3) {
                                var hitbox = {
                                    x: tile1.x,
                                    y: tile1.y,
                                    width: 100,
                                    height: 200
                                };
                                tempTiles[getTileIndex(tile1.x, tile1.y)].haveHitbox = true;
                                tempTiles[getTileIndex(tile1.x, tile1.y + 100)].haveHitbox = true;
                                tempHitbox.push(hitbox);
                            }
                            else if (!have1 && !have2 && !have3) {
                                var hitbox = {
                                    x: tile1.x,
                                    y: tile1.y,
                                    width: 100,
                                    height: 100
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
                        _this.hitboxes.push(hit);
                    }
                    // Add elements to render
                    for (var i = 0; i < _this.elements.length; ++i) {
                        mainCanvas.set(_this.elements[i]);
                    }
                    _this.emit("ready", spawnPosition, data.time);
                }
                else {
                    console.log("Couldn't get map.");
                }
            });
        }
        Load.prototype.getName = function () {
            return this.data.name;
        };
        Load.prototype.getSize = function () {
            return this.data.size;
        };
        Load.prototype.getMap = function () {
            return this.data.map[0];
        };
        Load.prototype.getLetters = function () {
            return this.letters;
        };
        Load.prototype.getSpikes = function () {
            return this.spikes;
        };
        Load.prototype.destroy = function () {
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
                if (this.elements[i]) {
                    mainCanvas.del(this.elements[i]);
                    this.elements[i].destroy();
                }
            }
            this.elements = [];
            this.spikes = [];
            this.letters = [];
            this.hitboxes = [];
        };
        return Load;
    }(Events));
    Maps.Load = Load;
})(Maps || (Maps = {}));
var Spike = (function (_super) {
    __extends(Spike, _super);
    function Spike(world) {
        _super.call(this, 0);
        this.setType("spike");
        this.canCollideWith(null);
        this.setCentred(false);
        var drawable = new Render.Drawable(textures['spikes'], 0, 0, 100, 100);
        this.assignDrawable(drawable);
        var shape = new p2.Box({ width: 100, height: 100 });
        this.addShape(shape);
        if (world) {
            world.addBody(this);
        }
    }
    return Spike;
}(Elements));
var playerBehaviour;
(function (playerBehaviour) {
    var isActive = false;
    var playerElement = null;
    var keyboardEvents = {};
    var controlsEnabled = false;
    var direction = null;
    var canJump = true;
    var lastJump = 0;
    var isMoving = false;
    var isJumping = false;
    function setActive(value) {
        isActive = true;
        Update.on(function () {
            if (isActive) {
                if (direction == "left") {
                    moveLeft();
                }
                else if (direction == "right") {
                    moveRight();
                }
            }
        });
        var soundInterval = setInterval(function () {
            if (isMoving) {
                var tempSound = new Sounds.Sound("assets/sounds/running.ogg");
                tempSound.play();
            }
        }, 250);
        keyboardEvents['jump'] = new Input.Key(32); // espace
        keyboardEvents['left'] = new Input.Key(37);
        keyboardEvents['right'] = new Input.Key(39);
        keyboardEvents['up'] = new Input.Key(38);
        keyboardEvents['jump'].on("up", function () {
            if (isActive && controlsEnabled) {
                doJump();
            }
        });
        keyboardEvents['up'].on("up", function () {
            if (isActive && controlsEnabled) {
                doJump();
            }
        });
        keyboardEvents['left'].on("down", function () {
            if (isActive && controlsEnabled) {
                direction = "left";
                playerElement.getAssignedDrawables()[0].isFlipped(true);
                playerElement.setAnimation("running");
                isMoving = true;
            }
        });
        keyboardEvents['left'].on("up", function () {
            direction = null;
            playerElement.setAnimation("idle");
            isMoving = false;
        });
        keyboardEvents['right'].on("down", function () {
            if (isActive && controlsEnabled) {
                direction = "right";
                playerElement.getAssignedDrawables()[0].isFlipped(false);
                playerElement.setAnimation("running");
                isMoving = true;
            }
        });
        keyboardEvents['right'].on("up", function () {
            direction = null;
            playerElement.setAnimation("idle");
            isMoving = false;
        });
    }
    playerBehaviour.setActive = setActive;
    function getPlayer() {
        return playerElement;
    }
    playerBehaviour.getPlayer = getPlayer;
    function doJump() {
        if (playerElement && canJump) {
            if (Date.now() - lastJump > 400) {
                isJumping = true;
                if (isMoving) {
                    playerElement.disableAnimation("running");
                }
                playerElement.setAnimation("jump");
                sounds['jump'].play();
                var velocity = playerElement.getVelocity();
                playerElement.setVelocity(velocity.x, -2000);
                setTimeout(function () {
                    isJumping = false;
                    playerElement.enableAnimation("running");
                }, 400);
                lastJump = Date.now();
            }
        }
    }
    function moveLeft() {
        if (playerElement) {
            var velocity = playerElement.getVelocity();
            playerElement.setVelocity(-700, velocity.y);
        }
    }
    function moveRight() {
        if (playerElement) {
            var velocity = playerElement.getVelocity();
            playerElement.setVelocity(700, velocity.y);
        }
    }
    function setPlayer(player) {
        playerElement = player;
    }
    playerBehaviour.setPlayer = setPlayer;
    function setControlsEnabled(value) {
        controlsEnabled = value;
    }
    playerBehaviour.setControlsEnabled = setControlsEnabled;
})(playerBehaviour || (playerBehaviour = {}));
var CountdownInterface;
(function (CountdownInterface) {
    var elements = {};
    var maxTime = 0;
    var isBeating = false;
    var currentTime = 0;
    var isActive = false;
    function create() {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        elements['background'] = new Render.Drawable(textures['timer_background'], 0.1 * sX, 0.05 * sY, 0.4 * sX, (0.4 * sX) / (376 / 75));
        elements['brain'] = new Render.Drawable(textures['brain'], 0.05 * sX, 0.05 * sY, 0.15 * sX, (0.15 * sX) / (410 / 360));
        elements['trotter'] = new Render.Drawable(textures['timer_trotter'], 0.45 * sX, 0.03 * sY, (0.025 * sX), (0.025 * sX) / (19 / 96));
        elements['countdown'] = new Render.Draw.Text(0.08 * sX, 0.08 * sY, "15", 0.1 * sX, 50);
        elements['countdown'].setFont("badaboom");
        elements['countdown'].setFontSize(50);
        elements['countdown'].setAlign("center");
        elements['countdown'].setColor("#FFFFFF");
        // Beating
        var beatIncrement = 0;
        Update.on(function () {
            if (isBeating && isActive) {
                beatIncrement += 0.05 + ((0.0275 + (0.005 * maxTime)) * (maxTime - currentTime));
                if (beatIncrement >= 2 * Math.PI) {
                    beatIncrement = 0;
                    var tempSound = new Sounds.Sound("assets/sounds/timer.ogg");
                    tempSound.play();
                }
                var size = ((0.05 * sX) * Math.cos(beatIncrement));
                elements['brain'].setSize((0.15 * sX) + size, ((0.15 * sX) + size) / (410 / 360));
                elements['brain'].setPosition(0.05 * sX - size / 2, 0.04 * sY - size / 2);
            }
        });
    }
    CountdownInterface.create = create;
    function show() {
        for (var i in elements) {
            interfaceCanvas.set(elements[i]);
        }
        isActive = true;
    }
    CountdownInterface.show = show;
    function hide() {
        for (var i in elements) {
            interfaceCanvas.del(elements[i]);
        }
        isActive = false;
    }
    CountdownInterface.hide = hide;
    function setTime(seconds) {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        currentTime = seconds;
        elements['countdown'].setValue("" + seconds);
        var trotterPosition = elements['trotter'].getPosition();
        elements['trotter'].setPosition(0.2 * sX + (((seconds * 100) / maxTime) * 0.25 * sX) / 100, trotterPosition.y);
    }
    CountdownInterface.setTime = setTime;
    function setMaxTime(seconds) {
        maxTime = seconds;
    }
    CountdownInterface.setMaxTime = setMaxTime;
    function setBeating(value) {
        isBeating = value;
    }
    CountdownInterface.setBeating = setBeating;
})(CountdownInterface || (CountdownInterface = {}));
var LettersInterface;
(function (LettersInterface) {
    var elements = {};
    function create() {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        elements['background'] = new Render.Drawable(textures['name_background'], 0.65 * sX, 0.05 * sY, 0.3 * sX, (0.3 * sX) / (318 / 153));
        elements['letter_r'] = new Render.Draw.Text(0.7 * sX, 0.18 * sY, "R", 0.1 * sX, 50);
        elements['letter_r'].setFont("badaboom");
        elements['letter_r'].setFontSize(50);
        elements['letter_r'].setAlign("center");
        elements['letter_r'].setColor("#171717");
        elements['letter_e'] = new Render.Draw.Text(0.75 * sX, 0.18 * sY, "E", 0.1 * sX, 50);
        elements['letter_e'].setFont("badaboom");
        elements['letter_e'].setFontSize(50);
        elements['letter_e'].setAlign("center");
        elements['letter_e'].setColor("#171717");
        elements['letter_d'] = new Render.Draw.Text(0.8 * sX, 0.18 * sY, "D", 0.1 * sX, 50);
        elements['letter_d'].setFont("badaboom");
        elements['letter_d'].setFontSize(50);
        elements['letter_d'].setAlign("center");
        elements['letter_d'].setColor("#171717");
    }
    LettersInterface.create = create;
    function show() {
        for (var i in elements) {
            interfaceCanvas.set(elements[i]);
        }
    }
    LettersInterface.show = show;
    function hide() {
        for (var i in elements) {
            interfaceCanvas.del(elements[i]);
        }
    }
    LettersInterface.hide = hide;
    function letterTaken(letter) {
        elements['letter_' + letter].setColor("#ed1c24");
    }
    LettersInterface.letterTaken = letterTaken;
    function reset() {
        elements['letter_r'].setColor("#ffffff");
        elements['letter_e'].setColor("#ffffff");
        elements['letter_d'].setColor("#ffffff");
    }
    LettersInterface.reset = reset;
})(LettersInterface || (LettersInterface = {}));
var LoadingInterface;
(function (LoadingInterface) {
    var elements = {};
    var progression = 1;
    function create() {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        elements['background'] = new Render.Draw.Rectangle(0, 0, sX, sY);
        elements['background'].setColor("#e6e6e6");
        elements['loading_empty'] = new Render.Drawable(textures['loading_empty'], 0.5 * sX - (0.25 * sX), 0.5 * sY, 0.5 * sX, (0.5 * sX) / (594 / 111));
        elements['loading_full'] = new Render.Drawable(textures['loading_full'], 0.5 * sX - (0.25 * sX), 0.5 * sY, (progression * (0.5 * sX)) / 100, (0.5 * sX) / (594 / 111));
        elements['loading_full'].setCrop(0, 0, (progression * 594) / 100, 111);
        elements['text'] = new Render.Draw.Text(0.5 * sX - (0.25 * sX), 0.45 * sY, "Loading...", 0.5 * sX, 50);
        elements['text'].setFont("badaboom");
        elements['text'].setFontSize(30);
        elements['text'].setColor("#000");
    }
    LoadingInterface.create = create;
    function setProgression(percent) {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        progression = percent;
        elements['loading_full'].setSize((progression * (0.5 * sX)) / 100, (0.5 * sX) / (594 / 111));
        elements['loading_full'].setCrop(0, 0, (progression * 594) / 100, 111);
    }
    LoadingInterface.setProgression = setProgression;
    function hide() {
        for (var i in elements) {
            interfaceCanvas.del(elements[i]);
        }
    }
    LoadingInterface.hide = hide;
    function show() {
        for (var i in elements) {
            interfaceCanvas.set(elements[i]);
        }
    }
    LoadingInterface.show = show;
})(LoadingInterface || (LoadingInterface = {}));
var GameoverInterface;
(function (GameoverInterface) {
    var elements = {};
    var isActive = false;
    var functionsToCallWhenRetry = [];
    var currentScore = 0;
    function create() {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        elements['background'] = new Render.Draw.Rectangle(0, 0, sX, sY);
        elements['background'].setColor("#e6e6e6");
        elements['retry_btn'] = new Render.Drawable(textures['retry_btn'], 0.5 * sX - (0.15 * sX), 0.4 * sY, 0.3 * sX, (0.3 * sX) / (427 / 130));
        elements['twitter_btn'] = new Render.Drawable(textures['twitter_btn'], 0.5 * sX - (0.175 * sX), 0.4 * sY + (0.3 * sX) / (427 / 130) + 10, 0.35 * sX, (0.35 * sX) / (535 / 135));
        elements['text'] = new Render.Draw.Text(0, 0.4 * sY - 0.1 * sY, "Score: 0 points", sX, sY);
        elements['text'].setFont("badaboom");
        elements['text'].setFontSize(50);
        elements['text'].setAlign("center");
        elements['text'].setColor("#000");
        var retryClick = new Input.Mouse(0.5 * sX - (0.15 * sX), 0.4 * sY, 0.3 * sX, (0.3 * sX) / (427 / 130));
        retryClick.on("up", function (x, y, button) {
            doRetry();
        });
        var retryTouch = new Input.Touch(0.5 * sX - (0.15 * sX), 0.4 * sY, 0.3 * sX, (0.3 * sX) / (427 / 130));
        retryTouch.on("down", function (x, y) {
            doRetry();
        });
        var twitterClick = new Input.Mouse(0.5 * sX - (0.175 * sX), 0.4 * sY + (0.3 * sX) / (427 / 130) + 10, 0.35 * sX, (0.35 * sX) / (535 / 135));
        twitterClick.on("up", function (x, y, button) {
            doTwitter();
        });
        var twitterTouch = new Input.Touch(0.5 * sX - (0.175 * sX), 0.4 * sY + (0.3 * sX) / (427 / 130) + 10, 0.35 * sX, (0.35 * sX) / (535 / 135));
        twitterTouch.on("down", function (x, y) {
            doTwitter();
        });
        var retryButton = new Input.Key(13);
        retryButton.on("up", function () {
            doRetry();
        });
        function doTwitter() {
            if (isActive) {
                sounds['click'].play();
                var message = "I got " + currentScore + " points on 'My Name is RED', a game by @willia_am for the @EpicGameJam !";
                window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(message));
            }
        }
        function doRetry() {
            if (isActive) {
                sounds['click'].play();
                for (var i = 0; i < functionsToCallWhenRetry.length; i++) {
                    functionsToCallWhenRetry[i]();
                }
            }
        }
    }
    GameoverInterface.create = create;
    function onRetry(functionToCall) {
        functionsToCallWhenRetry.push(functionToCall);
    }
    GameoverInterface.onRetry = onRetry;
    function hide() {
        for (var i in elements) {
            interfaceCanvas.del(elements[i]);
        }
        isActive = false;
    }
    GameoverInterface.hide = hide;
    function show() {
        for (var i in elements) {
            interfaceCanvas.set(elements[i]);
        }
        isActive = true;
    }
    GameoverInterface.show = show;
    function setScore(score) {
        currentScore = score - 1;
        elements['text'].setValue("Score: " + (score - 1) + " points");
    }
    GameoverInterface.setScore = setScore;
})(GameoverInterface || (GameoverInterface = {}));
var NextInterface;
(function (NextInterface) {
    var elements = {};
    var isActive = false;
    var functionsToCallWhenNext = [];
    function create() {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        elements['background'] = new Render.Draw.Rectangle(0, 0, sX, sY);
        elements['background'].setColor("#e6e6e6");
        elements['next_btn'] = new Render.Drawable(textures['next_btn'], 0.5 * sX - (0.15 * sX), 0.4 * sY, 0.3 * sX, (0.3 * sX) / (427 / 130));
        elements['text'] = new Render.Draw.Text(0, 0.3 * sY, "Well played!", sX, 50);
        elements['text'].setFont("badaboom");
        elements['text'].setFontSize(50);
        elements['text'].setAlign("center");
        elements['text'].setColor("#000");
        var nextClick = new Input.Mouse(0.5 * sX - (0.15 * sX), 0.4 * sY, 0.3 * sX, (0.3 * sX) / (427 / 130));
        nextClick.on("up", function (x, y, button) {
            doNext();
        });
        var nextTouch = new Input.Touch(0.5 * sX - (0.15 * sX), 0.4 * sY, 0.3 * sX, (0.3 * sX) / (427 / 130));
        nextTouch.on("down", function (x, y) {
            doNext();
        });
        var nextButton = new Input.Key(13);
        nextButton.on("up", function () {
            doNext();
        });
        function doNext() {
            if (isActive) {
                sounds['click'].play();
                for (var i = 0; i < functionsToCallWhenNext.length; i++) {
                    functionsToCallWhenNext[i]();
                }
            }
        }
    }
    NextInterface.create = create;
    function onNext(functionToCall) {
        functionsToCallWhenNext.push(functionToCall);
    }
    NextInterface.onNext = onNext;
    function hide() {
        for (var i in elements) {
            interfaceCanvas.del(elements[i]);
        }
        isActive = false;
    }
    NextInterface.hide = hide;
    function show() {
        for (var i in elements) {
            interfaceCanvas.set(elements[i]);
        }
        isActive = true;
    }
    NextInterface.show = show;
})(NextInterface || (NextInterface = {}));
var HomeInterface;
(function (HomeInterface) {
    var elements = {};
    var isActive = false;
    var functionsToCallWhenPlay = [];
    function create() {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        elements['background'] = new Render.Draw.Rectangle(0, 0, sX, sY);
        elements['background'].setColor("#e6e6e6");
        elements['home_background'] = new Render.Drawable(textures['home_background'], 0, 0, (0.5 * sX) * (815 / 720), sY);
        elements['logo'] = new Render.Drawable(textures['logo'], ((0.5 * sX) * (815 / 720)) / 2 - (0.25 * sX), 0.1 * sY, 0.3 * sX, (0.3 * sX) / (408 / 254));
        elements['home_text'] = new Render.Drawable(textures['home_text'], 0.5 * sX, 0.1 * sY, 0.4 * sX, (0.4 * sX) / (604 / 197));
        elements['arrows'] = new Render.Drawable(textures['arrows'], 0.635 * sX, 0.38 * sY, 0.2 * sX, (0.2 * sX) / (254 / 141));
        elements['play_btn'] = new Render.Drawable(textures['play_btn'], 0.55 * sX, 0.6 * sY, 0.38 * sX, (0.38 * sX) / (475 / 210));
        elements['website_btn'] = new Render.Drawable(textures['link_btn'], 0.635 * sX, 0.9 * sY, 0.3 * sX, (0.3 * sX) / (393 / 75));
        var playClick = new Input.Mouse(0.55 * sX, 0.6 * sY, 0.38 * sX, (0.38 * sX) / (475 / 210));
        playClick.on("up", function (x, y, button) {
            doPlay();
        });
        var playTouch = new Input.Touch(0.55 * sX, 0.6 * sY, 0.38 * sX, (0.38 * sX) / (475 / 210));
        playTouch.on("down", function (x, y) {
            doPlay();
        });
        var websiteClick = new Input.Mouse(0.635 * sX, 0.9 * sY, 0.3 * sX, (0.3 * sX) / (393 / 75));
        websiteClick.on("up", function (x, y, button) {
            doWebsite();
        });
        var websiteTouch = new Input.Touch(0.635 * sX, 0.9 * sY, 0.3 * sX, (0.3 * sX) / (393 / 75));
        websiteTouch.on("down", function (x, y) {
            doWebsite();
        });
        var retryButton = new Input.Key(13);
        retryButton.on("up", function () {
            doPlay();
        });
        function doWebsite() {
            if (isActive) {
                sounds['click'].play();
                window.open("https://www.williamdasilva.fr");
            }
        }
        function doPlay() {
            if (isActive) {
                sounds['click'].play();
                for (var i = 0; i < functionsToCallWhenPlay.length; i++) {
                    functionsToCallWhenPlay[i]();
                }
            }
        }
    }
    HomeInterface.create = create;
    function onPlay(functionToCall) {
        functionsToCallWhenPlay.push(functionToCall);
    }
    HomeInterface.onPlay = onPlay;
    function hide() {
        sounds['home'].stop();
        for (var i in elements) {
            interfaceCanvas.del(elements[i]);
        }
        isActive = false;
    }
    HomeInterface.hide = hide;
    function show() {
        sounds['home'].play();
        for (var i in elements) {
            interfaceCanvas.set(elements[i]);
        }
        isActive = true;
    }
    HomeInterface.show = show;
})(HomeInterface || (HomeInterface = {}));
var WinInterface;
(function (WinInterface) {
    var elements = {};
    var isActive = false;
    function create() {
        var screenSize = Global.getScreenSize();
        var sX = screenSize.width;
        var sY = screenSize.height;
        elements['background'] = new Render.Draw.Rectangle(0, 0, sX, sY);
        elements['background'].setColor("#e6e6e6");
        elements['twitter_btn'] = new Render.Drawable(textures['twitter_btn'], 0.5 * sX - (0.175 * sX), 0.4 * sY + (0.3 * sX) / (427 / 130) + 10, 0.35 * sX, (0.35 * sX) / (535 / 135));
        elements['text'] = new Render.Draw.Text(0, 0.4 * sY - 0.1 * sY, "YOU WIN!", sX, sY);
        elements['text'].setFont("badaboom");
        elements['text'].setFontSize(50);
        elements['text'].setAlign("center");
        elements['text'].setColor("#000");
        var twitterClick = new Input.Mouse(0.5 * sX - (0.175 * sX), 0.4 * sY + (0.3 * sX) / (427 / 130) + 10, 0.35 * sX, (0.35 * sX) / (535 / 135));
        twitterClick.on("up", function (x, y, button) {
            doTwitter();
        });
        var twitterTouch = new Input.Touch(0.5 * sX - (0.175 * sX), 0.4 * sY + (0.3 * sX) / (427 / 130) + 10, 0.35 * sX, (0.35 * sX) / (535 / 135));
        twitterTouch.on("down", function (x, y) {
            doTwitter();
        });
        function doTwitter() {
            if (isActive) {
                sounds['click'].play();
                var message = "Play 'My Name is RED', a game by @willia_am for the @EpicGameJam !";
                window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(message));
            }
        }
    }
    WinInterface.create = create;
    function hide() {
        for (var i in elements) {
            interfaceCanvas.del(elements[i]);
        }
        isActive = false;
    }
    WinInterface.hide = hide;
    function show() {
        for (var i in elements) {
            interfaceCanvas.set(elements[i]);
        }
        isActive = true;
    }
    WinInterface.show = show;
})(WinInterface || (WinInterface = {}));
/// <reference path="../../perso/dickbutt/engine.d.ts" />
/// <reference path="gameplay/player.ts" />
/// <reference path="gameplay/letter.ts" />
/// <reference path="gameplay/tile.ts" />
/// <reference path="gameplay/hitbox.ts" />
/// <reference path="gameplay/map.ts" />
/// <reference path="gameplay/spike.ts" />
/// <reference path="gameplay/behaviours/playerBehaviour.ts" />
/// <reference path="gameplay/interfaces/countdown.ts" />
/// <reference path="gameplay/interfaces/letters.ts" />
/// <reference path="gameplay/interfaces/loading.ts" />
/// <reference path="gameplay/interfaces/gameover.ts" />
/// <reference path="gameplay/interfaces/next.ts" />
/// <reference path="gameplay/interfaces/home.ts" />
/// <reference path="gameplay/interfaces/win.ts" />
// Waiting for the loading of the DOM
window.addEventListener("load", function () {
    if (Global.isAndroid()) {
        document.addEventListener("deviceready", startApp);
    }
    else {
        startApp();
    }
});
/*    --------------------------------------------------- *\
        Game
\*    --------------------------------------------------- */
var mainCanvas = new Render.Layer();
mainCanvas.affectedByCamera = true;
var interfaceCanvas = new Render.Layer();
/*    --------------------------------------------------- *\
        Global vars
\*    --------------------------------------------------- */
var world = new p2.World({
    gravity: [0, 9000]
});
world.defaultContactMaterial.friction = 0.8;
world.setGlobalStiffness(1e5);
Update.world(world);
Update.setUseFPS(false);
var scene = new Scene();
var cam = new Camera(scene);
Update.camera(cam);
Render.setCamera(cam);
new Fonts.FontFace("badaboom", "assets/badaboom.ttf");
var textures = {};
var sounds = {};
var maps = [
    "maptest",
    "level1",
    "level2",
    "level3",
    "level4",
    "level5",
    "level6",
    "level7",
    "level8",
    "level9",
    "level10"
];
var currentMap = 0;
var isMapRunning = false;
var mapElement = null;
var mapTimer = null;
/*    --------------------------------------------------- *\
        [function] startTheApp()

        * Démarre l'application quand on est prêt. *

        Return: nil
\*    --------------------------------------------------- */
function startApp() {
    var screenSize = Global.getScreenSize();
    cam.setPosition(screenSize.width / 2, screenSize.height / 2);
    Render.add("assets/alert_background.png");
    Render.add("assets/alert_i.png");
    Render.add("assets/boombox.png");
    Render.add("assets/box.png");
    Render.add("assets/brain.png");
    Render.add("assets/ground.png");
    Render.add("assets/letter_d.png");
    Render.add("assets/letter_e.png");
    Render.add("assets/letter_r.png");
    Render.add("assets/name_background.png");
    Render.add("assets/rock1.png");
    Render.add("assets/spikes.png");
    Render.add("assets/timer_background.png");
    Render.add("assets/timer_trotter.png");
    Render.add("assets/loading_full.png");
    Render.add("assets/loading_empty.png");
    Render.add("assets/retry_btn.png");
    Render.add("assets/quit_btn.png");
    Render.add("assets/next_btn.png");
    Render.add("assets/twitter_btn.png");
    Render.add("assets/idle.png");
    Render.add("assets/running.png");
    Render.add("assets/jump.png");
    Render.add("assets/arrows.png");
    Render.add("assets/home_background.png");
    Render.add("assets/home_text.png");
    Render.add("assets/link_btn.png");
    Render.add("assets/play_btn.png");
    Render.add("assets/logo.png");
    // When the render is ready to be used; after downloaded all the images
    Render.ready(function () {
        // Save textures
        textures['alert_background'] = new Render.Texture("assets/alert_background.png");
        textures['alert_i'] = new Render.Texture("assets/alert_i.png");
        textures['boombox'] = new Render.Texture("assets/boombox.png");
        textures['box'] = new Render.Texture("assets/box.png");
        textures['brain'] = new Render.Texture("assets/brain.png");
        textures['ground'] = new Render.Texture("assets/ground.png");
        textures['letter_d'] = new Render.Texture("assets/letter_d.png");
        textures['letter_e'] = new Render.Texture("assets/letter_e.png");
        textures['letter_r'] = new Render.Texture("assets/letter_r.png");
        textures['name_background'] = new Render.Texture("assets/name_background.png");
        textures['rock1'] = new Render.Texture("assets/rock1.png");
        textures['rock2'] = new Render.Texture("assets/rock2.png");
        textures['spikes'] = new Render.Texture("assets/spikes.png");
        textures['timer_background'] = new Render.Texture("assets/timer_background.png");
        textures['timer_trotter'] = new Render.Texture("assets/timer_trotter.png");
        textures['loading_empty'] = new Render.Texture("assets/loading_empty.png");
        textures['loading_full'] = new Render.Texture("assets/loading_full.png");
        textures['retry_btn'] = new Render.Texture("assets/retry_btn.png");
        textures['quit_btn'] = new Render.Texture("assets/quit_btn.png");
        textures['next_btn'] = new Render.Texture("assets/next_btn.png");
        textures['twitter_btn'] = new Render.Texture("assets/twitter_btn.png");
        textures['running'] = new Render.Texture("assets/running.png");
        textures['idle'] = new Render.Texture("assets/idle.png");
        textures['jump'] = new Render.Texture("assets/jump.png");
        textures['arrows'] = new Render.Texture("assets/arrows.png");
        textures['home_background'] = new Render.Texture("assets/home_background.png");
        textures['home_text'] = new Render.Texture("assets/home_text.png");
        textures['link_btn'] = new Render.Texture("assets/link_btn.png");
        textures['play_btn'] = new Render.Texture("assets/play_btn.png");
        textures['logo'] = new Render.Texture("assets/logo.png");
        // Sounds
        sounds['home'] = new Sounds.Sound("assets/sounds/home.ogg");
        sounds['click'] = new Sounds.Sound("assets/sounds/click.ogg");
        sounds['dead'] = new Sounds.Sound("assets/sounds/dead.ogg");
        sounds['dead'].setVolume(0.5);
        sounds['jump'] = new Sounds.Sound("assets/sounds/jump.ogg");
        sounds['running'] = new Sounds.Sound("assets/sounds/running.ogg");
        sounds['running'].setVolume(0.2);
        sounds['ambient'] = new Sounds.Sound("assets/sounds/ambient.ogg");
        sounds['letter'] = new Sounds.Sound("assets/sounds/letter.ogg");
        sounds['timer'] = new Sounds.Sound("assets/sounds/timer.ogg");
        sounds['win'] = new Sounds.Sound("assets/sounds/win.ogg");
        // Create interfaces
        CountdownInterface.create();
        LettersInterface.create();
        LoadingInterface.create();
        GameoverInterface.create();
        NextInterface.create();
        HomeInterface.create();
        WinInterface.create();
        // Create player
        var player = new Player(world);
        playerBehaviour.setActive(true);
        playerBehaviour.setPlayer(player);
        HomeInterface.show();
        HomeInterface.onPlay(beginGame);
        function beginGame() {
            HomeInterface.hide();
            loadCurrentMap();
        }
        Render.setDebugMode(false);
        //loadCurrentMap();
        GameoverInterface.onRetry(restartMap);
        NextInterface.onNext(nextMap);
        function loadCurrentMap() {
            LoadingInterface.show();
            if (cam.isLock()) {
                cam.unlock();
            }
            var mapName = maps[currentMap];
            mapElement = new Maps.Load(mapName);
            mapElement.on("ready", function (spawn, time) {
                console.log("Map is ready");
                LoadingInterface.setProgression(80);
                // spawn the player
                mainCanvas.set(player);
                console.log("SPAWN POINT", spawn);
                player.setVelocity(0, 0);
                player.setPosition(spawn.x, spawn.y);
                world.removeBody(player);
                // set the countdown
                CountdownInterface.setMaxTime(time);
                CountdownInterface.setTime(time);
                LettersInterface.reset();
                LoadingInterface.setProgression(100);
                setTimeout(function () {
                    // Update player position if not ok
                    player.setPosition(spawn.x, spawn.y);
                    cam.setPosition(spawn.x, spawn.y);
                    cam.lockTo(player);
                    world.addBody(player);
                    LoadingInterface.hide();
                    isMapRunning = true;
                    // Show timer
                    CountdownInterface.show();
                    CountdownInterface.setBeating(true);
                    startTimer(time);
                    // Show letters
                    LettersInterface.show();
                    playerBehaviour.setControlsEnabled(true);
                    sounds['ambient'].play();
                }, 500);
            });
        }
        function restartMap() {
            currentMap = 0;
            GameoverInterface.hide();
            if (mapElement) {
                destroyMap();
            }
            player.reset();
            setTimeout(function () {
                loadCurrentMap();
            }, 500);
        }
        function startTimer(time) {
            var deltaTime = 0;
            mapTimer = setInterval(function () {
                deltaTime++;
                CountdownInterface.setTime(time - deltaTime);
                // If the countdown is finished
                if (time - deltaTime == 0) {
                    sounds['dead'].play();
                    clearInterval(mapTimer);
                    GameoverInterface.show();
                    GameoverInterface.setScore(currentMap + 1);
                    // Disable beating
                    CountdownInterface.hide();
                    CountdownInterface.setBeating(false);
                    isMapRunning = false;
                    destroyMap();
                    playerBehaviour.setControlsEnabled(false);
                    console.log("END...");
                }
            }, 1000);
        }
        var isMapTransition = false;
        function nextMap() {
            if (!isMapTransition) {
                isMapTransition = true;
                currentMap++;
                NextInterface.hide();
                if (mapElement) {
                    destroyMap();
                    player.reset();
                    setTimeout(function () {
                        loadCurrentMap();
                    }, 500);
                }
                isMapTransition = false;
            }
        }
        function destroyMap() {
            mainCanvas.del(player);
            mapElement.destroy();
            mapElement = null;
        }
        // Check for contact with letters
        Update.on(function () {
            if (isMapRunning && mapElement) {
                var letters = mapElement.getLetters();
                var spikes = mapElement.getSpikes();
                for (var i = 0; i < letters.length; ++i) {
                    if (!letters[i].beenTaken) {
                        var playerPosition = player.getPosition();
                        var letterPosition = letters[i].getPosition();
                        var distance = Global.getDistanceBetween2Points(letterPosition.x + 50, letterPosition.y + 50, playerPosition.x + 50, playerPosition.y + 50);
                        if (distance < 50) {
                            letters[i].beenTaken = true;
                            letters[i].setTaked(true);
                            LettersInterface.letterTaken(letters[i].getLetter());
                            player.setLetter(letters[i].getLetter());
                            sounds['letter'].play();
                            // Check if the user won
                            if (player.hasWon()) {
                                CountdownInterface.setBeating(false);
                                clearInterval(mapTimer);
                                setTimeout(function () {
                                    sounds['ambient'].stop();
                                    CountdownInterface.hide();
                                    playerBehaviour.setControlsEnabled(false);
                                    // Check if it was the last map
                                    if (currentMap == maps.length - 1) {
                                        sounds['win'].play();
                                        WinInterface.show();
                                    }
                                    else {
                                        NextInterface.show();
                                    }
                                }, 1000);
                            }
                        }
                    }
                }
                for (var i = 0; i < spikes.length; ++i) {
                    if (player.isAlive) {
                        var playerPosition = player.getPosition();
                        var spikesPosition = spikes[i].getPosition();
                        var distance = Global.getDistanceBetween2Points(spikesPosition.x + 50, spikesPosition.y + 50, playerPosition.x + 50, playerPosition.y + 50);
                        if (distance < 50) {
                            player.kill();
                            CountdownInterface.hide();
                            GameoverInterface.show();
                            GameoverInterface.setScore(currentMap + 1);
                            playerBehaviour.setControlsEnabled(false);
                            isMapRunning = false;
                            destroyMap();
                            sounds['dead'].play();
                            console.log("KILL");
                            clearInterval(mapTimer);
                        }
                    }
                }
            }
        });
        // Scene background
        var sceneBackground = new Render.Draw.Rectangle(0, 0, Global.getScreenSize().width, Global.getScreenSize().height);
        sceneBackground.setColor("#373737");
        sceneBackground.setFixed(true);
        sceneBackground.setDepth(0);
        mainCanvas.set(sceneBackground);
    });
    Render.download();
}
