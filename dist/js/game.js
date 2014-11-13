(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'onewayup');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
/* 
* @Author: sebb
* @Date:   2014-11-12 18:18:38
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-13 01:15:13
*/
'use strict';

var Plane = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, 'plane', frame);

	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = false;

}

Plane.prototype = Object.create(Phaser.Sprite.prototype);
Plane.prototype.constructor = Plane;

module.exports = Plane;
},{}],3:[function(require,module,exports){
/* 
* @Author: sebb
* @Date:   2014-11-04 22:18:50
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-05 01:36:32
*/
'use strict';

function Boot() { 
}

Boot.prototype = {
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
	},
	create: function() {
		var self = this;
		this.game.input.maxPointers = 1;
		this.game.state.start('preload');
		this.game.stage.smoothed = false;
		this.resizeGame();

		$(window).resize(function() { self.resizeGame(); } );
	},
	resizeGame:function() {
		var height = $(window).height();
		var width = $(window).innerWidth();

		this.game.width = width;
		this.game.height = height;

		this.game.stage.getBounds().width = width;
		this.game.stage.getBounds().height = height;

		//if (this.game.renderType === Phaser.WEBGL) {
			this.game.renderer.resize(width, height);
		//}
	}

};

module.exports = Boot;

},{}],4:[function(require,module,exports){
/* 
* @Author: sebb
* @Date:   2014-11-04 22:18:50
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-04 22:39:22
*/
'use strict';

function GameOver() {}

GameOver.prototype = {
	preload: function () {

	},
	create: function () {
		var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
		this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
		this.titleText.anchor.setTo(0.5, 0.5);

		this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
		this.congratsText.anchor.setTo(0.5, 0.5);

		this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
		this.instructionText.anchor.setTo(0.5, 0.5);
	},
	update: function () {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start('play');
		}
	}
};
module.exports = GameOver;

},{}],5:[function(require,module,exports){
/* 
* @Author: sebb
* @Date:   2014-11-04 22:18:50
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-04 22:38:41
*/
'use strict';

function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
		this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
		this.sprite.anchor.setTo(0.5, 0.5);

		this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
		this.titleText.anchor.setTo(0.5, 0.5);

		this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
		this.instructionsText.anchor.setTo(0.5, 0.5);

		this.sprite.angle = -20;
		this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
	},
	update: function() {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start('play');
		}
	}
};

