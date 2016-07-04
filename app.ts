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
window.addEventListener("load", () => {
    if(Global.isAndroid()) {
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
function startApp(){

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
    Render.ready(() => {

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


        function beginGame(){
            HomeInterface.hide();
            loadCurrentMap();
        }

        Render.setDebugMode(false);


        //loadCurrentMap();
        GameoverInterface.onRetry(restartMap);
        NextInterface.onNext(nextMap);

        function loadCurrentMap(){
            LoadingInterface.show();
            if(cam.isLock()){
                cam.unlock();
            }

            var mapName = maps[currentMap];
            mapElement = new Maps.Load(mapName);
            mapElement.on("ready", (spawn, time) => {
                console.log("Map is ready");
                LoadingInterface.setProgression(80);

                // spawn the player
                mainCanvas.set(player);
                console.log("SPAWN POINT", spawn);
                player.setVelocity(0,0);
                player.setPosition(spawn.x, spawn.y);
                world.removeBody(player);

                // set the countdown
                CountdownInterface.setMaxTime(time);
                CountdownInterface.setTime(time);

                LettersInterface.reset();

                LoadingInterface.setProgression(100);

                setTimeout(() => {
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

        function restartMap(){
            currentMap = 0;
            GameoverInterface.hide();

            if(mapElement){
                destroyMap();
            }

            player.reset();
            
            setTimeout(() => {
                loadCurrentMap();
            }, 500);
        }

        function startTimer(time){
            var deltaTime = 0;
            mapTimer = setInterval(() => {
                deltaTime++;
                
                CountdownInterface.setTime(time - deltaTime);
                // If the countdown is finished
                if(time - deltaTime == 0){

                    sounds['dead'].play();

                    clearInterval(mapTimer);
                    GameoverInterface.show();
                    GameoverInterface.setScore(currentMap+1);

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
        function nextMap(){
            if(!isMapTransition){
                isMapTransition = true;
                currentMap++;

                NextInterface.hide();

                if(mapElement){
                    destroyMap();

                    player.reset();
                    
                    setTimeout(() => {
                        loadCurrentMap();
                    }, 500);
                }

                isMapTransition = false;
            }
        }

        function destroyMap(){
            mainCanvas.del(player);

            mapElement.destroy();
            mapElement = null;
        }
        
        // Check for contact with letters
        Update.on(() => {
            if(isMapRunning && mapElement){
                var letters = mapElement.getLetters();
                var spikes = mapElement.getSpikes();
                for (var i = 0; i < letters.length; ++i) {
                    if(!letters[i].beenTaken){
                        var playerPosition = player.getPosition();
                        var letterPosition = letters[i].getPosition();
                        var distance = Global.getDistanceBetween2Points(letterPosition.x+50, letterPosition.y+50, playerPosition.x + 50, playerPosition.y + 50);
                        if(distance < 50){
                            letters[i].beenTaken = true;
                            letters[i].setTaked(true);
                            LettersInterface.letterTaken(letters[i].getLetter());

                            player.setLetter(letters[i].getLetter());
                            sounds['letter'].play();

                            // Check if the user won
                            if(player.hasWon()){
                                CountdownInterface.setBeating(false);
                                clearInterval(mapTimer);
                                setTimeout(() => {
                                    sounds['ambient'].stop();

                                    CountdownInterface.hide();
                                    playerBehaviour.setControlsEnabled(false);

                                    // Check if it was the last map
                                    if(currentMap == maps.length-1){
                                        sounds['win'].play();
                                        WinInterface.show();
                                    }
                                    else{
                                        NextInterface.show();
                                    }
                                }, 1000);
                            }
                        }
                    }
                }

                for (var i = 0; i < spikes.length; ++i) {
                    if(player.isAlive){
                        var playerPosition = player.getPosition();
                        var spikesPosition = spikes[i].getPosition();
                        var distance = Global.getDistanceBetween2Points(spikesPosition.x+50, spikesPosition.y+50, playerPosition.x + 50, playerPosition.y + 50);
                        if(distance < 50){
                            player.kill();

                            CountdownInterface.hide();

                            GameoverInterface.show();
                            GameoverInterface.setScore(currentMap+1);

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
        var sceneBackground = new Render.Draw.Rectangle(0,0, Global.getScreenSize().width, Global.getScreenSize().height);
        sceneBackground.setColor("#373737");
        sceneBackground.setFixed(true);
        sceneBackground.setDepth(0);
        mainCanvas.set(sceneBackground);

    });
    Render.download();
}
