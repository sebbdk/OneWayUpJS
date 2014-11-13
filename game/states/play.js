/* 
* @Author: sebb
* @Date:   2014-11-04 22:18:50
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-13 02:16:48
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
		this.platform.body.y = (this.game.height/2) * 0.80;
		this.platform.y = this.platform.body.y;
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
		this.game.debug.body(this.platform);
		this.game.debug.body(this.explosion.body);
	},
	deathHandler:function() {
		console.log('IS DEAD!!!');
		this.game.paused = true;
	}
};

module.exports = Play;