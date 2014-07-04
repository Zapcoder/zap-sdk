/// <reference path="../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../sdk/definitions/zapcoder.d.ts"/>

module Demo {

    export class SmokeEmitter extends Zapcoder.Entities.Components.Component {

        private emitter;

        constructor(config) {
            
            super(config);

        }

        init(entity) {

            super.init(entity);
            this.emitter = Zap.engine.game.add.emitter(entity.sprite.x, entity.sprite.y, 100);
            this.emitter.makeParticles(['particles.smoke']);
            this.emitter.gravity = 10;
            this.emitter.alpha = 0.4;
            this.emitter.minParticleSpeed = new Phaser.Point(-300, -250);
            this.emitter.maxParticleSpeed = new Phaser.Point(-150, -150);
            this.emitter.setAlpha(0.8, 0, 3000);
            this.emitter.setScale(0.8, 3, 0.8, 3, 3000);
            this.emitter.start(false, 3000, 2);
        }

        update() {

            this.emitter.emitX = this.entity.sprite.x;
            this.emitter.emitY = this.entity.sprite.y;
        }
    }

    Zap.components.register('Demo.SmokeEmitter', Demo.SmokeEmitter);
}
