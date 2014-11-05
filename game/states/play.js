/* 
* @Author: sebb
* @Date:   2014-11-04 22:18:50
* @Last Modified by:   sebb
* @Last Modified time: 2014-11-05 11:05:35
*/
'use strict';

function Play() {}

Play.prototype = {
	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//add some backgrounds
		this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'stars');
		this.bg.fixedToCamera = true;

		//add game content holder
		this.entities = new Phaser.Group(this.game);

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

		this.pilot.y = this.game.height - 500 * this.entities.scale.x;
		this.pilot.scale.x = this.pilot.scale.y = this.entities.scale.x;

		this.game.physics.enable(this.pilot, Phaser.Physics.ARCADE);
		this.pilot.body.gravity.set(0, 1000);
		
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
	update: function() {
		this.game.physics.arcade.collide(this.platform, this.pilot);

		if(this.game.input.activePointer.isDown) {
			this.pilot.body.velocity.setTo(0, -600);
		}

		this.bg.tilePosition.y += this.pilot.body.velocity.y* -0.01;

		this.game.camera.x = 0;
		this.game.camera.y = this.pilot.y - (this.game.height/2)

		//debug
		this.game.debug.body(this.platform);
	}
};

module.exports = Play;