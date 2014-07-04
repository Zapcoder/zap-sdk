/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>

module Demo.Managers {

    export class GateManager extends Zapcoder.Entities.Components.Component {

        public speed: number;
        public image: string
		public group: string;
		public space: number;
		public frequency: number;

		private lastTime: number = 0;
		private currentTime: number = 0;
		private gates: Demo.Gate[] = [];

        private music;

        constructor(config) {
            super(config);
            this.speed = +config.speed || -100;
            this.image = config.image || 'scenery.rockGrass';
			this.group = config.group || 'gate';
			this.space = +config.space || 300;
			this.frequency = +config.frequency || 5;
        }

        init(entity) {
            super.init(entity);

            Zap.engine.game.sound.stopAll();
            this.music = Zap.engine.game.add.audio('afolter.song', 1, true);
            this.music.play();

        }

        update() {
            this.currentTime += Zap.engine.game.time.physicsElapsed;
            if(this.currentTime - this.lastTime > this.frequency) {
                this.lastTime = this.currentTime;
                this.gates.push(new Demo.Gate(this));
            }
        }
    }

    Zap.components.register('Demo.Managers.GateManager', Demo.Managers.GateManager);
}
