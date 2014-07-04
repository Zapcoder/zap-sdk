/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>

module Demo.Input {

    export class UpwardsForceController extends Zapcoder.Entities.Components.Component {

        public upwardsAcc: number;
	    private acceleration: Phaser.Point;	
        private offset: number;

        constructor(config) {
            super(config);
            this.upwardsAcc = +config.upwardsAcc || 100;
			this.offset = 0;
        }

        init(entity) {
            super.init(entity);
            this.acceleration = entity.sprite.body.acceleration;
        }

        update() {
            if(Zap.engine.game.input.activePointer.isDown)
                this.acceleration.y = -this.upwardsAcc;
            else
                this.acceleration.y = 0;

            this.entity.sprite.angle = Zap.math.clamp(-90, 90, this.entity.sprite.body.velocity.y / 20);
            this.offset += 3;
            this.entity.sprite.angle += this.offset;
        }
    }

    Zap.components.register('Demo.Input.UpwardsForceController', Demo.Input.UpwardsForceController);
}
