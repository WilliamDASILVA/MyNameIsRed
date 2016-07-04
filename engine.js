var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*	--------------------------------------------------- *\
        Global functions
\*	--------------------------------------------------- */
var Global;
(function (Global) {
    /*    --------------------------------------------------- *\
            [function] getScreenSize()
    
            * Return the screen size *
    
            Return: screenX, screenY
    \*    --------------------------------------------------- */
    function getScreenSize() {
        return { width: window.innerWidth, height: window.innerHeight };
    }
    Global.getScreenSize = getScreenSize;
    /*	--------------------------------------------------- *\
            [function] getDistanceBetween2Points(xA (pointA), xB (pointB), yA, yB)
    
            * Retourne la distance entre deux points *
    
            Return: distance
    \*	--------------------------------------------------- */
    function getDistanceBetween2Points(aX, aY, bX, bY) {
        if (isNaN(aX) && aX.constructor == Point && isNaN(aY) && aY.constructor == Point) {
            return Math.sqrt(Math.pow((aY.x - aX.x), 2) + Math.pow((aY.y - aX.y), 2));
        }
        else {
            return Math.sqrt(Math.pow((bY - aY), 2) + Math.pow((bX - aX), 2));
        }
    }
    Global.getDistanceBetween2Points = getDistanceBetween2Points;
    /*    --------------------------------------------------- *\
            [function] getPositionFromScreen(screeX, screenY, cam)
    
            * Retourne une position dans le world selon la position sur l'écran *
    
            Return: position
    \*    --------------------------------------------------- */
    function getPositionFromScreen(screenX, screenY, cam) {
        var camPosition = cam.getOrigin();
        var actual = { x: camPosition.x + screenX, y: camPosition.y + screenY };
        var p = { x: actual.x, y: actual.y };
        return new Point(p.x, p.y);
    }
    Global.getPositionFromScreen = getPositionFromScreen;
    /*    --------------------------------------------------- *\
            [function] getPositionFromWorld(worldX, worldY, cam)
    
            * Retourne une position dans le screen selon la position sur le world *
    
            Return: position
    \*    --------------------------------------------------- */
    function getPositionFromWorld(worldX, worldY, cam) {
        var camPosition = cam.getOrigin();
        return new Point(worldX - camPosition.x, worldY - camPosition.y);
    }
    Global.getPositionFromWorld = getPositionFromWorld;
    /*    --------------------------------------------------- *\
            [function] findRotation(x (pointA), y (pointB), x, y)
    
            * Find the rotation between two points *
    
            Return: rotation
    \*    --------------------------------------------------- */
    function findRotation(x1, y1, x2, y2) {
        if (x1 instanceof Point && y1 instanceof Point) {
            var t = -(Math.atan2(y1.x - x1.y, y1.y - x1.y) * (180 / Math.PI));
        }
        else {
            var t = -(Math.atan2(x2 - x1, y2 - y1) * (180 / Math.PI));
        }
        if (t < 0) {
            t += 360;
        }
        return t;
    }
    Global.findRotation = findRotation;
    /*    --------------------------------------------------- *\
            [function] getRandom(min, max)
    
            * Retourne un nombre random entre min & max *
    
            Return: number
    \*    --------------------------------------------------- */
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    Global.getRandom = getRandom;
    /*    --------------------------------------------------- *\
            [function] getTrunc(x)
    
            * Retourne une valeur tronqué d'un nombre décimal *
    
            Return: number
    \*    --------------------------------------------------- */
    function getTrunc(x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }
    Global.getTrunc = getTrunc;
    /*    --------------------------------------------------- *\
            [function] isAndroid()
    
            * Check si on tourne sous Android ou non *
    
            Return: true, false
    \*    --------------------------------------------------- */
    function isAndroid() {
        // Using Cordova element instead
        if (window.hasOwnProperty("cordova")) {
            if (window['cordova'].platformId == "android") {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    Global.isAndroid = isAndroid;
    /*    --------------------------------------------------- *\
            [class] XHR()
    
            * Crée une request XHR *
    
    \*    --------------------------------------------------- */
    var XHR = (function () {
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une request XHR *
        
                Return: nil
        \*    --------------------------------------------------- */
        function XHR(target) {
            var _this = this;
            var parameters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parameters[_i - 1] = arguments[_i];
            }
            this.functionsToCallWhenReady = [];
            this.functionsToCallWhenLoaded = [];
            //this.request = new XDomainRequest() ||; 
            try {
                this.request = new XMLHttpRequest();
            }
            catch (e) {
                try {
                    this.request = new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch (e) {
                    try {
                        this.request = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    catch (e) { }
                }
            }
            var requestType = "GET";
            if (parameters[0]) {
                requestType = parameters[0];
            }
            console.log(requestType, target);
            this.request.open(requestType, target, true);
            if (parameters[1]) {
                this.request.responseType = parameters[1];
            }
            this.request.send(null);
            this.request.addEventListener("readystatechange", function (response) {
                if (_this.functionsToCallWhenReady) {
                    for (var i = 0; i < _this.functionsToCallWhenReady.length; i++) {
                        _this.functionsToCallWhenReady[i](_this.request, response);
                    }
                }
            });
            this.request.addEventListener("load", function () {
                if (_this.functionsToCallWhenLoaded) {
                    for (var i = 0; i < _this.functionsToCallWhenLoaded.length; i++) {
                        _this.functionsToCallWhenLoaded[i](_this.request);
                    }
                }
            });
        }
        /*    --------------------------------------------------- *\
                [function] ready()
        
                * Fires when the event is ready *
        
                Return: nil
        \*    --------------------------------------------------- */
        XHR.prototype.ready = function (functionToCall) {
            this.functionsToCallWhenReady.push(functionToCall);
        };
        /*    --------------------------------------------------- *\
                [function] load()
        
                * Quand la request est chargé *
        
                Return: nil
        \*    --------------------------------------------------- */
        XHR.prototype.load = function (functionToCall) {
            this.functionsToCallWhenLoaded.push(functionToCall);
        };
        return XHR;
    }());
    Global.XHR = XHR;
})(Global || (Global = {}));
var Point = (function () {
    function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Point.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Point.prototype.setX = function (x) {
        this.x = x;
    };
    Point.prototype.getX = function () {
        return this.x;
    };
    Point.prototype.setY = function (y) {
        this.y = y;
    };
    Point.prototype.getY = function () {
        return this.y;
    };
    Point.prototype.add = function (point) {
        return new Point(this.x + point.x, this.y + point.y);
    };
    Point.prototype.diff = function (point) {
        return new Point(this.x - point.x, this.y - point.y);
    };
    Point.prototype.remplace = function (point) {
        this.x = point.x;
        this.y = point.y;
    };
    Point.prototype.addX = function (x) {
        this.x += x;
    };
    Point.prototype.addY = function (y) {
        this.y += y;
    };
    return Point;
}());
var Vector = (function () {
    function Vector(position) {
        this.position = position;
    }
    Vector.prototype.getLength = function () {
        return Math.sqrt(this.position.x * this.position.x + this.position.y * this.position.y);
    };
    Vector.prototype.getPosition = function () {
        return this.position;
    };
    return Vector;
}());
/*	--------------------------------------------------- *\
        [class] Events()

        * A event class for elements that doesn't use the p2 event system *

\*	--------------------------------------------------- */
var Events = (function () {
    /*	--------------------------------------------------- *\
            [function] constructor()
    
            * When we create an event system *
    
            Return: nil
    \*	--------------------------------------------------- */
    function Events() {
        this.events = [];
    }
    /*	--------------------------------------------------- *\
            [function] emit(name)
    
            * Emit an event *
    
            Return: nil
    \*	--------------------------------------------------- */
    Events.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var exists = false;
        for (var i = 0; i < this.events.length; ++i) {
            if (this.events[i].name == eventName) {
                exists = true;
            }
        }
        if (!exists) {
            this.events.push({
                name: eventName,
                functions: []
            });
        }
        for (var i = 0; i < this.events.length; ++i) {
            if (this.events[i].name == eventName) {
                for (var k = 0; k < this.events[i].functions.length; ++k) {
                    this.events[i].functions[k].apply(null, args);
                }
            }
        }
    };
    /*	--------------------------------------------------- *\
            [function] on(name, functionToCall)
    
            * When the event is received *
    
            Return: nil
    \*	--------------------------------------------------- */
    Events.prototype.on = function (eventName, functionToCall) {
        var exists = false;
        for (var i = 0; i < this.events.length; ++i) {
            if (this.events[i].name == eventName) {
                exists = true;
            }
        }
        if (!exists) {
            this.events.push({
                name: eventName,
                functions: []
            });
        }
        for (var i = 0; i < this.events.length; ++i) {
            if (this.events[i].name == eventName) {
                this.events[i].functions.push(functionToCall);
            }
        }
    };
    return Events;
}());
var _elements = [];
var collisionGroups = [];
var collisionNumber = 1;
/*    --------------------------------------------------- *\
        [class] Elements()

        * Un element dans le jeu, peu importe quoi *

\*    --------------------------------------------------- */
var Elements = (function (_super) {
    __extends(Elements, _super);
    /*    --------------------------------------------------- *\
            [function] constructor()
    
            * Quand un element est crée *
    
            Return: nil
    \*    --------------------------------------------------- */
    function Elements(mass, isStatic) {
        if (mass === void 0) { mass = 100; }
        _super.call(this, {
            mass: mass,
            position: [0, 0],
            velocity: [0, 0],
            angle: 0,
            angularVelocity: 0,
            force: [0, 0],
            angularForce: 0,
            fixedRotation: 0
        });
        this.drawables = [];
        this.datas = [];
        this.canCollide = [];
        this.isSensor = false;
        this.haveCollision = false;
        this.colGroup = 0;
        this.eType = "";
        this.shapeAngle = 0;
        this.depth = 0;
        this.static = isStatic || false;
        if (!isStatic) {
            _elements.push(this);
        }
        this.centred = false;
    }
    Elements.prototype.setCentred = function (value) {
        this.centred = value;
    };
    Elements.prototype.isCentred = function () {
        return this.centred;
    };
    /*    --------------------------------------------------- *\
            [function] getDepth()
    
            * Retourne la profondeur de champ *
    
            Return: depth
    \*    --------------------------------------------------- */
    Elements.prototype.getDepth = function () {
        return this.depth;
    };
    Elements.prototype.setDepth = function (depth) {
        this.depth = depth;
    };
    /*    --------------------------------------------------- *\
            [function] addShape(shape, offset, angle)
    
            * Add a shape to the body *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.addShape = function (shape, offset, angle) {
        if (shape.body) {
            throw new Error('A shape can only be added to one body.');
        }
        shape.body = this;
        // Copy the offset vector
        if (offset) {
            p2.vec2.copy(shape.position, offset);
        }
        else {
            p2.vec2.set(shape.position, 0, 0);
        }
        shape.angle = angle || 0;
        this.shapes.push(shape);
        this.updateMassProperties();
        this.updateBoundingRadius();
        this.aabbNeedsUpdate = true;
        // set the body as a sensor by default
        if (this.shapes[0]) {
            this.shapes[0].sensor = true;
        }
        // remove the body sensor if it has to collide with something
        var ourID = null;
        for (var g = 0; g < collisionGroups.length; ++g) {
            if (collisionGroups[g].name == this.getType()) {
                ourID = collisionGroups[g].id;
            }
        }
        var mask = 0;
        for (var q = this.canCollide.length - 1; q >= 0; q--) {
            for (var x = collisionGroups.length - 1; x >= 0; x--) {
                if (collisionGroups[x].name == this.canCollide[q]) {
                    mask = mask | Math.pow(2, collisionGroups[x].id);
                    // We update the collision group to the shape
                    if (this.shapes.length != 0) {
                        for (var k in this.shapes) {
                            this.shapes[k].collisionGroup = Math.pow(2, ourID);
                        }
                    }
                }
            }
        }
        if (this.shapes[0]) {
            this.shapes[0].collisionMask = mask;
            if (!this.isSensor) {
                this.shapes[0].sensor = false;
            }
        }
    };
    /*    --------------------------------------------------- *\
            [function] setPosition(x (point), y)
    
            * Set la position de l'element *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.setPosition = function (x, y) {
        if (x instanceof Point) {
            this.position[0] = x.x;
            this.position[1] = x.y;
        }
        else {
            this.position[0] = x;
            this.position[1] = y;
        }
        if (this.getAssignedDrawables() != 0) {
            for (var i = 0; i < this.getAssignedDrawables().length; ++i) {
                var offset = this.getAssignedDrawables()[i].getOffset();
                var size = this.getAssignedDrawables()[i].getSize();
                if (this.isCentred()) {
                    this.getAssignedDrawables()[i].setPosition((x + offset.x) - size.width / 2, (y + offset.y) - size.height / 2);
                }
                else {
                    this.getAssignedDrawables()[i].setPosition((x + offset.x), (y + offset.y));
                }
            }
        }
        // Reset the position of the shape
        if (this.shapes[0]) {
            if (this.shapes[0].hasOwnProperty("position") && this.shapes[0].hasOwnProperty("width") && this.shapes[0].hasOwnProperty("height")) {
                var shapePos = this.shapes[0]['position'];
                this.shapes[0]['position'] = [this.shapes[0]['width'] / 2, this.shapes[0]['height'] / 2];
            }
        }
    };
    /*    --------------------------------------------------- *\
            [function] setRotation(angle)

            * Set l'angle de rotation de l'element *

            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.setRotation = function (angle) {
        this.angle = (angle * Math.PI) / 180;
        this.shapeAngle = angle;
        if (this.getAssignedDrawables() != 0) {
            for (var i = 0; i < this.getAssignedDrawables().length; ++i) {
                this.getAssignedDrawables()[i].setRotation(angle);
            }
        }
    };
    /*    --------------------------------------------------- *\
            [function] getRotation()
    
            * Retourne l'ange de rotation de l'element *
    
            Return: angle
    \*    --------------------------------------------------- */
    Elements.prototype.getRotation = function () {
        return this.shapeAngle;
    };
    /*    --------------------------------------------------- *\
            [function] getPosition()
    
            * Retourne la position de l'element *
    
            Return: position
    \*    --------------------------------------------------- */
    Elements.prototype.getPosition = function () {
        return new Point(this.position[0], this.position[1]);
    };
    /*    --------------------------------------------------- *\
            [function] assignDrawable(drawable)
    
            * Assigne un drawable à un element *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.assignDrawable = function (drawable) {
        this.drawables.push(drawable);
        this.setPosition(this.getPosition().x, this.getPosition().y);
    };
    Elements.prototype.setDrawable = function (drawable, index) {
        if (index === void 0) { index = 0; }
        this.drawables[index] = drawable;
        this.setPosition(this.getPosition().x, this.getPosition().y);
    };
    /*    --------------------------------------------------- *\
            [function] getAssignedDrawables()
    
            * Retourne le drawable assigné à l'element *
    
            Return: drawable
    \*    --------------------------------------------------- */
    Elements.prototype.getAssignedDrawables = function () {
        return this.drawables;
    };
    /*    --------------------------------------------------- *\
            [function] setType(type)
    
            * Set le type de l'element *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.setType = function (eType) {
        this.eType = eType;
        // We add this type to the global collision groups if it doesn't exists
        var exists = false;
        var id = 0;
        for (var i in collisionGroups) {
            if (collisionGroups[i].name != this.getType()) {
                exists = true;
                id = collisionGroups[i].id;
            }
        }
        if (!exists) {
            this.addCollisionGroup();
        }
        else {
            this.setCollisionId(id);
        }
    };
    /*    --------------------------------------------------- *\
            [function] addCollisionGroup()
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.addCollisionGroup = function () {
        collisionGroups.push({
            id: collisionNumber,
            name: this.getType()
        });
        this.setCollisionId(collisionNumber);
        collisionNumber++;
    };
    /*    --------------------------------------------------- *\
            [function] getType()
    
            * Retourne le type de l'element *
    
            Return: type
    \*    --------------------------------------------------- */
    Elements.prototype.getType = function () {
        return this.eType;
    };
    /*    --------------------------------------------------- *\
            [function] setCollisionId(id)
    
            * Set l'id du groupe de collision *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.setCollisionId = function (id) {
        this.colGroup = id;
    };
    /*    --------------------------------------------------- *\
            [function] getCollisionId()
    
            * Retourne l'id du groupe de collision *
    
            Return: id
    \*    --------------------------------------------------- */
    Elements.prototype.getCollisionId = function () {
        return this.colGroup;
    };
    /*    --------------------------------------------------- *\
            [function] setData(dataName, value)
    
            * Set la data de la tile *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.setData = function (dataName, dataValue) {
        var data = {
            name: dataName,
            value: dataValue
        };
        this.datas.push(data);
    };
    /*    --------------------------------------------------- *\
            [function] getData(dataName)
    
            * Retourne la data d'une tile *
    
            Return: dataValue
    \*    --------------------------------------------------- */
    Elements.prototype.getData = function (dataName) {
        var valueToReturn = null;
        for (var i = this.datas.length - 1; i >= 0; i--) {
            if (this.datas[i].name == dataName) {
                valueToReturn = this.datas[i].value;
            }
        }
        return valueToReturn;
    };
    /*    --------------------------------------------------- *\
            [function] setMass()
    
            * Set la masse d'un element *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.setMass = function (mass) {
        this.mass = mass;
        this.updateMassProperties();
    };
    /*    --------------------------------------------------- *\
            [function] getMass()
    
            * Retourne la masse d'un element *
    
            Return: mass
    \*    --------------------------------------------------- */
    Elements.prototype.getMass = function () {
        return this.mass;
    };
    /*    --------------------------------------------------- *\
            [function] setFixedRotation(boolean)
    
            * Set si l'element a une rotation fixe *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.setFixedRotation = function (value) {
        if (value) {
            this.fixedRotation = 1;
        }
        else {
            this.fixedRotation = 0;
        }
    };
    /*    --------------------------------------------------- *\
            [function] getFixedRotation()
    
            * Retourne si la rotation est fixe ou non *
    
            Return: true, false
    \*    --------------------------------------------------- */
    Elements.prototype.getFixedRotation = function () {
        if (this.fixedRotation == 1) {
            return true;
        }
        else {
            return false;
        }
    };
    /*    --------------------------------------------------- *\
            [function] canCollideWith(elements...)
    
            * Set la liste des elements avec lequel cet element peut avoir une collision *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.canCollideWith = function () {
        var parameters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parameters[_i - 0] = arguments[_i];
        }
        if (parameters) {
            for (var i = parameters.length - 1; i >= 0; i--) {
                this.canCollide.push(parameters[i]);
            }
            this.updateCollisions();
        }
    };
    /*    --------------------------------------------------- *\
            [function] updateCollisions()
    
            * Met a jour les groupes de collision *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.updateCollisions = function () {
        // On commence par vérifier si tous les groupes ont étés crées, sinon on les crées
        var temp = this.canCollide;
        var groupsCollide = [];
        for (var i = this.canCollide.length - 1; i >= 0; i--) {
            groupsCollide.push({
                exists: false,
                type: this.canCollide[i]
            });
        }
        for (var i = groupsCollide.length - 1; i >= 0; i--) {
            for (var k in collisionGroups) {
                if (collisionGroups[k].name == groupsCollide[i].type) {
                    groupsCollide[i].exists = true;
                }
            }
        }
        // On crée le groupe si il n'existe pas
        for (var i = groupsCollide.length - 1; i >= 0; i--) {
            if (groupsCollide[i].exists == false) {
                collisionGroups.push({
                    id: collisionNumber,
                    name: groupsCollide[i].type
                });
                collisionNumber++;
            }
        }
    };
    /*    --------------------------------------------------- *\
            [function] destroy()
    
            * Déturit l'element *
    
            Return: nil
    \*    --------------------------------------------------- */
    Elements.prototype.destroy = function () {
        if (this.world) {
            this.world.removeBody(this);
        }
        for (var i = _elements.length - 1; i >= 0; i--) {
            if (_elements[i] == this) {
                _elements.splice(i, 1);
            }
        }
        delete this;
    };
    Elements.prototype.setVelocity = function (x, y) {
        this.velocity[0] = x;
        this.velocity[1] = y;
    };
    Elements.prototype.getVelocity = function () {
        return { x: this.velocity[0], y: this.velocity[1] };
    };
    return Elements;
}(p2.Body));
/*	--------------------------------------------------- *\
        [class] Scene()

        * Crée une scene *

\*	--------------------------------------------------- */
var Scene = (function () {
    /*	--------------------------------------------------- *\
            [function] constructor()
    
            * Quand une scene est crée *
    
            Return: nil
    \*	--------------------------------------------------- */
    function Scene() {
        this.origin = new Point(0, 0);
    }
    /*	--------------------------------------------------- *\
            [function] getOrigin()
    
            * Retourne l'origin *
    
            Return: origin
    \*	--------------------------------------------------- */
    Scene.prototype.getOrigin = function () {
        return this.origin;
    };
    return Scene;
}());
/*	--------------------------------------------------- *\
        [class] Camera()

        * Crée une camera *

        Return: camera
\*	--------------------------------------------------- */
var Camera = (function (_super) {
    __extends(Camera, _super);
    /*	--------------------------------------------------- *\
            [function] constructor()
    
            * Quand une camera est crée *
    
            Return: nil
    \*	--------------------------------------------------- */
    function Camera(scene) {
        _super.call(this);
        this.parentScene = scene;
        this.position = new Point(0, 0);
        this.depth = 1;
        this.depthPosition = new Point(0, 0);
        this.rotationPoint = new Point(0, 0);
        this.angle = 0;
        this.isCameraLock = false;
        this.cameraLockOn = null;
    }
    /*	--------------------------------------------------- *\
            [function] setPosition()
    
            * Set la position de la camera *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.setPosition = function (position, y) {
        var originPoint = this.parentScene.getOrigin();
        if (position instanceof Point) {
            this.position = position.add(originPoint);
        }
        else {
            this.position = new Point(position, y);
        }
    };
    /*	--------------------------------------------------- *\
            [function] getPosition()
    
            * Get la position de la camera *
    
            Return: position
    \*	--------------------------------------------------- */
    Camera.prototype.getPosition = function () {
        return this.position;
    };
    /*	--------------------------------------------------- *\
            [function] getDepth()
    
            * Return the depth of the camera *
    
            Return: depth
    \*	--------------------------------------------------- */
    Camera.prototype.getDepth = function () {
        return this.depth;
    };
    /*	--------------------------------------------------- *\
            [function] setDepth(depth)
    
            * Set the depth of the camera *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.setDepth = function (depth) {
        this.depth = depth;
    };
    /*	--------------------------------------------------- *\
            [function] setDepthPosition(x, y)
    
            * Set the position of the depth change *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.setDepthPosition = function (position) {
        this.depthPosition = position;
    };
    /*	--------------------------------------------------- *\
            [function] getDepthPosition()
    
            * Return the position of the depth *
    
            Return: depthPosition
    \*	--------------------------------------------------- */
    Camera.prototype.getDepthPosition = function () {
        return this.depthPosition;
    };
    /*	--------------------------------------------------- *\
            [function] setRotationPoint(x, y)
    
            * Set the point of rotation *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.setRotationPoint = function (position) {
        this.rotationPoint = position;
    };
    /*	--------------------------------------------------- *\
            [function] getRotationPoint()
    
            * Return the point of rotation *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.getRotationPoint = function () {
        return this.rotationPoint;
    };
    /*	--------------------------------------------------- *\
            [function] setRotation(angle in degres)
    
            * Set the rotation of the camera *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.setRotation = function (angle) {
        this.angle = (angle * Math.PI) / 180;
    };
    /*	--------------------------------------------------- *\
            [function] getRotation()
    
            * Return the angle of the camera *
    
            Return: angle in radian
    \*	--------------------------------------------------- */
    Camera.prototype.getRotation = function () {
        return this.angle;
    };
    /*	--------------------------------------------------- *\
            [function] getOrigin()
    
            * Retourne la position d'origine de la camera *
    
            Return: position
    \*	--------------------------------------------------- */
    Camera.prototype.getOrigin = function () {
        return new Point(this.position.x - (Global.getScreenSize().width / 2), this.position.y - (Global.getScreenSize().height / 2));
    };
    /*	--------------------------------------------------- *\
            [function] lockTo(element)
    
            * Lock the camera position to a specific element *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.lockTo = function (element) {
        this.isCameraLock = true;
        this.cameraLockOn = element;
    };
    /*	--------------------------------------------------- *\
            [function] unlock()
    
            * Unlock the camera position *
    
            Return: nil
    \*	--------------------------------------------------- */
    Camera.prototype.unlock = function () {
        this.isCameraLock = false;
        this.cameraLockOn = null;
    };
    /*	--------------------------------------------------- *\
            [function] getLockElement()
    
            * Return the camera's lock element *
    
            Return: Elements
    \*	--------------------------------------------------- */
    Camera.prototype.getLockElement = function () {
        return this.cameraLockOn;
    };
    /*	--------------------------------------------------- *\
            [function] isLock()
    
            * Check if the camera is lock or not *
    
            Return: true, false
    \*	--------------------------------------------------- */
    Camera.prototype.isLock = function () {
        return this.isCameraLock;
    };
    return Camera;
}(Scene));
/*	--------------------------------------------------- *\
        Input
\*	--------------------------------------------------- */
var Input;
(function (Input) {
    var pressedKeys = [];
    var settings = {
        holdTime: 300
    };
    /*	--------------------------------------------------- *\
            [class] MouseMove()
    
            * Quand l'utilisateur bouge la souris *
    
    \*	--------------------------------------------------- */
    var MouseMove = (function (_super) {
        __extends(MouseMove, _super);
        /*	--------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée l'event *
        
                Return: nil
        \*	--------------------------------------------------- */
        function MouseMove() {
            _super.call(this);
            var cache = this;
            window.addEventListener("mousemove", function (e) {
                cache.emit("move", e.clientX, e.clientY);
            });
        }
        return MouseMove;
    }(Events));
    Input.MouseMove = MouseMove;
    /*	--------------------------------------------------- *\
            [class] Mouse()
    
            * When the user use the mouse buttons *
    
    \*	--------------------------------------------------- */
    var Mouse = (function (_super) {
        __extends(Mouse, _super);
        /*	--------------------------------------------------- *\
                [function] constructor(x, y, width, height)
        
                * When we create the event on the mouse *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Mouse(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = window.innerWidth; }
            if (height === void 0) { height = window.innerHeight; }
            _super.call(this);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            var holdStart = null;
            var cache = this;
            document.addEventListener("mouseup", function (e) {
                if (e.clientX >= cache.x && e.clientX <= cache.x + cache.width && e.clientY >= cache.y && e.clientY <= cache.y + cache.height) {
                    var button = "";
                    switch (e.button) {
                        case 0:
                            button = "left";
                            break;
                        case 1:
                            button = "middle";
                            break;
                        case 2:
                            button = "right";
                            break;
                    }
                    cache.emit("up", e.clientX, e.clientY, button);
                    holdStart = false;
                }
            });
            document.addEventListener("mousedown", function (e) {
                if (e.clientX >= cache.x && e.clientX <= cache.x + cache.width && e.clientY >= cache.y && e.clientY <= cache.y + cache.height) {
                    var button = "";
                    switch (e.button) {
                        case 0:
                            button = "left";
                            break;
                        case 1:
                            button = "middle";
                            break;
                        case 2:
                            button = "right";
                            break;
                    }
                    cache.emit("down", e.clientX, e.clientY, button);
                    holdStart = true;
                    var eCache = e;
                    setTimeout(function () {
                        if (holdStart) {
                            cache.emit("hold", eCache.clientX, eCache.clientY, button);
                        }
                    }, settings.holdTime);
                }
            });
        }
        /*	--------------------------------------------------- *\
                [function] setPosition(x, y)
        
                * Set the position of the touch event *
        
                Return: nil
        \*	--------------------------------------------------- */
        Mouse.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        /*	--------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set the size of the aabb box *
        
                Return: nil
        \*	--------------------------------------------------- */
        Mouse.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
        };
        return Mouse;
    }(Events));
    Input.Mouse = Mouse;
    /*	--------------------------------------------------- *\
            [class] Clic k()
    
            * Quand l'utilisateur clique sur une zone *
    
    \*	--------------------------------------------------- */
    var Click = (function (_super) {
        __extends(Click, _super);
        /*	--------------------------------------------------- *\
                [function] constructor(x, y, width, height)
        
                * Quand on crée l'event click *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Click(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = window.innerWidth; }
            if (height === void 0) { height = window.innerHeight; }
            _super.call(this);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            var cache = this;
            window.addEventListener("click", function (e) {
                if (e.clientX >= cache.x && e.clientX <= cache.x + cache.width && e.clientY >= cache.y && e.clientY <= cache.y + cache.height) {
                    cache.emit("click", e.clientX, e.clientY);
                }
                else {
                    cache.emit("out", e.clientX, e.clientY);
                }
            });
        }
        /*	--------------------------------------------------- *\
                [function] setPosition(x, y)
        
                * Set la position de la hitbox *
        
                Return: nil
        \*	--------------------------------------------------- */
        Click.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        /*	--------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set la taille de la hitbox *
        
                Return: nil
        \*	--------------------------------------------------- */
        Click.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
        };
        return Click;
    }(Events));
    Input.Click = Click;
    /*	--------------------------------------------------- *\
            [class] Touch()
    
            * Créer une zone où l'utilisateur peut toucher *
    
    \*	--------------------------------------------------- */
    var Touch = (function (_super) {
        __extends(Touch, _super);
        /*	--------------------------------------------------- *\
                [function] constructor(x, y, width, height)
        
                * Quand on crée une zone de toucher *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Touch(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = window.innerWidth; }
            if (height === void 0) { height = window.innerHeight; }
            _super.call(this);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            var holdStart = false;
            var cache = this;
            document.body.addEventListener("touchstart", function (e) {
                for (var i = e.changedTouches.length - 1; i >= 0; i--) {
                    if (e.changedTouches[i].clientX >= cache.x && e.changedTouches[i].clientX <= cache.x + cache.width && e.changedTouches[i].clientY >= cache.y && e.changedTouches[i].clientY <= cache.y + cache.height) {
                        var eventCache = e.changedTouches[i];
                        cache.emit("press", eventCache.clientX, eventCache.clientY, e.touches);
                        // hold
                        holdStart = true;
                        setTimeout(function () {
                            if (holdStart) {
                                cache.emit("hold", eventCache.clientX, eventCache.clientY, e.touches);
                            }
                        }, settings.holdTime);
                    }
                }
            }, false);
            document.body.addEventListener("touchend", function (e) {
                for (var i = e.changedTouches.length - 1; i >= 0; i--) {
                    if (e.changedTouches[i].clientX >= cache.x && e.changedTouches[i].clientX <= cache.x + cache.width && e.changedTouches[i].clientY >= cache.y && e.changedTouches[i].clientY <= cache.y + cache.height) {
                        cache.emit("release", e.changedTouches[i].clientX, e.changedTouches[i].clientY, e.touches);
                        // hold
                        holdStart = false;
                    }
                }
            }, false);
            document.body.addEventListener("touchmove", function (e) {
                for (var i = e.changedTouches.length - 1; i >= 0; i--) {
                    if (e.changedTouches[i].clientX >= cache.x && e.changedTouches[i].clientX <= cache.x + cache.width && e.changedTouches[i].clientY >= cache.y && e.changedTouches[i].clientY <= cache.y + cache.height) {
                        cache.emit("move", e.changedTouches[i].clientX, e.changedTouches[i].clientY, e.touches);
                    }
                }
                e.preventDefault();
            }, false);
        }
        /*	--------------------------------------------------- *\
                [function] setPosition(x, y)
        
                * Set the position of the touch event *
        
                Return: nil
        \*	--------------------------------------------------- */
        Touch.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        /*	--------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set the size of the aabb box *
        
                Return: nil
        \*	--------------------------------------------------- */
        Touch.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
        };
        return Touch;
    }(Events));
    Input.Touch = Touch;
    /*	--------------------------------------------------- *\
            [class] Key()
    
            * Crée un event de type Key press *
    
    \*	--------------------------------------------------- */
    var Key = (function (_super) {
        __extends(Key, _super);
        /*	--------------------------------------------------- *\
                [function] constructor(keyPressed : any)
        
                * Quand on crée l'event *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Key() {
            var _this = this;
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i - 0] = arguments[_i];
            }
            _super.call(this);
            var cache = this;
            this.keyPressed = null;
            if (rest[0]) {
                this.keyPressed = rest[0];
            }
            window.addEventListener("keydown", function (e) {
                if (_this.keyPressed) {
                    if (_this.keyPressed == e.key || _this.keyPressed == e.keyCode || _this.keyPressed == e.charCode) {
                        pressedKeys.push({ key: e.key, code: e.keyCode, event: _this });
                    }
                }
                else {
                    cache.emit("down", e.key, e.keyCode, e.charCode);
                }
            });
            window.addEventListener("keyup", function (e) {
                if (_this.keyPressed != null) {
                    if (_this.keyPressed == e.key || _this.keyPressed == e.keyCode || _this.keyPressed == e.charCode) {
                        cache.emit("up", e.key, e.keyCode, e.charCode);
                        for (var i = pressedKeys.length - 1; i >= 0; i--) {
                            if (pressedKeys[i]) {
                                if (pressedKeys[i].key == e.key || pressedKeys[i].code == e.keyCode) {
                                    delete pressedKeys[i];
                                }
                            }
                        }
                    }
                }
                else {
                    cache.emit("up", e.key, e.keyCode, e.charCode);
                }
            });
        }
        /*	--------------------------------------------------- *\
                [function] setKey(key)
        
                * Set une nouvelle key *
        
                Return: nil
        \*	--------------------------------------------------- */
        Key.prototype.setKey = function (newKey) {
            this.keyPressed = newKey;
        };
        return Key;
    }(Events));
    Input.Key = Key;
    updateKeys();
    function updateKeys() {
        requestAnimationFrame(updateKeys);
        for (var i = pressedKeys.length - 1; i >= 0; i--) {
            if (pressedKeys[i]) {
                pressedKeys[i].event.emit("down", pressedKeys[i].key, pressedKeys[i].code);
            }
        }
    }
    /*	--------------------------------------------------- *\
            [class] Scroll()
    
            * Mouse scroll *
    
    \*	--------------------------------------------------- */
    var Scroll = (function (_super) {
        __extends(Scroll, _super);
        /*	--------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un event scroll *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Scroll() {
            _super.call(this);
            var cache = this;
            window.addEventListener("DOMMouseScroll", function (e) {
                if (e) {
                    if (e['detail'] && e['detail'] > 0) {
                        cache.emit("down");
                    }
                    else {
                        cache.emit("up");
                    }
                }
            });
        }
        return Scroll;
    }(Events));
    Input.Scroll = Scroll;
    // Prevent context menu
    window.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });
})(Input || (Input = {}));
/*	--------------------------------------------------- *\
        Update
\*	--------------------------------------------------- */
var Update;
(function (Update) {
    var worldToUpdate = null;
    var cameraToUpdate = null;
    var useFPS = true;
    var functionsToCallWhenUpdate = [];
    /*	--------------------------------------------------- *\
            [function] world(worldToUpdate)
    
            * Démarre l'updating du world *
    
            Return: nil
    \*	--------------------------------------------------- */
    function world(world) {
        worldToUpdate = world;
        requestAnimationFrame(step);
    }
    Update.world = world;
    /*	--------------------------------------------------- *\
            [function] camera(cameraToUpdate)
    
            * Update the camera position *
    
            Return: nil
    \*	--------------------------------------------------- */
    function camera(camera) {
        cameraToUpdate = camera;
    }
    Update.camera = camera;
    function setUseFPS(value) {
        useFPS = value;
    }
    Update.setUseFPS = setUseFPS;
    /*	--------------------------------------------------- *\
            [function] step()
    
            * Step the world *
    
            Return: nil
    \*	--------------------------------------------------- */
    var timeStep = 1 / 60, maxSubSteps = 10, lastTime;
    function step(t) {
        requestAnimationFrame(step);
        // update elements
        for (var i = 0; i < _elements.length; i++) {
            var pos = _elements[i].getPosition();
            _elements[i].setPosition(pos.x, pos.y);
            _elements[i].setRotation(_elements[i].getRotation());
        }
        // camera mouvement
        if (cameraToUpdate && cameraToUpdate.isLock()) {
            var lockOnPosition = cameraToUpdate.getLockElement().getPosition();
            cameraToUpdate.setPosition(lockOnPosition.x, lockOnPosition.y);
        }
        // call update functions
        for (var k = 0; k < functionsToCallWhenUpdate.length; k++) {
            functionsToCallWhenUpdate[k](t);
        }
        var dt = t !== undefined && lastTime !== undefined ? t / 1000 - lastTime : 0;
        if (useFPS) {
            worldToUpdate.step(timeStep);
        }
        else {
            worldToUpdate.step(timeStep, dt, maxSubSteps);
        }
        lastTime = t / 1000;
    }
    /*	--------------------------------------------------- *\
            [function] on(functionToCall)
    
            * Quand le world est mis à jour *
    
            Return: nil
    \*	--------------------------------------------------- */
    function on(functionToCall) {
        functionsToCallWhenUpdate.push(functionToCall);
    }
    Update.on = on;
})(Update || (Update = {}));
/*	--------------------------------------------------- *\
        Render
\*	--------------------------------------------------- */
var Render;
(function (Render) {
    var renderCamera = null;
    var image_prefix = "./";
    var elementsToDownload = [];
    var fToCallWhenDownloadReady = [];
    var debugMode = {
        active: false,
        type: "aabb"
    };
    var actualWorld = null;
    /*	--------------------------------------------------- *\
            [function] setCamera()
    
            * Add une camera au Render *
    
            Return: nil
    \*	--------------------------------------------------- */
    function setCamera(cam) {
        renderCamera = cam;
    }
    Render.setCamera = setCamera;
    /*	--------------------------------------------------- *\
            [function] getCamera()
    
            * Retourne l'element camera *
    
            Return: camera
    \*	--------------------------------------------------- */
    function getCamera() {
        return renderCamera;
    }
    Render.getCamera = getCamera;
    /*    --------------------------------------------------- *\
            [function] add()
    
            * Add un element a download *
    
            Return: nil
    \*    --------------------------------------------------- */
    function add(elementToDownload) {
        var elementToDL = {
            element: elementToDownload,
            downloaded: false
        };
        elementsToDownload.push(elementToDL);
    }
    Render.add = add;
    /*	--------------------------------------------------- *\
            [function] setDebugMode(boolean)
    
            * Set le mode debug *
    
            Return: nil
    \*	--------------------------------------------------- */
    function setDebugMode(value, type) {
        if (type === void 0) { type = "aabb"; }
        debugMode.active = value;
        debugMode.type = type;
    }
    Render.setDebugMode = setDebugMode;
    /*	--------------------------------------------------- *\
            [function] getWorld()
    
            * Retourne le world *
    
            Return: world
    \*	--------------------------------------------------- */
    function getWorld() {
        return actualWorld;
    }
    Render.getWorld = getWorld;
    /*	--------------------------------------------------- *\
            [function] setWorld(world)
    
            * Set le world *
    
            Return: nil
    \*	--------------------------------------------------- */
    function setWorld(world) {
        actualWorld = world;
    }
    Render.setWorld = setWorld;
    /*    --------------------------------------------------- *\
            [function] download()
    
            * Preload toute les images avant de commencer le jeu *
    
            Return: nil
    \*    --------------------------------------------------- */
    function download() {
        var filesDownloaded = 0;
        if (elementsToDownload.length == 0) {
            for (var i = fToCallWhenDownloadReady.length - 1; i >= 0; i--) {
                fToCallWhenDownloadReady[i]();
            }
        }
        for (var i = elementsToDownload.length - 1; i >= 0; i--) {
            var obj = new Image();
            obj.src = image_prefix + elementsToDownload[i].element;
            var elementName = elementsToDownload[i].element;
            obj.addEventListener("load", function () {
                for (var i = elementsToDownload.length - 1; i >= 0; i--) {
                    if (elementsToDownload[i].element == elementName) {
                        elementsToDownload[i].downloaded = true;
                        // Vérifie si tous les download ne sont pas deja fini
                        for (var k = elementsToDownload.length - 1; k >= 0; k--) {
                            if (elementsToDownload[k].downloaded == true) {
                                filesDownloaded += 1;
                            }
                        }
                    }
                }
                // Tous les downlaod ont été effectués.
                if (filesDownloaded == elementsToDownload.length) {
                    for (var i = fToCallWhenDownloadReady.length - 1; i >= 0; i--) {
                        fToCallWhenDownloadReady[i]();
                    }
                }
            });
        }
    }
    Render.download = download;
    /*    --------------------------------------------------- *\
            [function] ready()
    
            * Fires quand toute les ressources sont téléchargés *
    
            Return: nil
    \*    --------------------------------------------------- */
    function ready(functionToCall) {
        fToCallWhenDownloadReady.push(functionToCall);
    }
    Render.ready = ready;
    /*	--------------------------------------------------- *\
            Render loop
    \*	--------------------------------------------------- */
    var elementToDraw;
    /*	--------------------------------------------------- *\
            [function] updateRender()
    
            * Fonction appellé pour dispatcher le rendu *
    
            Return: nil
    \*	--------------------------------------------------- */
    function updateRender(layer) {
        var canvas = layer.getCanvas();
        var context = layer.getContext();
        var elements = layer.getElements();
        if (context && canvas) {
            var screenSize = Global.getScreenSize();
            context.clearRect(0, 0, screenSize.width, screenSize.height);
            context.save();
            var camera = getCamera();
            // Smooth
            if (!layer.isSmooth()) {
                context.mozImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
            }
            // Sort elements by depth
            elements.sort(function (a, b) {
                a.depth = a.depth || 0;
                b.depth = b.depth || 0;
                if (a.depth < b.depth) {
                    return -1;
                }
                else if (a.depth > b.depth) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            // Camera management
            if (layer.affectedByCamera) {
                if (camera) {
                    // Translate to the scale position
                    context.translate(camera.getDepthPosition().x, camera.getDepthPosition().y);
                    // Scale the canvas
                    context.scale(camera.getDepth(), camera.getDepth());
                    // Rotate
                    context.translate(window.innerWidth / 2, window.innerHeight / 2);
                    context.rotate((camera.getRotation() * Math.PI) / 180);
                    context.translate(-window.innerWidth / 2, -window.innerHeight / 2);
                    // Rotate the canvas
                    if (camera.getRotation() != 0) {
                        var rotationPoint = camera.getRotationPoint();
                        context.translate(rotationPoint.x, rotationPoint.y);
                        context.rotate(camera.getRotation());
                        context.translate(-rotationPoint.x, -rotationPoint.y);
                    }
                }
            }
            // Draw every elements			
            if (elements) {
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i]) {
                        // Check if it's a normal drawable or a grid
                        elementToDraw = elements[i];
                        if (elementToDraw.getType() != "drawable") {
                            switch (elementToDraw.getType()) {
                                case "grid":
                                    var grid = elementToDraw;
                                    var tiles = grid.getTiles();
                                    for (var k = tiles.length - 1; k >= 0; k--) {
                                        //var pos = elementToDraw.getPosition();
                                        var posInGrid = tiles[k].getPositionIntoGrid();
                                        var pos = { x: posInGrid.x * grid.getTileSize(), y: posInGrid.y * grid.getTileSize() };
                                        elementToDraw = tiles[k].getAssignedDrawables()[0];
                                        var size = elementToDraw.getSize();
                                        // Gestion de la camera
                                        var renderPos = { x: pos.x, y: pos.y };
                                        if (layer.affectedByCamera && camera) {
                                            var cPos = camera.getPosition();
                                            var cameraDepth = camera.getDepth();
                                            // isFixed
                                            if (!elementToDraw.isFixed()) {
                                                renderPos.x = pos.x + ((canvas.width / 2) - cPos.x) / cameraDepth;
                                                renderPos.y = pos.y + ((canvas.height / 2) - cPos.y) / cameraDepth;
                                            }
                                        }
                                        drawElement(context, elementToDraw, renderPos, size);
                                    }
                                    break;
                                case "draw":
                                    var position = elementToDraw.getPosition();
                                    if (!position) {
                                        position = elementToDraw.absolutePosition;
                                    }
                                    // Check if it's a line
                                    var shape = elementToDraw.getShape();
                                    if (shape == "line") {
                                        var target = elementToDraw.getTarget();
                                        var targetTemp = {
                                            x: target.x,
                                            y: target.y
                                        };
                                    }
                                    var size = elementToDraw.getSize();
                                    var positionTemp = { x: position.x, y: position.y };
                                    // camera
                                    if (layer.affectedByCamera && camera) {
                                        var cameraPosition = camera.getPosition();
                                        // is drawable fixed
                                        if (!elementToDraw.isFixed()) {
                                            positionTemp.x = position.x + ((canvas.width / 2) - cameraPosition.x);
                                            positionTemp.y = position.y + ((canvas.height / 2) - cameraPosition.y);
                                            if (targetTemp && target) {
                                                targetTemp.x = target.x + ((canvas.width / 2) - cameraPosition.x);
                                                targetTemp.y = target.y + ((canvas.height / 2) - cameraPosition.y);
                                            }
                                        }
                                    }
                                    drawElement(context, elementToDraw, positionTemp, size, targetTemp);
                                    break;
                                default:
                                    // Draw each drawable of an element
                                    var assignedDrawables = elementToDraw.getAssignedDrawables();
                                    for (var k = 0; k < assignedDrawables.length; ++k) {
                                        if (assignedDrawables[k]) {
                                            var position = assignedDrawables[k].getPosition();
                                            var size = assignedDrawables[k].getSize();
                                            if (Render.getCamera()) {
                                                var cameraPosition = Render.getCamera().getPosition();
                                                var cameraDepth = Render.getCamera().getDepth();
                                                // is drawable fixed
                                                if (!assignedDrawables[k].isFixed()) {
                                                    position.x = position.x + ((canvas.width / 2) - cameraPosition.x) / cameraDepth;
                                                    position.y = position.y + ((canvas.height / 2) - cameraPosition.y) / cameraDepth;
                                                }
                                            }
                                            drawElement(context, assignedDrawables[k], position, size);
                                        }
                                    }
                                    break;
                            }
                        }
                        else {
                            // Draw a normal drawable
                            var elementPosition = elementToDraw.getPosition();
                            var size = elementToDraw.getSize();
                            // Gestion de la camera
                            if (layer.affectedByCamera && renderCamera) {
                                var cPos = renderCamera.getPosition();
                                var cameraDepth = renderCamera.getDepth();
                                // isFixed
                                if (!elementToDraw.isFixed()) {
                                    elementPosition.x = elementPosition.x + ((canvas.width / 2) - cPos.x) / cameraDepth;
                                    elementPosition.y = elementPosition.y + ((canvas.height / 2) - cPos.y) / cameraDepth;
                                }
                            }
                            drawElement(context, elementToDraw, elementPosition, size);
                        }
                    }
                }
            }
            // Draw debug for every elements
            if (debugMode.active) {
                for (var k = _elements.length - 1; k >= 0; k--) {
                    context.lineWidth = 2;
                    context.beginPath();
                    context.strokeStyle = "#00FF00";
                    var ePos = _elements[k].getPosition();
                    if (debugMode.type == "vertices") {
                        if (_elements[k].shapes[0] && _elements[k].shapes[0].vertices) {
                            var vertices = _elements[k].shapes[0].vertices;
                            var firstVert = true;
                            for (var i = 0; i < vertices.length; ++i) {
                                if (firstVert) {
                                    context.moveTo(ePos.x + vertices[i][0] + _elements[k].shapes[0].width / 2, ePos.y + vertices[i][1] + _elements[k].shapes[0].height / 2);
                                    firstVert = false;
                                }
                                else {
                                    context.lineTo(ePos.x + vertices[i][0] + _elements[k].shapes[0].width / 2, ePos.y + vertices[i][1] + _elements[k].shapes[0].height / 2);
                                }
                            }
                        }
                    }
                    else {
                        if (_elements[k].aabb && _elements[k].aabb.lowerBound[0] != 0) {
                            var aabb = _elements[k].aabb;
                            var lower = Global.getPositionFromWorld(aabb.lowerBound[0], aabb.lowerBound[1], renderCamera);
                            var upper = Global.getPositionFromWorld(aabb.upperBound[0], aabb.upperBound[1], renderCamera);
                            context.moveTo(lower.x, lower.y);
                            context.lineTo(upper.x, lower.y);
                            context.lineTo(upper.x, upper.y);
                            context.lineTo(lower.x, upper.y);
                        }
                    }
                    context.closePath();
                    context.stroke();
                }
            }
            context.restore();
        }
    }
    Render.updateRender = updateRender;
    function drawElement(context, elementToDraw, position, size, secondPosition) {
        if (secondPosition === void 0) { secondPosition = null; }
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        // Do the same calculations for the second position
        if (secondPosition) {
            secondPosition.x = Math.floor(secondPosition.x);
            secondPosition.y = Math.floor(secondPosition.y);
        }
        size.width = size.width || 1;
        size.height = size.height || 1;
        // Check if the element is out of the screen
        var camera = Render.getCamera();
        var cameraDepth = camera.getDepth();
        var depthPosition = camera.getDepthPosition();
        var tempPosition = { x: depthPosition.x, y: depthPosition.y };
        var cam = getCamera();
        var of = { x: 0, y: 0 };
        if (cam) {
            var depthPosition = cam.getDepthPosition();
            of.x = depthPosition.x;
            of.y = depthPosition.y;
        }
        if (position.x > -size.width - of.x && position.x <= Global.getScreenSize().width + size.width + of.x && position.y > -size.height - of.y && position.y <= Global.getScreenSize().height + size.height + of.y) {
            if (elementToDraw.isVisible(null)) {
                context.save();
                // opacity
                context.globalAlpha = elementToDraw.getOpacity();
                // smooth
                if (!elementToDraw.isSmooth()) {
                    context.mozImageSmoothingEnabled = false;
                    context.imageSmoothingEnabled = false;
                }
                // flipped
                if (elementToDraw.isFlipped(null)) {
                    context.scale(-1, 1);
                    position.x = -position.x - size.width;
                    if (secondPosition) {
                        secondPosition.x = -secondPosition.x - size.width;
                    }
                }
                var rotationPoint = elementToDraw.getRotationPoint();
                if (elementToDraw.fixedToCenter) {
                    rotationPoint.x = position.x + (size.width / 2);
                    rotationPoint.y = position.y + (size.height / 2);
                }
                if (elementToDraw.getRotation() != 0) {
                    context.translate(rotationPoint.x, rotationPoint.y);
                    context.rotate(elementToDraw.getRotation() * (Math.PI / 180));
                    context.translate(-rotationPoint.x, -rotationPoint.y);
                }
                if (elementToDraw.getType() == "draw") {
                    context.fillStyle = elementToDraw.getColor();
                    // stroke
                    if (elementToDraw.getStrokeSize() != 0) {
                        context.lineWidth = elementToDraw.getStrokeSize();
                        context.strokeStyle = elementToDraw.getStrokeColor();
                    }
                    // shadow
                    if (elementToDraw.isShadowEnabled()) {
                        context.shadowColor = elementToDraw.getShadowColor();
                        context.shadowBlur = elementToDraw.getShadowBlur();
                        context.shadowOffsetX = elementToDraw.getShadowPosition().x;
                        context.shadowOffsetY = elementToDraw.getShadowPosition().y;
                    }
                    switch (elementToDraw.getShape()) {
                        case "rectangle":
                            context.beginPath();
                            context.rect(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)), Math.ceil(size.width), Math.ceil(size.height));
                            context.closePath();
                            break;
                        case "circle":
                            context.beginPath();
                            context.arc(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)), elementToDraw.getRadius(), 0, 2 * Math.PI, false);
                            context.closePath();
                            break;
                        case "polygon":
                            context.beginPath();
                            for (var i = 0; i < elementToDraw.getVertices().length; ++i) {
                                var vertice = elementToDraw.getVertices()[i];
                                if (i == 0) {
                                    context.moveTo(vertice.x + position.x, vertice.y + position.y);
                                }
                                else {
                                    context.lineTo(vertice.x + position.x, vertice.y + position.y);
                                }
                            }
                            context.closePath();
                            break;
                        case "line":
                            context.beginPath();
                            context.moveTo(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)));
                            context.lineTo(Math.ceil(secondPosition.x), Math.ceil(secondPosition.y));
                            context.closePath();
                            break;
                        case "text":
                            context.font = elementToDraw.getFontStyle() + " " + elementToDraw.getFontSize() + "px " + elementToDraw.getFont();
                            context.textBaseline = elementToDraw.getBaseline();
                            if (elementToDraw.getStrokeSize() != 0) {
                                context.strokeText(elementToDraw.getValue(), Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)));
                            }
                            var myText = new String(elementToDraw.getValue());
                            var length = elementToDraw.getValue().length;
                            var lineHeight = elementToDraw.getFontSize();
                            var lineWidth = length * lineHeight;
                            var size = elementToDraw.getSize();
                            var numberLines = Math.ceil(lineWidth / size.width);
                            var numberOfCharacterInOneLine = Math.floor(size.width / lineHeight) * 1.8;
                            var lines = [];
                            if (lineWidth > size.width) {
                                numberLines = numberLines - 1;
                            }
                            for (var i = 0; i < numberLines; i++) {
                                lines[i] = [];
                            }
                            ;
                            var currentLetter = 0;
                            var currentLine = 0;
                            for (var letter = 0; letter < myText.length; letter++) {
                                if (currentLetter < numberOfCharacterInOneLine) {
                                    lines[currentLine].push(myText[letter]);
                                    currentLetter++;
                                }
                                else {
                                    currentLetter = 0;
                                    currentLine++;
                                    if (!lines[currentLine]) {
                                        lines[currentLine] = [];
                                    }
                                    lines[currentLine].push(myText[letter]);
                                }
                            }
                            ;
                            var align = elementToDraw.getAlign();
                            var verticalAlign = elementToDraw.getVerticalAlign();
                            context.textAlign = align;
                            var linesHeight = lineHeight * lines.length;
                            var offsetPosition = { x: 0, y: 0 };
                            for (var i = 0; i < lines.length; i++) {
                                var myString = "";
                                for (var k = 0; k < lines[i].length; k++) {
                                    myString = myString + lines[i][k];
                                }
                                ;
                                if (verticalAlign == "middle") {
                                    offsetPosition.y = offsetPosition.y + lineHeight;
                                }
                                if (align == "center") {
                                    offsetPosition.x = (size.width / 2);
                                }
                                context.fillText(myString, Math.ceil(rotationPoint.x - (size.width / 2)) + offsetPosition.x, (Math.ceil(rotationPoint.y - (size.height / 2)) + (i * lineHeight) - (lineHeight / 4)) + offsetPosition.y);
                            }
                            ;
                            break;
                        case "point":
                            context.beginPath();
                            context.moveTo(Math.ceil(rotationPoint.x - (size.width / 2)) - 5, Math.ceil(rotationPoint.y - (size.height / 2)));
                            context.lineTo(Math.ceil(rotationPoint.x - (size.width / 2)) + 5, Math.ceil(rotationPoint.y - (size.height / 2)));
                            context.moveTo(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)) - 5);
                            context.lineTo(Math.ceil(rotationPoint.x - (size.width / 2)), Math.ceil(rotationPoint.y - (size.height / 2)) + 5);
                            context.closePath();
                            break;
                    }
                    if (elementToDraw.getShape() != "text") {
                        context.fill();
                    }
                    if (elementToDraw.getStrokeSize() != 0) {
                        context.stroke();
                    }
                }
                else {
                    var futurPosition = null;
                    if (elementToDraw.getRotation() != 0) {
                        futurPosition = { x: rotationPoint.x - (size.width / 2), y: rotationPoint.y - (size.height / 2) };
                    }
                    else {
                        futurPosition = position;
                    }
                    if (elementToDraw.getData() != false) {
                        if (elementToDraw.isSprite()) {
                            var currentFrame = elementToDraw.getCurrentFrame();
                            var frameSize = elementToDraw.getFrameSize();
                            var frameLine = elementToDraw.getFrameLine();
                            context.drawImage(elementToDraw.getData(), Math.ceil(frameSize.width * currentFrame), Math.ceil(frameSize.height * frameLine), Math.ceil(frameSize.width), Math.ceil(frameSize.height), Math.ceil(futurPosition.x), Math.ceil(futurPosition.y), Math.ceil(size.width), Math.ceil(size.height));
                        }
                        else {
                            var cropArea = null;
                            if (elementToDraw.isCropped()) {
                                cropArea = elementToDraw.getCrop();
                            }
                            else {
                                cropArea = { x: 0, y: 0, width: elementToDraw.getData().width, height: elementToDraw.getData().height };
                            }
                            context.drawImage(elementToDraw.getData(), cropArea.x, cropArea.y, cropArea.width, cropArea.height, Math.ceil(futurPosition.x), Math.ceil(futurPosition.y), Math.ceil(size.width), Math.ceil(size.height));
                        }
                    }
                }
                // debug mode for drawable
                if (debugMode.active) {
                    context.lineWidth = 4;
                    context.strokeStyle = "#FF0000";
                    var pos = position;
                    /*if(typeof elementToDraw.getShape() != "undefined"){
                        if(elementToDraw.getShape() == "circle"){
                            pos.x = pos.x - elementToDraw.getRadius();
                            pos.y = pos.y - elementToDraw.getRadius();
                        }
                    }
                    else{
                        console.log("RENDER FAILED", elementToDraw);
                    }*/
                    context.strokeRect(pos.x, pos.y, size.width, size.height);
                }
                context.restore();
            }
        }
        else {
            return;
        }
    }
})(Render || (Render = {}));
var Render;
(function (Render) {
    var layers = [];
    /*    --------------------------------------------------- *\
            [class] Layer()
    
            * Crée un layer *
    
    \*    --------------------------------------------------- */
    var Layer = (function () {
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un layer *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Layer() {
            this.elements = [];
            this.canvasElement = document.createElement("canvas");
            this.context = this.canvasElement.getContext("2d");
            this.canvasElement.width = window.innerWidth;
            this.canvasElement.height = window.innerHeight;
            document.body.appendChild(this.canvasElement);
            this.render();
            this.smooth = true;
            this.affectedByCamera = false;
            layers.push(this);
        }
        Layer.prototype.render = function () {
            var _this = this;
            Render.updateRender(this);
            window.requestAnimationFrame(function () {
                _this.render();
            });
        };
        /*    --------------------------------------------------- *\
                [function] set()
        
                * Set un element dans le layout *
        
                Return: nil
        \*    --------------------------------------------------- */
        Layer.prototype.set = function (element) {
            this.elements.push(element);
        };
        /*    --------------------------------------------------- *\
                [function] del()
        
                * Delete un element du layout *
        
                Return: nil
        \*    --------------------------------------------------- */
        Layer.prototype.del = function (element) {
            for (var i = this.elements.length - 1; i >= 0; i--) {
                if (this.elements[i] == element) {
                    this.elements.splice(i, 1);
                    delete this.elements[i];
                }
            }
        };
        /*    --------------------------------------------------- *\
                [function] getContext()
        
                * Retourne le context du layer *
        
                Return: context
        \*    --------------------------------------------------- */
        Layer.prototype.getContext = function () {
            return this.context;
        };
        /*    --------------------------------------------------- *\
                [function] getCanvas()
        
                * Retourne le canvas du layer *
        
                Return: canvas
        \*    --------------------------------------------------- */
        Layer.prototype.getCanvas = function () {
            return this.canvasElement;
        };
        /*    --------------------------------------------------- *\
                [function] getElements()
        
                * Retourne la liste de tous les elementsn *
        
                Return: elements
        \*    --------------------------------------------------- */
        Layer.prototype.getElements = function () {
            return this.elements;
        };
        /*    --------------------------------------------------- *\
                [function] setSmooth(value)
        
                * Set toute le canvas en smooth ou pixelated *
        
                Return: nil
        \*    --------------------------------------------------- */
        Layer.prototype.setSmooth = function (value) {
            this.smooth = value;
        };
        /*    --------------------------------------------------- *\
                [function] isSmooth()
        
                * Retourne si le canvas est smooth ou pixelated *
        
                Return: true, false
        \*    --------------------------------------------------- */
        Layer.prototype.isSmooth = function () {
            return this.smooth;
        };
        return Layer;
    }());
    Render.Layer = Layer;
})(Render || (Render = {}));
var Render;
(function (Render) {
    var image_prefix = "./";
    /*	--------------------------------------------------- *\
            [class] Texture()
    
            * Create an image element *
    
    \*	--------------------------------------------------- */
    var Texture = (function () {
        /*	--------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une texture *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Texture(src) {
            this.src = image_prefix + src;
            this.data = new Image();
            this.data.src = image_prefix + src;
        }
        /*	--------------------------------------------------- *\
                [function] getData()
        
                * Retourne l'image *
        
                Return: data
        \*	--------------------------------------------------- */
        Texture.prototype.getData = function () {
            if (this.data) {
                return this.data;
            }
            else {
                return false;
            }
        };
        /*	--------------------------------------------------- *\
                [function] setSrc(src)
        
                * Set une nouvelle src pour la texture *
        
                Return: nil
        \*	--------------------------------------------------- */
        Texture.prototype.setSrc = function (src) {
            this.data.src = image_prefix + src;
            this.src = image_prefix + src;
        };
        /*	--------------------------------------------------- *\
                [event] onLoad()
        
                * Quand la texture est chargé *
        
        \*	--------------------------------------------------- */
        Texture.prototype.onLoad = function (functionToCall) {
            var func = functionToCall;
            var texture = this;
            this.getData().addEventListener("load", function () {
                func(texture);
            });
        };
        return Texture;
    }());
    Render.Texture = Texture;
})(Render || (Render = {}));
var Render;
(function (Render) {
    /*	--------------------------------------------------- *\
            [class] Drawable()
    
            * Crée un element drawable a un emplacement donnée *
    
    \*	--------------------------------------------------- */
    var Drawable = (function () {
        /*	--------------------------------------------------- *\
                [function] constructor(texture, x, y, width, height)
        
                * Quand une texture est crée *
        
                Return: true, false
        \*	--------------------------------------------------- */
        function Drawable(texture) {
            var parameters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parameters[_i - 1] = arguments[_i];
            }
            this.texture = texture;
            if (texture == null) {
                this.setSize(0, 0);
            }
            else {
                this.setSize(texture.getData().width, texture.getData().height);
            }
            this.setPosition(0, 0);
            if (parameters[0] != null && parameters[1] != null) {
                this.setPosition(parameters[0], parameters[1]);
            }
            if (parameters[2] != null && parameters[3] != null) {
                this.setSize(parameters[2], parameters[3]);
            }
            this.depth = 0;
            this.rotation = 0;
            this.opacity = 1;
            this.type = "drawable";
            this.flipped = false;
            this.fixedToCenter = true;
            this.rotationPoint = { x: 0, y: 0 };
            this.visible = true;
            this.smooth = true;
            this.offset = { x: 0, y: 0 };
            this.haveCrop = false;
            this.crop = { x: 0, y: 0, width: this.size.width, height: this.size.height };
        }
        /*	--------------------------------------------------- *\
                [function] isCropped()
        
                * Check if the element is cropped *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Drawable.prototype.isCropped = function () {
            return this.haveCrop;
        };
        /*	--------------------------------------------------- *\
                [function] setCrop(x,y, width, height)
        
                * Set the crop area *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setCrop = function (x, y, width, height) {
            this.haveCrop = true;
            this.crop = { x: x, y: y, width: width, height: height };
        };
        /*	--------------------------------------------------- *\
                [function] getCrop()
        
                * Return the crop area *
        
                Return: crop
        \*	--------------------------------------------------- */
        Drawable.prototype.getCrop = function () {
            return this.crop;
        };
        /*	--------------------------------------------------- *\
                [function] getOffset()
        
                * Return the offset *
        
                Return: x, y
        \*	--------------------------------------------------- */
        Drawable.prototype.getOffset = function () {
            return this.offset;
        };
        /*	--------------------------------------------------- *\
                [function] setOffset(x, y)
        
                * Set the offset *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Drawable.prototype.setOffset = function (x, y) {
            this.offset = { x: x, y: y };
        };
        /*	--------------------------------------------------- *\
                [function] setPosition(x, y)
        
                * Set la position de la texture *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setPosition = function (x, y) {
            this.position = { x: x, y: y };
        };
        /*	--------------------------------------------------- *\
                [function] getPosition()
        
                * Retourne la position de la texture *
        
                Return: position
        \*	--------------------------------------------------- */
        Drawable.prototype.getPosition = function () {
            return this.position;
        };
        /*	--------------------------------------------------- *\
                [function] getSize()
        
                * Retourne la taille de la texture *
        
                Return: size
        \*	--------------------------------------------------- */
        Drawable.prototype.getSize = function () {
            return this.size;
        };
        /*	--------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set la taille de la texture *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setSize = function (width, height) {
            this.size = { width: width, height: height };
        };
        /*	--------------------------------------------------- *\
                [function] getData()
        
                * Retourne la texture en elle même *
        
                Return: image
        \*	--------------------------------------------------- */
        Drawable.prototype.getData = function () {
            if (this.texture === null) {
                return false;
            }
            else {
                return this.texture.getData();
            }
        };
        /*	--------------------------------------------------- *\
                [function] getDepth()
        
                * Retourne la profondeur de champ *
        
                Return: depth
        \*	--------------------------------------------------- */
        Drawable.prototype.getDepth = function () {
            return this.depth;
        };
        /*	--------------------------------------------------- *\
                [function] setDepth(depth)
        
                * Set la profondeur de champ *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setDepth = function (depth) {
            this.depth = depth;
        };
        /*	--------------------------------------------------- *\
                [function] setRotation(angle)
        
                * Set la rotation de la texture *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setRotation = function (angle) {
            this.rotation = angle;
        };
        /*	--------------------------------------------------- *\
                [function] getRotation()
        
                * Retourne la rotation *
        
                Return: rotation
        \*	--------------------------------------------------- */
        Drawable.prototype.getRotation = function () {
            return this.rotation;
        };
        /*	--------------------------------------------------- *\
                [function] getOpacity()
        
                * Retourne l'opacity *
        
                Return: opacity
        \*	--------------------------------------------------- */
        Drawable.prototype.getOpacity = function () {
            return this.opacity;
        };
        /*	--------------------------------------------------- *\
                [function] setOpacity(opacity)
        
                * Set l'opacité de la texture *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setOpacity = function (opacity) {
            this.opacity = opacity;
        };
        /*	--------------------------------------------------- *\
                [function] isSprite()
        
                * Retourne si la texture est partielle ou complète *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Drawable.prototype.isSprite = function (sprite) {
            if (sprite == true || sprite == false) {
                this.sprite = sprite;
            }
            else {
                return this.sprite;
            }
        };
        /*	--------------------------------------------------- *\
                [function] setFixed()
        
                * Set la texture fixé à l'écran *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setFixed = function (isFixed) {
            this.fixed = isFixed;
        };
        /*	--------------------------------------------------- *\
                [function] isFixed()
        
                * Check si la texture est fixé a l'écran *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Drawable.prototype.isFixed = function () {
            return this.fixed;
        };
        /*    --------------------------------------------------- *\
               [function] setType(type)
       
               * Set le type de l'element *
       
               Return: nil
       \*    --------------------------------------------------- */
        Drawable.prototype.setType = function (type) {
            this.type = type;
        };
        /*    --------------------------------------------------- *\
                [function] getType()
        
                * Retourne le type de l'element *
        
                Return: type
        \*    --------------------------------------------------- */
        Drawable.prototype.getType = function () {
            return this.type;
        };
        /*	--------------------------------------------------- *\
                [function] isFlipped(boolean)
        
                * Check/set si l'element est verticalement inversé *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Drawable.prototype.isFlipped = function (value) {
            if (value == true || value == false) {
                this.flipped = value;
            }
            else {
                return this.flipped;
            }
        };
        /*    --------------------------------------------------- *\
                [function] setRotationPoint(x, y)
        
                * Set le point de rotation du drawable *
        
                Return: nil
        \*    --------------------------------------------------- */
        Drawable.prototype.setRotationPoint = function (x, y) {
            this.fixedToCenter = false;
            this.rotationPoint = { x: x, y: y };
        };
        /*    --------------------------------------------------- *\
                [function] getRotationPoint()
        
                * Retourne le point de rotation du drawable *
        
                Return: rotationPoint
        \*    --------------------------------------------------- */
        Drawable.prototype.getRotationPoint = function () {
            return this.rotationPoint;
        };
        /*	--------------------------------------------------- *\
                [function] isVisible()
        
                * Check si le drawable est visible *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Drawable.prototype.isVisible = function () {
            return this.visible;
        };
        /*	--------------------------------------------------- *\
                [function] setVisibl(value)
        
                * Set ou non le drawable en visible *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setVisible = function (value) {
            this.visible = value;
        };
        /*	--------------------------------------------------- *\
                [function] setLayout(layout)
        
                * Set le layout du drawable *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setLayout = function (layout) {
            this.layout = layout;
        };
        /*	--------------------------------------------------- *\
                [function] setSmooth(boolean)
        
                * Set si le drawable est smooth ou pixelated *
        
                Return: nil
        \*	--------------------------------------------------- */
        Drawable.prototype.setSmooth = function (value) {
            this.smooth = value;
        };
        /*	--------------------------------------------------- *\
                [function] isSmooth()
        
                * Retourne si le drawable est smooth ou pas *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Drawable.prototype.isSmooth = function () {
            return this.smooth;
        };
        return Drawable;
    }());
    Render.Drawable = Drawable;
})(Render || (Render = {}));
var Render;
(function (Render) {
    /*	--------------------------------------------------- *\
            [class] Sprite()
    
            * Crée une texture de type Sprite *
    
    \*	--------------------------------------------------- */
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        /*	--------------------------------------------------- *\
                [function] constructor(texture [optional : posX, posY, width, height, frameSizeX, frameSizeY, frameAmount, frameLine])
        
                * Quand on crée un sprite *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Sprite(texture) {
            var parameters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parameters[_i - 1] = arguments[_i];
            }
            _super.call(this, texture);
            this.sprite = true;
            this.currentFrame = 0;
            this.fps = 10;
            this.frameLine = parameters[7] || 0;
            this.position = { x: parameters[0], y: parameters[1] } || this.position;
            this.size = { width: parameters[2], height: parameters[3] } || this.size;
            this.frameSize = { width: parameters[4], height: parameters[5] };
            this.frameAmount = parameters[6] || 0;
            this.loop = false;
            this.loopFinished = false;
            var cache = this;
            this.currentInterval = setInterval(function () {
                var currentFrame = cache.getCurrentFrame();
                if (cache.loop) {
                    if (cache.loopFinished == false) {
                        cache.setCurrentFrame(currentFrame += 1);
                        if (currentFrame == cache.getFrameAmount() - 1) {
                            cache.loopFinished = true;
                        }
                    }
                    else {
                    }
                }
                else {
                    cache.setCurrentFrame(currentFrame += 1);
                }
            }, 1000 / this.fps);
        }
        /*	--------------------------------------------------- *\
                [function] setFrameSize(width, height)
        
                * Set la taille d'une frame *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sprite.prototype.setFrameSize = function (width, height) {
            this.frameSize = { width: width, height: height };
        };
        /*	--------------------------------------------------- *\
                [function] getFrameSize()
        
                * Retourne la taille d'une frame *
        
                Return: frameSize
        \*	--------------------------------------------------- */
        Sprite.prototype.getFrameSize = function () {
            return this.frameSize;
        };
        /*	--------------------------------------------------- *\
                [function] setFrameAmount(frameAmount)
        
                * Set le nombre de frames dans la sprite *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sprite.prototype.setFrameAmount = function (frameAmount) {
            this.frameAmount = frameAmount;
        };
        /*	--------------------------------------------------- *\
                [function] getFrameAmount()
        
                * Retourne le nombre de frames dans la sprite *
        
                Return: frameAmount
        \*	--------------------------------------------------- */
        Sprite.prototype.getFrameAmount = function () {
            return this.frameAmount;
        };
        /*	--------------------------------------------------- *\
                [function] setCurrentFrame(frame)
        
                * Set la frame actuelle *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sprite.prototype.setCurrentFrame = function (frame) {
            if (frame >= this.frameAmount) {
                this.currentFrame = 0;
            }
            else {
                this.currentFrame = frame;
            }
        };
        /*	--------------------------------------------------- *\
                [function] getCurrentFrame()
        
                * Retourne la frame actuelle *
        
                Return: frame
        \*	--------------------------------------------------- */
        Sprite.prototype.getCurrentFrame = function () {
            return this.currentFrame;
        };
        /*	--------------------------------------------------- *\
                [function] setFrameLine(line)
        
                * Set la ligne de la frame *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sprite.prototype.setFrameLine = function (line) {
            this.frameLine = line;
        };
        /*	--------------------------------------------------- *\
                [function] getFrameLine()
        
                * Retourne la ligne de la frame *
        
                Return: line
        \*	--------------------------------------------------- */
        Sprite.prototype.getFrameLine = function () {
            return this.frameLine;
        };
        /*	--------------------------------------------------- *\
                [function] setFrameSpeed(fps)
        
                * Set le nombre de frame par secondes *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sprite.prototype.setFrameSpeed = function (fps) {
            this.fps = fps;
            var cache = this;
            clearInterval(this.currentInterval);
            this.currentInterval = setInterval(function () {
                var currentFrame = cache.getCurrentFrame();
                if (cache.loop) {
                    if (cache.loopFinished == false) {
                        cache.setCurrentFrame(currentFrame += 1);
                        if (currentFrame == cache.getFrameAmount() - 1) {
                            cache.loopFinished = true;
                        }
                    }
                    else {
                    }
                }
                else {
                    cache.setCurrentFrame(currentFrame += 1);
                }
            }, 1000 / this.fps);
        };
        /*	--------------------------------------------------- *\
                [function] getFrameSpeed()
        
                * Retourne le nombre de frames par secondes *
        
                Return: fps
        \*	--------------------------------------------------- */
        Sprite.prototype.getFrameSpeed = function () {
            return this.fps;
        };
        /*    --------------------------------------------------- *\
                [function] setFreeze()
        
                * Freeze la sprite sur une frame *
        
                Return: nil
        \*    --------------------------------------------------- */
        Sprite.prototype.setFreeze = function (value) {
            this.freezed = value;
            if (value) {
                clearInterval(this.currentInterval);
            }
            else {
                this.setFrameSpeed(this.fps);
            }
        };
        /*	--------------------------------------------------- *\
                [function] setUniqueLoop(boolean)
        
                * Check/set une unique loop *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Sprite.prototype.setUniqueLoop = function (loop) {
            this.loop = loop;
        };
        /*	--------------------------------------------------- *\
                [function] playUniqueLoop()
        
                * Joue l'animation unique *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sprite.prototype.playUniqueLoop = function () {
            if (this.loop) {
                this.loopFinished = false;
                this.setCurrentFrame(0);
            }
        };
        return Sprite;
    }(Render.Drawable));
    Render.Sprite = Sprite;
})(Render || (Render = {}));
var Render;
(function (Render) {
    var Draw;
    (function (Draw_1) {
        /*	--------------------------------------------------- *\
                [class] Draw()
        
                * Dessiner une forme *
        
        \*	--------------------------------------------------- */
        var Draw = (function (_super) {
            __extends(Draw, _super);
            /*	--------------------------------------------------- *\
                    [function] constructor()
            
                    * Quand on crée un Draw *
            
                    Return: nil
            \*	--------------------------------------------------- */
            function Draw() {
                _super.call(this, null);
                this.type = "draw";
                this.shape = null;
                this.strokeSize = 0;
                this.color = "#000";
                this.shadowEnabled = false;
                this.shadowColor = "#000000";
                this.shadowBlur = 0;
                this.shadowPosition = { x: 0, y: 0 };
            }
            /*	--------------------------------------------------- *\
                    [function] setColor(hexdecimal)
            
                    * Set la couleur de la forme *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.setColor = function (color) {
                this.color = color;
            };
            /*	--------------------------------------------------- *\
                    [function] getColor()
            
                    * Get la couleur de la forme *
            
                    Return: color
            \*	--------------------------------------------------- */
            Draw.prototype.getColor = function () {
                return this.color;
            };
            /*	--------------------------------------------------- *\
                    [function] setStrokeSize(size)
            
                    * Set la taille de la bordure *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.setStrokeSize = function (size) {
                this.strokeSize = size;
            };
            /*	--------------------------------------------------- *\
                    [function] getStrokeSize()
            
                    * Retourne la taille de la bordure *
            
                    Return: strokeSize
            \*	--------------------------------------------------- */
            Draw.prototype.getStrokeSize = function () {
                return this.strokeSize;
            };
            /*	--------------------------------------------------- *\
                    [function] setStrokeColor(color)
            
                    * Set la couleur de la bordure *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.setStrokeColor = function (color) {
                this.strokeColor = color;
            };
            /*	--------------------------------------------------- *\
                    [function] getStrokeColor()
            
                    * Retourne la couleur de la bordure *
            
                    Return: color
            \*	--------------------------------------------------- */
            Draw.prototype.getStrokeColor = function () {
                return this.strokeColor;
            };
            /*	--------------------------------------------------- *\
                    [function] getShape()
            
                    * Retourne le type de forme *
            
                    Return: shape
            \*	--------------------------------------------------- */
            Draw.prototype.getShape = function () {
                return this.shape;
            };
            /*	--------------------------------------------------- *\
                    [function] setShadow(value)
            
                    * Set un shadow ou non *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.setShadow = function (value) {
                this.shadowEnabled = value;
            };
            /*	--------------------------------------------------- *\
                    [function] isShadowEnabled()
            
                    * Retourne si le shadow est activé *
            
                    Return: true, false
            \*	--------------------------------------------------- */
            Draw.prototype.isShadowEnabled = function () {
                return this.shadowEnabled;
            };
            /*	--------------------------------------------------- *\
                    [function] setShadowColor(color)
            
                    * Set la couleur de la shadow *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.setShadowColor = function (color) {
                this.shadowColor = color;
            };
            /*	--------------------------------------------------- *\
                    [function] getShadowColor()
            
                    * Retourne la couleur de la shadow *
            
                    Return: color
            \*	--------------------------------------------------- */
            Draw.prototype.getShadowColor = function () {
                return this.shadowColor;
            };
            /*	--------------------------------------------------- *\
                    [function] setShadowBlur(size)
            
                    * Set la taille du blur du shadow *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.setShadowBlur = function (size) {
                this.shadowBlur = size;
            };
            /*	--------------------------------------------------- *\
                    [function] getShadowBlur()
            
                    * Retourne le blur du shadow *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.getShadowBlur = function () {
                return this.shadowBlur;
            };
            /*	--------------------------------------------------- *\
                    [function] setShadowPosition(x, y)
            
                    * Set la position du shadow *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Draw.prototype.setShadowPosition = function (x, y) {
                this.shadowPosition = { x: x, y: y };
            };
            /*	--------------------------------------------------- *\
                    [function] getShadowPosition()
            
                    * Retourne la position du shadow *
            
                    Return: position
            \*	--------------------------------------------------- */
            Draw.prototype.getShadowPosition = function () {
                return this.shadowPosition;
            };
            return Draw;
        }(Render.Drawable));
        Draw_1.Draw = Draw;
    })(Draw = Render.Draw || (Render.Draw = {}));
})(Render || (Render = {}));
var Render;
(function (Render) {
    var Draw;
    (function (Draw) {
        /*	--------------------------------------------------- *\
                [class] Rectangle()
        
                * Dessiner un rectangle *
        
        \*	--------------------------------------------------- */
        var Rectangle = (function (_super) {
            __extends(Rectangle, _super);
            /*	--------------------------------------------------- *\
                    [function] constructor([optional : position.x, position.y, size.width, size.height, color])
            
                    * Quand on crée un rectangle *
            
                    Return: nil
            \*	--------------------------------------------------- */
            function Rectangle() {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i - 0] = arguments[_i];
                }
                _super.call(this);
                this.shape = "rectangle";
                this.position.x = parameters[0] || this.position.x;
                this.position.y = parameters[1] || this.position.y;
                this.size.width = parameters[2] || this.size.width;
                this.size.height = parameters[3] || this.size.height;
                this.setColor(parameters[4] || "#FFFFFF");
            }
            return Rectangle;
        }(Draw.Draw));
        Draw.Rectangle = Rectangle;
    })(Draw = Render.Draw || (Render.Draw = {}));
})(Render || (Render = {}));
var Render;
(function (Render) {
    var Draw;
    (function (Draw) {
        /*	--------------------------------------------------- *\
                [class] Circle()
        
                * Dessiner un cercle *
        
        \*	--------------------------------------------------- */
        var Circle = (function (_super) {
            __extends(Circle, _super);
            /*	--------------------------------------------------- *\
                    [function] constructor([optional : position.x, position.y, radius])
            
                    * Quand on crée un cercle *
            
                    Return: nil
            \*	--------------------------------------------------- */
            function Circle() {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i - 0] = arguments[_i];
                }
                _super.call(this);
                this.shape = "circle";
                this.position.x = parameters[0] || this.position.x;
                this.position.y = parameters[1] || this.position.y;
                this.radius = parameters[2] || this.radius;
                this.setSize(this.getRadius() * 2, this.getRadius() * 2);
            }
            /*	--------------------------------------------------- *\
                    [function] setRadius(radius)
            
                    * Set le radius du cercle *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Circle.prototype.setRadius = function (radius) {
                this.radius = radius;
            };
            /*	--------------------------------------------------- *\
                    [function] getRadius()
            
                    * Retourne le radius du cercle *
            
                    Return: radius
            \*	--------------------------------------------------- */
            Circle.prototype.getRadius = function () {
                return this.radius;
            };
            return Circle;
        }(Draw.Draw));
        Draw.Circle = Circle;
    })(Draw = Render.Draw || (Render.Draw = {}));
})(Render || (Render = {}));
var Render;
(function (Render) {
    var Draw;
    (function (Draw) {
        /*	--------------------------------------------------- *\
                [class] Polygon()
        
                * Crée un polygone *
        
        \*	--------------------------------------------------- */
        var Polygon = (function (_super) {
            __extends(Polygon, _super);
            /*	--------------------------------------------------- *\
                    [function] constructor(vertices)
            
                    * Quand on crée un polygone *
            
                    Return: nil
            \*	--------------------------------------------------- */
            function Polygon(vertices) {
                _super.call(this);
                this.shape = "polygon";
                this.vertices = vertices;
                // find width / height
                var xVertices = [];
                var yVertices = [];
                for (var i = 0; i < this.vertices.length; ++i) {
                    xVertices.push(this.vertices[i].x);
                    yVertices.push(this.vertices[i].y);
                }
                var xmin = Math.min.apply(null, xVertices);
                var xmax = Math.max.apply(null, xVertices);
                var ymin = Math.min.apply(null, yVertices);
                var ymax = Math.max.apply(null, yVertices);
                this.setSize(xmax - xmin, ymax - ymin);
            }
            /*	--------------------------------------------------- *\
                    [function] getVertices()
            
                    * Retourne toute les vertices *
            
                    Return: vertices
            \*	--------------------------------------------------- */
            Polygon.prototype.getVertices = function () {
                return this.vertices;
            };
            /*	--------------------------------------------------- *\
                    [function] setVerticePosition(vertice, x, y)
            
                    * Set the position of a specific vertice *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Polygon.prototype.setVerticePosition = function (vertice, x, y) {
                if (this.vertices[vertice]) {
                    this.vertices[vertice].x = x;
                    this.vertices[vertice].y = y;
                }
            };
            return Polygon;
        }(Draw.Draw));
        Draw.Polygon = Polygon;
    })(Draw = Render.Draw || (Render.Draw = {}));
})(Render || (Render = {}));
var Render;
(function (Render) {
    var Draw;
    (function (Draw) {
        /*	--------------------------------------------------- *\
                [class] Line()
        
                * Dessiner une ligne *
        
        \*	--------------------------------------------------- */
        var Line = (function (_super) {
            __extends(Line, _super);
            /*	--------------------------------------------------- *\
                    [function] constructor([optional : position.x, position.y, target.x, target.y])
            
                    * Quand on crée une ligne *
            
                    Return: nil
            \*	--------------------------------------------------- */
            function Line() {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i - 0] = arguments[_i];
                }
                _super.call(this);
                this.target = { x: null, y: null };
                this.shape = "line";
                this.position.x = parameters[0] || this.position.x;
                this.position.y = parameters[1] || this.position.y;
                this.target.x = parameters[2] || this.target.x;
                this.target.y = parameters[3] || this.target.y;
            }
            /*	--------------------------------------------------- *\
                    [function] setTarget(x, y)
            
                    * Set la fin de la ligne *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Line.prototype.setTarget = function (x, y) {
                this.target = { x: x, y: y };
            };
            /*	--------------------------------------------------- *\
                    [function] getTarget()
            
                    * Retourne la position de la fin de la ligne *
            
                    Return: target
            \*	--------------------------------------------------- */
            Line.prototype.getTarget = function () {
                return this.target;
            };
            return Line;
        }(Draw.Draw));
        Draw.Line = Line;
    })(Draw = Render.Draw || (Render.Draw = {}));
})(Render || (Render = {}));
var Render;
(function (Render) {
    var Draw;
    (function (Draw) {
        /*	--------------------------------------------------- *\
                [class] Text()
        
                * Ecrire du texte *
        
        \*	--------------------------------------------------- */
        var Text = (function (_super) {
            __extends(Text, _super);
            /*	--------------------------------------------------- *\
                    [function] constructor([optional : position.x, position.y, texte, width, height])
            
                    * Quand on ecrit du texte *
            
                    Return: nil
            \*	--------------------------------------------------- */
            function Text() {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i - 0] = arguments[_i];
                }
                _super.call(this);
                this.shape = "text";
                this.value = "";
                this.setFont("Arial");
                this.setFontSize(15);
                this.fontStyle = "normal";
                this.setBaseline("top");
                this.setAlign("start");
                this.setVerticalAlign("top");
                this.position.x = parameters[0] || this.position.x;
                this.position.y = parameters[1] || this.position.y;
                if (parameters[3] && parameters[4]) {
                    this.setSize(parameters[3], parameters[4]);
                }
                this.value = parameters[2] || this.value;
            }
            /*	--------------------------------------------------- *\
                    [function] getValue()
            
                    * Retourne la valeur du texte *
            
                    Return: value
            \*	--------------------------------------------------- */
            Text.prototype.getValue = function () {
                return this.value;
            };
            /*	--------------------------------------------------- *\
                    [function] setValue(value)
            
                    * Set la valeur du texte *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setValue = function (value) {
                this.value = value;
            };
            /*	--------------------------------------------------- *\
                    [function] setFont(fontName)
            
                    * Set la font du text *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setFont = function (fontName) {
                this.font = fontName;
            };
            /*	--------------------------------------------------- *\
                    [function] getFont()
            
                    * Retourne la font du text *
            
                    Return: font
            \*	--------------------------------------------------- */
            Text.prototype.getFont = function () {
                return this.font;
            };
            /*	--------------------------------------------------- *\
                    [function] setFontSize(size)
            
                    * Set la taille du texte *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setFontSize = function (fontSize) {
                this.fontSize = fontSize;
            };
            /*	--------------------------------------------------- *\
                    [function] getfontSize()
            
                    * Retourne la taille du texte *
            
                    Return: fontSize
            \*	--------------------------------------------------- */
            Text.prototype.getFontSize = function () {
                return this.fontSize;
            };
            /*	--------------------------------------------------- *\
                    [function] setFontStyle(style)
            
                    * Set le style du texte *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setFontStyle = function (style) {
                this.fontStyle = style;
            };
            /*	--------------------------------------------------- *\
                    [function] getFontStyle()
            
                    * Retourne le style de la font *
            
                    Return: style
            \*	--------------------------------------------------- */
            Text.prototype.getFontStyle = function () {
                return this.fontStyle;
            };
            /*	--------------------------------------------------- *\
                    [function] setBaseline(baseline)
            
                    * Set la baseline du texte *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setBaseline = function (baseline) {
                this.baseLine = baseline;
            };
            /*	--------------------------------------------------- *\
                    [function] getBaseline()
            
                    * Retourne la baseline du texte *
            
                    Return: baseline
            \*	--------------------------------------------------- */
            Text.prototype.getBaseline = function () {
                return this.baseLine;
            };
            /*	--------------------------------------------------- *\
                    [function] setAlign(alignment)
            
                    * Set l'alignement du texte *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setAlign = function (alignment) {
                this.align = alignment;
            };
            /*	--------------------------------------------------- *\
                    [function] getAlign()
            
                    * Retourne l'alignement *
            
                    Return: align
            \*	--------------------------------------------------- */
            Text.prototype.getAlign = function () {
                return this.align;
            };
            /*	--------------------------------------------------- *\
                    [function] setVerticalAlign(alignment)
            
                    * Set l'alignement vertical *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setVerticalAlign = function (alignement) {
                this.verticalAlign = alignement;
            };
            /*	--------------------------------------------------- *\
                    [function] getVerticalAlign()
            
                    * Retourne l'alignement vertical *
            
                    Return: verticalAlign
            \*	--------------------------------------------------- */
            Text.prototype.getVerticalAlign = function () {
                return this.verticalAlign;
            };
            /*	--------------------------------------------------- *\
                    [function] setMultiline(boolean)
            
                    * Set le multi line sur le texte *
            
                    Return: nil
            \*	--------------------------------------------------- */
            Text.prototype.setMultiline = function (value) {
                this.isMultiline = value;
            };
            return Text;
        }(Draw.Draw));
        Draw.Text = Text;
    })(Draw = Render.Draw || (Render.Draw = {}));
})(Render || (Render = {}));
var Render;
(function (Render) {
    var Draw;
    (function (Draw) {
        /*	--------------------------------------------------- *\
                [class] Point()
        
                * Dessine un point *
        
        \*	--------------------------------------------------- */
        var Point = (function (_super) {
            __extends(Point, _super);
            /*	--------------------------------------------------- *\
                    [function] constructor()
            
                    * Quand on dessine un point *
            
                    Return: nil
            \*	--------------------------------------------------- */
            function Point(x, y) {
                _super.call(this);
                this.setPosition(x, y);
                this.setColor("#000000");
                this.shape = "point";
                this.setStrokeSize(1);
            }
            return Point;
        }(Draw.Draw));
        Draw.Point = Point;
    })(Draw = Render.Draw || (Render.Draw = {}));
})(Render || (Render = {}));
/*    --------------------------------------------------- *\
        Grid
\*    --------------------------------------------------- */
var Grid;
(function (Grid_1) {
    /*    --------------------------------------------------- *\
            [class] Grid()
    
            * Crée une grille *
    
    \*    --------------------------------------------------- */
    var Grid = (function () {
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Grid(width, height, tileSize, scene) {
            this.position = { x: 0, y: 0 };
            this.size = { width: width, height: height };
            this.parentScene = scene;
            this.tiles = [];
            this.type = "grid";
            this.tileSize = tileSize;
            this.table = [];
            // Pregenerate the grid
            for (var i = 0; i < Math.ceil(this.size.width / this.tileSize); ++i) {
                this.table[i] = [];
                for (var k = 0; k < Math.ceil(this.size.height / this.tileSize); ++k) {
                    this.table[i][k] = [];
                }
            }
        }
        /*    --------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set la taille de la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        Grid.prototype.setSize = function (width, height) {
            this.size = { width: width, height: height };
        };
        /*    --------------------------------------------------- *\
                [function] getSize()
        
                * Get la taille de la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        Grid.prototype.getSize = function () {
            return this.size;
        };
        /*    --------------------------------------------------- *\
                [function] setTileSize()
        
                * Set la taille des tiles *
        
                Return: nil
        \*    --------------------------------------------------- */
        Grid.prototype.setTileSize = function (tileSize) {
            this.tileSize = tileSize;
        };
        /*    --------------------------------------------------- *\
                [function] getTileSize()
        
                * Retourne la taille d'une tile *
        
                Return: tileSize
        \*    --------------------------------------------------- */
        Grid.prototype.getTileSize = function () {
            return this.tileSize;
        };
        /*    --------------------------------------------------- *\
                [function] getTiles()
        
                * Retourne toute les tiles *
        
                Return: tiles
        \*    --------------------------------------------------- */
        Grid.prototype.getTiles = function () {
            return this.tiles;
        };
        /*    --------------------------------------------------- *\
                [function] addTile(tile)
        
                * Ajoute une tile a la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        Grid.prototype.addTile = function (tile) {
            // Set la tile dans la table
            var pos = tile.getPositionIntoGrid();
            if (!this.table[pos.x]) {
                this.table[pos.x] = [];
            }
            if (!this.table[pos.x][pos.y]) {
                this.table[pos.x][pos.y] = [];
            }
            this.table[pos.x][pos.y] = tile;
            this.tiles.push(tile);
        };
        /*    --------------------------------------------------- *\
               [function] setType(type)
       
               * Set le type de l'element *
       
               Return: nil
       \*    --------------------------------------------------- */
        Grid.prototype.setType = function (type) {
            this.type = type;
        };
        /*    --------------------------------------------------- *\
                [function] getType()
        
                * Retourne le type de l'element *
        
                Return: type
        \*    --------------------------------------------------- */
        Grid.prototype.getType = function () {
            return this.type;
        };
        /*    --------------------------------------------------- *\
                [function] getTileFromPosition(posX, posY, relativeToTheGrid)
        
                * Retourne la tile correspondant a la tuile *
        
                Return: true, false
        \*    --------------------------------------------------- */
        Grid.prototype.getTileFromPosition = function (posX, posY, relativeToTheGrid) {
            if (relativeToTheGrid) {
                // On cherche la tile avec les positions relatives a la grille
                var tile = this.table[posX][posY];
                if (tile) {
                    return tile;
                }
                else {
                    return false;
                }
            }
            else {
                // Position absolue
                var origin = this.getPosition();
                var tileSize = this.getTileSize();
                for (var x = this.table.length - 1; x >= 0; x--) {
                    for (var y = this.table[x].length - 1; y >= 0; y--) {
                        var realPos = {
                            x: origin.x + (tileSize * x),
                            y: origin.y + (tileSize * y)
                        };
                        if (posX >= realPos.x && posX <= realPos.x + tileSize && posY >= realPos.y && posY <= realPos.y + tileSize) {
                            var supposedTile = this.table[realPos.x / tileSize][realPos.y / tileSize];
                            return {
                                tile: supposedTile,
                                gridPos: {
                                    x: realPos.x / tileSize,
                                    y: realPos.y / tileSize
                                }
                            };
                        }
                    }
                }
            }
        };
        /*    --------------------------------------------------- *\
                [function] getPosition()
        
                * Retourne la position de la grille *
        
                Return: position
        \*    --------------------------------------------------- */
        Grid.prototype.getPosition = function () {
            return this.position;
        };
        /*    --------------------------------------------------- *\
                [function] setPosition(x, y)
        
                * Set la position de la grille *
        
                Return: nil
        \*    --------------------------------------------------- */
        Grid.prototype.setPosition = function (x, y) {
            this.position = { x: x, y: y };
        };
        return Grid;
    }());
    Grid_1.Grid = Grid;
    /*    --------------------------------------------------- *\
            [class] Tile()
    
            * Crée une tile *
    
    \*    --------------------------------------------------- */
    var Tile = (function (_super) {
        __extends(Tile, _super);
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une tile *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Tile(parentGrid, x, y) {
            _super.call(this);
            this.setType("tile");
            this.canCollideWith("player");
            this.setMass(0);
            this.parentGrid = parentGrid;
            this.gridPos = { x: x, y: y };
            this.parentGrid.addTile(this);
        }
        /*    --------------------------------------------------- *\
                [function] getParentGrid()
        
                * Retourne la grille parente *
        
                Return: grid
        \*    --------------------------------------------------- */
        Tile.prototype.getParentGrid = function () {
            return this.parentGrid;
        };
        /*    --------------------------------------------------- *\
                [function] getPositionIntoGrid()
        
                * Retourne la position de la tile dans la grille *
        
                Return: position
        \*    --------------------------------------------------- */
        Tile.prototype.getPositionIntoGrid = function () {
            return this.gridPos;
        };
        return Tile;
    }(Elements));
    Grid_1.Tile = Tile;
})(Grid || (Grid = {}));
/*    --------------------------------------------------- *\
        Interface
\*    --------------------------------------------------- */
var UI;
(function (UI) {
    var interfaceCanvas = null;
    var fields = [];
    /*    --------------------------------------------------- *\
            [function] isInputEnabled()
    
            * Check si l'input sur une GUI est activé *
    
            Return: true, false
    \*    --------------------------------------------------- */
    function isInputEnabled() {
        var focus = false;
        for (var i = fields.length - 1; i >= 0; i--) {
            if (fields[i].isFocused(null)) {
                focus = true;
            }
        }
        return focus;
    }
    UI.isInputEnabled = isInputEnabled;
    /*    --------------------------------------------------- *\
            [function] getUsedCanvas()
    
            * Return the used canvas for interfaces *
    
            Return: interfaceCanvas
    \*    --------------------------------------------------- */
    function getUsedCanvas() {
        return interfaceCanvas;
    }
    UI.getUsedCanvas = getUsedCanvas;
})(UI || (UI = {}));
var UI;
(function (UI) {
    /*    --------------------------------------------------- *\
            [class] GUI()
    
            * Crée une GUI *
    
    \*    --------------------------------------------------- */
    var GUI = (function (_super) {
        __extends(GUI, _super);
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un GUI *
        
                Return: nil
        \*    --------------------------------------------------- */
        function GUI() {
            var _this = this;
            _super.call(this);
            this.isHTML = false;
            this.htmlElement = null;
            this.renderElements = [];
            this.parent = null;
            this.childrens = [];
            this.events = {};
            this.functionsToCall = {};
            this.functionsToCallWhenOut = {};
            this.guiType = null;
            // Gestion de l'absolute & relative position
            this.relativePosition = { x: 0, y: 0 };
            this.absolutePosition = { x: 0, y: 0 };
            var position = this.getPosition(false);
            var size = this.getSize();
            // Events
            // Click
            this.functionsToCall.click = [];
            this.functionsToCallWhenOut.click = [];
            var cache = this;
            this.events.click = new Input.Click(position.x, position.y, size.width, size.height);
            this.events.click.on("click", function () {
                for (var i = 0; i < _this.functionsToCall.click.length; ++i) {
                    _this.functionsToCall.click[i]();
                }
            });
            this.events.click.on("out", function () {
                for (var z = 0; z < _this.functionsToCallWhenOut.click.length; ++z) {
                    _this.functionsToCallWhenOut.click[z]();
                }
            });
            // Hover
            this.functionsToCall.hover = [];
            this.events.hover = new Input.MouseMove();
            this.events.hover.on("move", function (posX, posY) {
                var position = cache.getPosition(false);
                var size = cache.getSize();
                if (posX >= position.x && posY >= position.y && posX <= position.x + size.width && posY <= position.y + size.height) {
                    for (var k = 0; k < _this.functionsToCall.hover.length; ++k) {
                        _this.functionsToCall.hover[k]();
                    }
                }
            });
            // leave
            this.functionsToCall.leave = [];
            this.events.leave = new Input.MouseMove();
            this.events.leave.on("move", function (posX, posY) {
                var position = cache.getPosition(false);
                var size = cache.getSize();
                if (!(posX >= position.x && posY >= position.y && posX <= position.x + size.width && posY <= position.y + size.height)) {
                    for (var k = 0; k < _this.functionsToCall.leave.length; ++k) {
                        _this.functionsToCall.leave[k]();
                    }
                }
            });
        }
        /*    --------------------------------------------------- *\
                [function] setParent(parentElement)
        
                * Set un parent à l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.setParent = function (parentElement) {
            this.parent = parentElement;
            this.parent.setChildren(this);
        };
        /*    --------------------------------------------------- *\
                [function] getParent()
        
                * Retourne l'element parent *
        
                Return: parent
        \*    --------------------------------------------------- */
        GUI.prototype.getParent = function () {
            return this.parent;
        };
        /*    --------------------------------------------------- *\
                [function] setPosition(x, y)
        
                * Set la position de l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.setPosition = function (x, y) {
            if (!this.isHTML) {
                // Check si l'element a un parent
                if (this.getParent()) {
                    // Il a un parent, on suppose que la position set est relative au parent
                    var parent = this.getParent();
                    var parentPosition = parent.getPosition(false);
                    this.relativePosition = { x: x, y: y };
                    this.absolutePosition = { x: parentPosition.x + x, y: parentPosition.y + y };
                }
                else {
                    // L'element n'a pas de parent, on suppose donc que sa position est relative à l'écran.
                    // Ce qui veut dire qu'il a la même relative/absolute position.
                    this.relativePosition = { x: x, y: y };
                    this.absolutePosition = { x: x, y: y };
                }
                /*if(parameters[0] == true){
                    this.relativePosition = { x: x, y: y };
                }
                else if(parameters[0] == false){
                    this.absolutePosition = { x: x, y: y };
                }*/
                for (var i in this.events) {
                    var position = this.getPosition(false);
                    this.events[i].x = position.x;
                    this.events[i].y = position.y;
                }
            }
            else {
                this.htmlElement.style.position = "absolute";
                this.htmlElement.style.top = y + "px";
                this.htmlElement.style.left = x + "px";
            }
        };
        /*    --------------------------------------------------- *\
                [function] getPosition(relative(true) /  absolute (false))
        
                * Retourne la position absolute ou relative *
        
                Return: position
        \*    --------------------------------------------------- */
        GUI.prototype.getPosition = function () {
            var type = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                type[_i - 0] = arguments[_i];
            }
            if (type[0] == true) {
                return this.relativePosition;
            }
            else if (type[0] == false) {
                return this.absolutePosition;
            }
        };
        /*    --------------------------------------------------- *\
                [function] setSize(width, height)
        
                * Set la taille de l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.setSize = function (width, height) {
            this.size = { width: width, height: height };
            for (var i in this.events) {
                this.events[i].width = width;
                this.events[i].height = height;
            }
            if (this.isHTML) {
                this.htmlElement.style.width = width + "px";
                this.htmlElement.style.height = height + "px";
            }
        };
        /*    --------------------------------------------------- *\
              [function] setChildren(child)
      
              * Set un enfant a l'element *
      
              Return: nil
      \*    --------------------------------------------------- */
        GUI.prototype.setChildren = function (child) {
            this.childrens.push(child);
        };
        /*    --------------------------------------------------- *\
                [function] getChildrens()
        
                * Retourne la liste des enfants *
        
                Return: childrens
        \*    --------------------------------------------------- */
        GUI.prototype.getChildrens = function () {
            return this.childrens;
        };
        /*    --------------------------------------------------- *\
                [function] getElements()
        
                * Retourne tous les elements qui constituent cet UI *
        
                Return: elements
        \*    --------------------------------------------------- */
        GUI.prototype.getElements = function () {
            return this.renderElements;
        };
        /*    --------------------------------------------------- *\
                [function] isVisibile()
        
                * Check si l'element est visible ou pas *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.isVisible = function () {
            var isVisible = false;
            for (var i = this.renderElements.length - 1; i >= 0; i--) {
                if (isVisible != this.renderElements.visible) {
                    return !isVisible;
                }
            }
            return isVisible;
        };
        /*    --------------------------------------------------- *\
                [function] setDepth(depth)
        
                * Set la profondeur de l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.setDepth = function (depth) {
            for (var i = 0; i < this.getElements().length; i++) {
                this.getElements()[i].setDepth(depth + i);
            }
            ;
        };
        /*    --------------------------------------------------- *\
                [function] setOpacity(opacity)
        
                * Set l'opacité de l'element *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.setOpacity = function (opacity) {
            for (var i = 0; i < this.getElements().length; i++) {
                this.getElements()[i].setOpacity(opacity);
            }
            ;
            // set also for the parents
            var childrens = this.getChildrens();
            for (var i = 0; i < childrens.length; i++) {
                childrens[i].setOpacity(opacity);
            }
            if (this.isHTML) {
                this.htmlElement.style.opacity = opacity;
            }
        };
        /*    --------------------------------------------------- *\
                [function] setVisible(value)
        
                * Set l'element et ses enfants visible ou non *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.setVisible = function (value) {
            this.visible = value;
            for (var i = 0; i < this.getElements().length; i++) {
                this.getElements()[i].setVisible(value);
            }
            // set also for the parents
            var childrens = this.getChildrens();
            for (var i = 0; i < childrens.length; i++) {
                childrens[i].setVisible(value);
            }
            if (this.isHTML) {
                if (value) {
                    this.htmlElement.style.display = "block";
                }
                else {
                    this.htmlElement.style.display = "none";
                }
            }
        };
        /*    --------------------------------------------------- *\
                [function] click()
        
                * Quand l'utilisateur clique sur la zone *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.click = function (functionToCall) {
            this.functionsToCall.click.push(functionToCall);
        };
        /*    --------------------------------------------------- *\
                [function] out()
        
                * Quand l'utilisateur clique n'importe ou sauf dans la zone *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.out = function (functionToCall) {
            this.functionsToCallWhenOut.click.push(functionToCall);
        };
        /*    --------------------------------------------------- *\
                [function] hover()
        
                * Quand l'utilisateur passe la souris sur la zone *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.hover = function (functionToCall) {
            this.functionsToCall.hover.push(functionToCall);
        };
        /*    --------------------------------------------------- *\
                [function] leave()
        
                * Quand l'utilisateur passe la souris autre que sur la zone *
        
                Return: nil
        \*    --------------------------------------------------- */
        GUI.prototype.leave = function (functionToCall) {
            this.functionsToCall.leave.push(functionToCall);
        };
        return GUI;
    }(Render.Draw.Draw));
    UI.GUI = GUI;
})(UI || (UI = {}));
var UI;
(function (UI) {
    /*    --------------------------------------------------- *\
            [class] Window()
    
            * Crée une fenetre *
    
    \*    --------------------------------------------------- */
    var Window = (function (_super) {
        __extends(Window, _super);
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une fenetre *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Window(x, y, width, height) {
            _super.call(this);
            this.guiType = "window";
            this.setPosition(x, y);
            this.setSize(width, height);
            var position = this.getPosition(false);
            this.renderElements[0] = new Render.Draw.Rectangle(position.x, position.y, width, height, "rgba(255,255,255,1)");
            for (var i = 0; i < this.renderElements.length; ++i) {
                UI.getUsedCanvas().set(this.renderElements[i]);
            }
        }
        return Window;
    }(UI.GUI));
    UI.Window = Window;
})(UI || (UI = {}));
var UI;
(function (UI) {
    /*    --------------------------------------------------- *\
            [class] Label()
    
            * Crée un label *
    
    \*    --------------------------------------------------- */
    var Label = (function (_super) {
        __extends(Label, _super);
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un label *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Label(x, y, width, height, text) {
            var rest = [];
            for (var _i = 5; _i < arguments.length; _i++) {
                rest[_i - 5] = arguments[_i];
            }
            _super.call(this);
            this.guiType = "label";
            if (rest[0]) {
                this.setParent(rest[0]);
            }
            this.setSize(width, height);
            this.setPosition(x, y);
            this.value = text;
            var position = this.getPosition(false);
            this.renderElements[0] = new Render.Draw.Text(position.x, position.y, this.value, width, height);
            this.renderElements[0].setDepth(10);
            this.renderElements[0].setMultiline(true);
            for (var i = 0; i < this.renderElements.length; ++i) {
                UI.getUsedCanvas().set(this.renderElements[i]);
            }
        }
        /*    --------------------------------------------------- *\
                [function] setValue(value)
        
                * Set la valeur du label *
        
                Return: nil
        \*    --------------------------------------------------- */
        Label.prototype.setValue = function (value) {
            this.value = value;
            this.renderElements[0].setValue(this.value);
        };
        /*    --------------------------------------------------- *\
                [function] getValue()
        
                * Retourne la valeur du label *
        
                Return: value
        \*    --------------------------------------------------- */
        Label.prototype.getValue = function () {
            return this.value;
        };
        /*    --------------------------------------------------- *\
                [function] setFontSize(size)
        
                * Set la taille de la font *
        
                Return: nil
        \*    --------------------------------------------------- */
        Label.prototype.setFontSize = function (size) {
            for (var i = this.renderElements.length - 1; i >= 0; i--) {
                this.renderElements[i].setFontSize(size);
            }
        };
        /*    --------------------------------------------------- *\
                [function] setFontStyle(style)
        
                * Set le style de la font *
        
                Return: nil
        \*    --------------------------------------------------- */
        Label.prototype.setFontStyle = function (style) {
            for (var i = this.renderElements.length - 1; i >= 0; i--) {
                this.renderElements[i].setFontStyle(style);
            }
        };
        /*    --------------------------------------------------- *\
                [function] setFont(fontName)
        
                * Set la font du text *
        
                Return: nil
        \*    --------------------------------------------------- */
        Label.prototype.setFont = function (fontName) {
            for (var i = this.renderElements.length - 1; i >= 0; i--) {
                this.renderElements[i].setFont(fontName);
            }
        };
        /*    --------------------------------------------------- *\
                [function] setBaseline(baseline)
        
                * Set la baseline du texte *
        
                Return: nil
        \*    --------------------------------------------------- */
        Label.prototype.setBaseline = function (baseline) {
            for (var i = this.renderElements.length - 1; i >= 0; i--) {
                this.renderElements[i].setBaseline(baseline);
            }
        };
        /*    --------------------------------------------------- *\
                [function] setAlign(alignment)
        
                * Set l'alignement du texte *
        
                Return: nil
        \*    --------------------------------------------------- */
        Label.prototype.setAlign = function (alignment) {
            for (var i = this.renderElements.length - 1; i >= 0; i--) {
                this.renderElements[i].setAlign(alignment);
            }
        };
        return Label;
    }(UI.GUI));
    UI.Label = Label;
})(UI || (UI = {}));
var UI;
(function (UI) {
    /*    --------------------------------------------------- *\
            [class] Button()
    
            * Crée un button *
    
    \*    --------------------------------------------------- */
    var Button = (function (_super) {
        __extends(Button, _super);
        /*    --------------------------------------------------- *\
                [function] constructor(x, y, width, height, [optional : parent])
        
                * Quand on crée un button *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Button(x, y, width, height) {
            var rest = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                rest[_i - 4] = arguments[_i];
            }
            _super.call(this);
            this.guiType = "button";
            if (rest[0]) {
                this.setParent(rest[0]);
            }
            this.setPosition(x, y);
            this.setSize(width, height);
            this.value = "";
            var position = this.getPosition(false);
            this.renderElements[0] = new Render.Draw.Rectangle(position.x, position.y, width, height, "rgba(255,255,255,1)");
            this.renderElements[0].setShadow(true);
            this.renderElements[0].setShadowColor("rgba(0,0,0,0.3)");
            this.renderElements[0].setShadowBlur(10);
            this.renderElements[0].setDepth(1);
            this.renderElements[1] = new Render.Draw.Text(position.x, position.y, this.value, width, height);
            this.renderElements[1].setAlign("center");
            this.renderElements[1].setVerticalAlign("middle");
            this.renderElements[1].setFontStyle("bold");
            this.renderElements[1].setDepth(2);
            for (var i = 0; i < this.renderElements.length; ++i) {
                UI.getUsedCanvas().set(this.renderElements[i]);
            }
        }
        /*    --------------------------------------------------- *\
                [function] setValue(value)
        
                * Set le texte à l'intérieur du button *
        
                Return: nil
        \*    --------------------------------------------------- */
        Button.prototype.setValue = function (value) {
            this.value;
            this.renderElements[1].setValue(value);
        };
        /*    --------------------------------------------------- *\
                [function] getValue()
        
                * Retourne la valeur dans le button *
        
                Return: value
        \*    --------------------------------------------------- */
        Button.prototype.getValue = function () {
            return this.value;
        };
        /*    --------------------------------------------------- *\
                [function] setBackgroundColor(color)
        
                * Set la couleur de l'arrière plan *
        
                Return: nil
        \*    --------------------------------------------------- */
        Button.prototype.setBackgroundColor = function (color) {
            this.renderElements[0].setColor(color);
        };
        return Button;
    }(UI.GUI));
    UI.Button = Button;
})(UI || (UI = {}));
var UI;
(function (UI) {
    var interfaceElement = document.createElement("div");
    interfaceElement.style.zIndex = "100";
    interfaceElement.style.position = "absolute";
    document.body.appendChild(interfaceElement);
    /*    --------------------------------------------------- *\
            [class] Field()
    
            * Crée un input *
    
    \*    --------------------------------------------------- */
    var Field = (function (_super) {
        __extends(Field, _super);
        /*    --------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée un field *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Field(x, y, width, height) {
            var rest = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                rest[_i - 4] = arguments[_i];
            }
            _super.call(this);
            this.guiType = "field";
            this.isHTML = true;
            this.htmlElement = document.createElement("input");
            interfaceElement.appendChild(this.htmlElement);
            if (rest[0]) {
                this.setParent(rest[0]);
            }
            this.setPosition(x, y);
            this.setSize(width, height);
            this.setValue("");
            this.setPlaceholder("");
        }
        /*    --------------------------------------------------- *\
                [function] isFocused(boolean)
        
                * Check / set si l'input est focus *
        
                Return: true, false
        \*    --------------------------------------------------- */
        Field.prototype.isFocused = function (bool) {
            if (bool == true || bool == false) {
                this.focus = bool;
            }
            else {
                return this.focus;
            }
        };
        /*    --------------------------------------------------- *\
                [function] setValue(value)
        
                * Set la valeur du input *
        
                Return: nil
        \*    --------------------------------------------------- */
        Field.prototype.setValue = function (value) {
            this.value = value;
            if (this.isHTML) {
                this.htmlElement.value = value;
            }
        };
        /*    --------------------------------------------------- *\
                [function] getValue()
        
                * Retourne la valeur de l'input *
        
                Return: value
        \*    --------------------------------------------------- */
        Field.prototype.getValue = function () {
            if (this.isHTML) {
                var htmlValue = this.htmlElement.value;
                if (htmlValue != this.value) {
                    this.setValue(htmlValue);
                }
            }
            return this.value;
        };
        /*    --------------------------------------------------- *\
                [function] setPlaceholder(placeholder)
        
                * Set le placeholder sur l'input *
        
                Return: nil
        \*    --------------------------------------------------- */
        Field.prototype.setPlaceholder = function (placeholder) {
            this.placeholder = placeholder;
            if (this.isHTML) {
                this.htmlElement.placeholder = placeholder;
            }
        };
        return Field;
    }(UI.GUI));
    UI.Field = Field;
})(UI || (UI = {}));
var UI;
(function (UI) {
    /*    --------------------------------------------------- *\
            [class] Checkbox()
    
            * Créer un checkbox *
    
    \*    --------------------------------------------------- */
    var Checkbox = (function (_super) {
        __extends(Checkbox, _super);
        /*    --------------------------------------------------- *\
                [function] constructor(x, y, width, height)
        
                * Quand on crée un checkbox *
        
                Return: nil
        \*    --------------------------------------------------- */
        function Checkbox(x, y, width, height) {
            var _this = this;
            var rest = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                rest[_i - 4] = arguments[_i];
            }
            _super.call(this);
            this.guiType = "checkbox";
            if (rest[0]) {
                this.setParent(rest[0]);
            }
            this.setPosition(x, y);
            this.setSize(width, height);
            this.checked = false;
            this.functionsToCallWhenCheck = [];
            var position = this.getPosition(false);
            this.renderElements[0] = new Render.Draw.Rectangle(position.x, position.y, width, height, "rgba(0,0,0,0.1)");
            this.renderElements[0].setDepth(10);
            for (var i = 0; i < this.renderElements.length; ++i) {
                UI.getUsedCanvas().set(this.renderElements[i]);
            }
            // Event
            this.click(function () {
                if (_this.isChecked()) {
                    _this.setCheck(false);
                }
                else {
                    _this.setCheck(true);
                }
                for (var i = _this.functionsToCallWhenCheck.length - 1; i >= 0; i--) {
                    _this.functionsToCallWhenCheck[i](_this.isChecked());
                }
            });
        }
        /*    --------------------------------------------------- *\
                [function] isChecked()
        
                * Retourne si le checkbox est checké ou non *
        
                Return: true, false
        \*    --------------------------------------------------- */
        Checkbox.prototype.isChecked = function () {
            return this.checked;
        };
        /*    --------------------------------------------------- *\
                [function] setCheck(boolean)
        
                * Set le checkbox a true ou false *
        
                Return: nil
        \*    --------------------------------------------------- */
        Checkbox.prototype.setCheck = function (bool) {
            this.checked = bool;
        };
        /*    --------------------------------------------------- *\
                [function] check()
        
                * Quand l'utilisateur check le checkbox *
        
                Return: nil
        \*    --------------------------------------------------- */
        Checkbox.prototype.check = function (functionToCall) {
            this.functionsToCallWhenCheck.push(functionToCall);
        };
        return Checkbox;
    }(UI.GUI));
    UI.Checkbox = Checkbox;
})(UI || (UI = {}));
/*	--------------------------------------------------- *\
        Sounds
\*	--------------------------------------------------- */
var Sounds;
(function (Sounds) {
    var elementsToDownload = [];
    var soundEnabled = true;
    var soundList = [];
    /*	--------------------------------------------------- *\
            [function] setEnabled(value)
    
            * Set si le son doit être activé ou non *
    
            Return: nil
    \*	--------------------------------------------------- */
    function setEnabled(value) {
        soundEnabled = value;
    }
    Sounds.setEnabled = setEnabled;
    /*	--------------------------------------------------- *\
            [function] getPlayingSounds(value)
    
            * Get the current playing sounds *
    
            Return: playingSounds
    \*	--------------------------------------------------- */
    function getPlayingSounds() {
        var playingSounds = [];
        for (var i = 0; i < soundList.length; ++i) {
            if (soundList[i].playing) {
                playingSounds.push(soundList[i]);
            }
        }
        return playingSounds;
    }
    Sounds.getPlayingSounds = getPlayingSounds;
    /*	--------------------------------------------------- *\
            [class] Sound()
    
            * Crée un son *
    
    \*	--------------------------------------------------- */
    var Sound = (function (_super) {
        __extends(Sound, _super);
        /*	--------------------------------------------------- *\
                [function] constructor()
        
                * Crée un son *
        
                Return: nil
        \*	--------------------------------------------------- */
        function Sound(path) {
            _super.call(this);
            this.element = null;
            this.isReady = false;
            this.playing = false;
            var _this = this;
            if (Global.isAndroid()) {
                if (typeof window['Media'] != "undefined") {
                    this.element = new window['Media']("/android_asset/www/" + path, function () {
                        _this.emit("end");
                    }, function (error) {
                        console.log("Error", error);
                    });
                    setTimeout(function () {
                        _this.isReady = true;
                        _this.emit("ready");
                    }, 100);
                }
            }
            else {
                if (typeof Audio != "undefined") {
                    this.element = new Audio(path);
                    this.element.addEventListener("canplaythrough", function () {
                        _this.isReady = true;
                        _this.emit("ready");
                    });
                    this.element.addEventListener("ended", function () {
                        _this.emit("end");
                    });
                }
            }
            this.path = path;
            this.duration = 0;
            this.volume = 1;
            if (this.element) {
                this.duration = this.element['duration'];
                this.volume = this.element['volume'];
            }
            this.currentTime = 0;
            this.muted = false;
            this.muteTemp = 1;
            soundList.push(this);
        }
        /*	--------------------------------------------------- *\
                [function] getPath()
        
                * Retourne le path du sound *
        
                Return: path
        \*	--------------------------------------------------- */
        Sound.prototype.getPath = function () {
            return this.path;
        };
        /*	--------------------------------------------------- *\
                [function] setPath(path)
        
                * Set le path du sound *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.setPath = function (path) {
            this.path = path;
            this.element.src = path;
        };
        /*	--------------------------------------------------- *\
                [function] getDUration()
        
                * Retourne la longeur de la bande don *
        
                Return: duration
        \*	--------------------------------------------------- */
        Sound.prototype.getDuration = function () {
            return this.duration;
        };
        /*	--------------------------------------------------- *\
                [function] getVolume()
        
                * Retourne le volume du son *
        
                Return: volume
        \*	--------------------------------------------------- */
        Sound.prototype.getVolume = function () {
            return this.volume;
        };
        /*	--------------------------------------------------- *\
                [function] setVolume(volume)
        
                * Set le volume du son *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.setVolume = function (volume) {
            if (volume >= 0) {
                this.volume = volume;
                if (typeof window['Media'] != "undefined") {
                    this.element.setVolume(volume);
                }
                else {
                    this.element.volume = volume;
                }
                this.emit("volumechange");
            }
        };
        /*	--------------------------------------------------- *\
                [function] setCurrentTime(time)
        
                * Set le currentTime du son en secondes *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.setCurrentTime = function (time) {
            this.currentTime = time;
            if (typeof window['Media'] != "undefined") {
                this.element.seekTo(time);
            }
            else {
                this.element.currentTime = time;
            }
        };
        /*	--------------------------------------------------- *\
                [function] getCurrentTime()
        
                * Retourne le temps actuel en secondes *
        
                Return: currentTime
        \*	--------------------------------------------------- */
        Sound.prototype.getCurrentTime = function () {
            return this.currentTime;
        };
        /*	--------------------------------------------------- *\
                [function] isMute()
        
                * Retourne si le son est mute ou pas *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Sound.prototype.isMute = function () {
            return this.muted;
        };
        /*	--------------------------------------------------- *\
                [function] play()
        
                * Joue le son *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.play = function () {
            if (this.element) {
                if (soundEnabled) {
                    this.element.play();
                    this.playing = true;
                }
                this.emit("play");
            }
        };
        /*	--------------------------------------------------- *\
                [function] pause()
        
                * Pause le son *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.pause = function () {
            this.element.pause();
            this.playing = false;
            this.emit("pause");
        };
        /*	--------------------------------------------------- *\
                [function] stop()
        
                * Stoppe le son et le restart *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.stop = function () {
            this.pause();
            this.setCurrentTime(0);
            if (Global.isAndroid()) {
                this.element.stop();
            }
            this.playing = true;
            this.emit("stop");
        };
        /*	--------------------------------------------------- *\
                [function] mute()
        
                * Mute le son *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.mute = function () {
            this.muteTemp = this.getVolume();
            this.setVolume(0);
            this.muted = true;
            this.emit("mute");
        };
        /*	--------------------------------------------------- *\
                [function] isPlaying()
        
                * Check si le son est entrant d'être joué ou non *
        
                Return: true, false
        \*	--------------------------------------------------- */
        Sound.prototype.isPlaying = function () {
            return this.playing;
        };
        /*	--------------------------------------------------- *\
                [function] unmute()
        
                * Demute le son *
        
                Return: nil
        \*	--------------------------------------------------- */
        Sound.prototype.unmute = function () {
            if (this.muteTemp) {
                this.setVolume(this.muteTemp);
            }
            this.muted = false;
            this.emit("unmute");
        };
        return Sound;
    }(Events));
    Sounds.Sound = Sound;
})(Sounds || (Sounds = {}));
/*	--------------------------------------------------- *\
        Fonts
\*	--------------------------------------------------- */
var Fonts;
(function (Fonts) {
    var importedFonts = [];
    /*	--------------------------------------------------- *\
            [class] FontFace()
    
            * Crée une font-face *
    
    \*	--------------------------------------------------- */
    var FontFace = (function () {
        /*	--------------------------------------------------- *\
                [function] constructor()
        
                * Quand on crée une font-face *
        
                Return: nil
        \*	--------------------------------------------------- */
        function FontFace(name, path) {
            this.styleElement = document.createElement("style");
            document.body.appendChild(this.styleElement);
            this.setName(name);
            this.setPath(path);
            importedFonts.push(this);
        }
        /*	--------------------------------------------------- *\
                [function] updateCSS()
        
                * Met a jour le CSS avec les valeurs *
        
                Return: nil
        \*	--------------------------------------------------- */
        FontFace.prototype.updateCSS = function () {
            this.styleElement.innerHTML = "@font-face{ font-family: " + this.getName() + "; src : url('" + this.getPath() + "');}";
        };
        /*	--------------------------------------------------- *\
                [function] setName(name)
        
                * Set le nom de la police *
        
                Return: nil
        \*	--------------------------------------------------- */
        FontFace.prototype.setName = function (name) {
            this.name = name;
            this.updateCSS();
        };
        /*	--------------------------------------------------- *\
                [function] setPath(path)
        
                * Set le chemin de la police *
        
                Return: nil
        \*	--------------------------------------------------- */
        FontFace.prototype.setPath = function (path) {
            this.path = "./" + path;
            this.updateCSS();
        };
        /*	--------------------------------------------------- *\
                [function] getName()
        
                * Retourne le nom de la police *
        
                Return: name
        \*	--------------------------------------------------- */
        FontFace.prototype.getName = function () {
            return this.name;
        };
        /*	--------------------------------------------------- *\
                [function] getPath()
        
                * Retourne le path *
        
                Return: path
        \*	--------------------------------------------------- */
        FontFace.prototype.getPath = function () {
            return this.path;
        };
        return FontFace;
    }());
    Fonts.FontFace = FontFace;
})(Fonts || (Fonts = {}));
/// <reference path="p2.d.ts" />
/// <reference path="tween.d.ts" />
/// <reference path="global.ts" />
/// <reference path="global/point.ts" />
/// <reference path="global/vector.ts" />
/// <reference path="events.ts" />
/// <reference path="elements.ts" />
/// <reference path="scene.ts" />
/// <reference path="camera.ts" />
/// <reference path="input.ts" />
/// <reference path="update.ts" />
/// <reference path="render.ts" />
/// <reference path="render/layer.ts" />
/// <reference path="render/texture.ts" />
/// <reference path="render/drawable.ts" />
/// <reference path="render/sprite.ts" />
/// <reference path="render/draw/draw.ts" />
/// <reference path="render/draw/rectangle.ts" />
/// <reference path="render/draw/circle.ts" />
/// <reference path="render/draw/polygon.ts" />
/// <reference path="render/draw/line.ts" />
/// <reference path="render/draw/text.ts" />
/// <reference path="render/draw/point.ts" />
/// <reference path="grid.ts" />
/// <reference path="interface.ts" />
/// <reference path="ui/gui.ts" />
/// <reference path="ui/window.ts" />
/// <reference path="ui/label.ts" />
/// <reference path="ui/button.ts" />
/// <reference path="ui/field.ts" />
/// <reference path="ui/checkbox.ts" />
/// <reference path="sounds.ts" />
/// <reference path="fonts.ts" /> 
