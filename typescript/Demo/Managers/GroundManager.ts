/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>

module Demo.Managers {

    export class GroundManager extends Zapcoder.Entities.Components.Component {

        public speed: number;
		public ground: string;
		

        constructor(config) {
            super(config);
            this.speed = +config.speed || -100;
			this.ground = config.ground || 'ground';
			
        }

        init(entity) {
            super.init(entity);
            var ground = this.entity.manager.createEntity(this.ground);

            var scrollingSprite = ground.requestComponent('ScrollingSprite');
            scrollingSprite.velocity.x = this.speed;
            if(scrollingSprite) {
                var sprites = scrollingSprite.sprites;
                for( var i = 0; i < sprites.length; i++ ) {
                    sprites[i].y = Zap.engine.game.height - sprites[i].height;
                }
            }
        }

        update() {
            // Add update code here
        }
    }

    Zap.components.register('Demo.Managers.GroundManager', Demo.Managers.GroundManager);
}
