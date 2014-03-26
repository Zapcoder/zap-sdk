/// <reference path="../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../sdk/definitions/zapcoder.d.ts"/>

module Demo {
    export class Gate {
        public manager:Demo.Managers.GateManager;
        public top:Phaser.Sprite;
        public goal:Phaser.Sprite;
        public bottom:Phaser.Sprite;

        constructor(manager) {
            this.manager = manager;

            var offset = Zap.math.randomRange(-150, 150);
            this.createTop(offset);
            this.createBottom(offset);
            this.createGoal();
            this.setGroup();

        }

        createTop(offset) {
            this.top = Zap.engine.game.add.sprite(Zap.engine.game.width + 100, 0, this.manager.image);
            this.top.entity = this.manager.entity;

            this.top.anchor.setTo(0.5, 0.5);
            this.top.y = ((Zap.engine.game.height / 2) + offset) - (this.top.height) - (this.manager.space / 2);
            this.top.body.x = this.top.x;
            this.top.body.velocity.setTo(this.manager.speed, 0);
            this.top.angle = 180;
        }

        createGoal(){
            this.goal = Zap.engine.game.add.sprite(Zap.engine.game.width + 100 + this.top.width, 0);
            this.goal.height = Zap.engine.game.height;
            this.goal.entity = this.manager.entity;
            this.goal.body.x = this.goal.x;
            this.goal.body.velocity.setTo(this.manager.speed, 0);
        }

        createBottom(offset) {
            this.bottom = Zap.engine.game.add.sprite(Zap.engine.game.width + 100, 0, this.manager.image);
            this.bottom.entity = this.manager.entity;

            this.bottom.anchor.setTo(0.5, 0.5);
            this.bottom.y = ((Zap.engine.game.height / 2) + offset) + (this.manager.space / 2);
            this.bottom.body.x = this.bottom.x;
            this.bottom.body.velocity.setTo(this.manager.speed, 0);
        }

        setGroup() {
            if(this.manager.group) {
                this.manager.entity.manager.groups[this.manager.group].add(this.top);
                this.manager.entity.manager.groups[this.manager.group].add(this.bottom);
            }
            this.manager.entity.manager.groups['goal'].add(this.goal);
        }
    }
}
