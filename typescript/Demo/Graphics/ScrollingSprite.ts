/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>

module Demo.Graphics {

    export class ScrollingSprite extends Zapcoder.Entities.Components.Component {

        public image: string;
		public speed: number;
		public group: string;
		public velocity: Phaser.Point;
        private sprites: Phaser.Sprite[] = [];		
        private width: number = 0;

        constructor(config) {
            super(config);
            this.image = config.image || null;
			this.speed = +config.speed || -100;
            this.group = config.group || null;			
            this.velocity = new Phaser.Point(this.speed, 0);
        }

        init(entity) {
            super.init(entity);
            this.createSprites();
        }

        update() {
            for( var i = 0; i < this.sprites.length; i++ ) {
                var sprite = this.sprites[i];

                if( this.speed < 0 ) {
                    if(sprite.body.right < 0) {
                        sprite.x += this.width;
                        break;
                    }
                }
                else {
                    if(sprite.body.left > Zap.engine.game.width) {
                        sprite.x -= this.width;
                        break;
                    }
                }
            }
        }

        createSprites() {
            while(this.width < Zap.engine.game.width * 2 && this.sprites.length < 2) {

                var sprite = Zap.engine.game.add.sprite(this.entity.pos.x + this.width, 
                        this.entity.pos.y, 
                        this.image, 
                        0, 
                        this.entity.manager.groups[this.group]
                    );

                Zap.engine.game.physics.enable(sprite);

                sprite.body.updateBounds();
                sprite.body.velocity = this.velocity;
                sprite.entity = this.entity;

                this.width += sprite.width;

                this.sprites.push(sprite);
            }
        }
    }

    Zap.components.register('Demo.Graphics.ScrollingSprite', Demo.Graphics.ScrollingSprite);
}