module.exports = Menu;

},{}],6:[function(require,module,exports){
/* 
* @Author: sebb
* @Date:   2014-11-04 22:18:50
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-13 02:05:50
*/
'use strict';

var Plane = require('../prefabs/plane');

function Play() {}

Play.prototype = {
	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//add some backgrounds
		this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'stars');
		this.bg.fixedToCamera = true;

		//add game content holder
		this.cloudGroup = new Phaser.Group(this.game);
		this.entities = new Phaser.Group(this.game);
		this.hittables = new Phaser.Group(this.game);

		//add the ground
		this.ground = this.game.add.sprite(0, 0, 'ground');
		this.entities.add(this.ground);
		
		//handle scaling
		this.entities.scale.x = this.game.width / this.entities.width;
		this.entities.scale.y = this.entities.scale.x;
		this.entities.y = this.game.height - this.entities.height;

		//prep de mockup pilot
		this.pilot = this.game.add.sprite(0, 0, 'pilot');
		this.pilot.anchor.setTo(0.5, 0.5);
		this.pilot.x = this.game.width / 2;
		this.pilot.y = 0;
		this.pilot.scale.x = this.pilot.scale.y = this.entities.scale.x;
		this.game.physics.enable(this.pilot, Phaser.Physics.ARCADE);
		this.pilot.body.gravity.set(0, 1000);

		this.pilot.animations.add('stand', [0], 4, false);
		this.pilot.animations.add('fly', [2], 4, false);
		this.pilot.animations.add('jet', [1], 4, false);

		//pilot emitter
  		this.emitter = this.game.add.emitter(this.pilot.x, this.pilot.y, 100);
		this.emitter.makeParticles( [ 'smoke' ] );
		this.emitter.gravity = -50;
		this.emitter.width = this.pilot.width * 0.8;
		this.emitter.setAlpha(1, 0, 1000);
		this.emitter.setScale(0.5, 2, 0.5, 2, 6000, Phaser.Easing.Quintic.Out);
		this.emitter.start(false, 500, 5);
		this.emitter.on = false;


		//add exploding planet
		this.explosion = this.game.add.sprite(0, 0, 'moon');
		this.explosion.anchor.setTo(0.5, 0.5);
		this.explosion.scale.x = 2;
		this.explosion.scale.y = 2;
		this.explosion.x = this.game.width / 2;
		this.explosion.y = this.game.height + this.explosion.height - 200;
		this.game.physics.enable(this.explosion, Phaser.Physics.ARCADE);
		this.explosion.body.allowGravity = false;
		this.explosion.body.immovable = true;
		
		//add start platform
		this.platform = this.add.sprite(0,0);
		this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
		this.platform.anchor.setTo(0.5, 0.5);
		this.platform.body.immovable = true;
		this.platform.body.setSize(0, 0, 100, 100);
		this.platform.body.width = this.entities.width * 2;
		this.platform.body.height = 50;
		this.platform.body.y = this.pilot.y + 100;
		this.platform.y = this.pilot.y;
		this.platform.allowGravity = false;

		this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
		
		//setup the camera
		this.game.camera.checkBounds = function() {};//dont check bounds :)

		this.music = this.game.add.audio('music',1,true);
		this.music.play('',0,1,true);
	},
	planes:[],
	clouds:[],
	update: function() {
		this.game.physics.arcade.collide(this.platform, this.pilot);
		
		var cloudDist = 150;
		var cloudRank = Math.ceil(this.pilot.body.position.y* -1 / cloudDist);
		var clouds = ['cloud_1', 'cloud_2', 'cloud_3', 'cloud_4'];
		if((this.clouds.length == 0 || this.clouds[this.clouds.length-1].cloudRank != cloudRank)) {
			var direction = Math.round(Math.random()) === 1 ? 1:-1;
			var cloud = this.game.add.sprite(0, cloudDist * cloudRank * -1 -(cloudDist*3) , 'cloud_01');
			cloud.anchor.setTo(0.5, 0.5);
			cloud.scale.x = direction;
			cloud.cloudRank = cloudRank;
			cloud.x = this.game.width * Math.random();
			this.clouds.push(cloud);
			this.cloudGroup.add(cloud);
		}

		var rankSize = 400;
		var rank = Math.ceil(this.pilot.body.position.y* -1 / rankSize);
		if((this.planes.length == 0 || this.planes[this.planes.length-1].rank != rank) && rank  > 0) {
			var direction = Math.round(Math.random()) === 1 ? 1:-1;
			var startPos = (direction > 0 ? this.game.width:0);
			var plane = new Plane(this.game, startPos, rankSize * rank * -1, 335, 112);
			plane.rank = rank;
			plane.anchor.setTo(0.5, 0.5);
			plane.direction = direction;
			plane.body.velocity.setTo((-150 + (Math.random() * -300)) * direction, 0);
			plane.scale.x = direction;

			this.hittables.add(plane);
			this.planes.push(plane);
		}

		this.hittables.forEach(function(plane) {
			this.game.physics.arcade.collide(plane, this.pilot, this.deathHandler, null, this);

			this.game.debug.body(plane);
		}, this);

		if(this.game.input.activePointer.isDown) {
			this.pilot.body.velocity.setTo(0, -500);
			this.pilot.animations.play('jet');
			this.emitter.on = true;
		} else if(rank > 1) {
			this.pilot.animations.play('fly');
			this.emitter.on = false;
		}

		if(rank > 1) {
			this.explosion.body.velocity.y = -200;
		} else {
			this.explosion.body.velocity.y = 0;
		}

		this.emitter.x = this.pilot.x;
		this.emitter.y = this.pilot.y;

		//handle the exposion hit
		this.game.physics.arcade.collide(this.pilot, this.explosion, this.deathHandler, null, this);

		this.bg.tilePosition.y += this.pilot.body.velocity.y* -0.01;

		this.game.camera.x = 0;
		this.game.camera.y = this.pilot.y - (this.game.height/2)

		//debug
		//this.game.debug.body(this.platform);
		this.game.debug.body(this.explosion.body);
	},
	deathHandler:function() {
		console.log('IS DEAD!!!');
		this.game.paused = true;
	}
};

module.exports = Play;
},{"../prefabs/plane":2}],7:[function(require,module,exports){
/* 
* @Author: sebb
* @Date:   2014-11-04 22:18:50
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-13 00:59:27
*/
'use strict';

function Preload() {  
	this.asset = null;
	this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.load.image('ground', 'assets/ground.png');
		this.load.image('stars', 'assets/stars_repeat.png');
		this.load.image('plane', 'assets/plane.png');
		this.load.image('moon', 'assets/moon.png');
		this.load.image('cloud_01', 'assets/cloud_01.png');
		this.load.image('cloud_02', 'assets/cloud_02.png');
		this.load.image('cloud_03', 'assets/cloud_03.png');
		this.load.image('cloud_04', 'assets/cloud_04.png');
		this.load.image('smoke', 'assets/texture.png');

		this.game.load.atlasXML('pilot', 'assets/pilot.png', 'assets/pilot.xml');

		this.game.load.audio('music', ['assets/music.mp3']);

	},
	create: function() {
		this.asset.cropEnabled = false;
	},
	update: function() {
		if(!!this.ready) {
			this.game.state.start('play');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};

module.exports = Preload;

},{}]},{},[1])