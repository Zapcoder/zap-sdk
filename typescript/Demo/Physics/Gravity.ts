/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>

module Demo.Physics {

    export class Gravity extends Zapcoder.Entities.Components.Component {

        public gravity: number;
		

        constructor(config) {
            super(config);
            this.gravity = +config.gravity || 100;
			
        }

        init(entity) {
            super.init(entity);
            entity.sprite.body.gravity.setTo(0, this.gravity);
        }

        update() {
            // Add update code here
        }
    }

    Zap.components.register('Demo.Physics.Gravity', Demo.Physics.Gravity);
}
