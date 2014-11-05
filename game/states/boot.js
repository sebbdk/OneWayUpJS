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
