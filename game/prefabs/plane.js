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