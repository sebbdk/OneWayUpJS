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
