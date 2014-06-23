/// <reference path="../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../sdk/definitions/zapcoder.d.ts"/>
var Demo;
(function (Demo) {
    var Gate = (function () {
        function Gate(manager) {
            this.manager = manager;

            var offset = Zap.math.randomRange(-150, 150);
            this.createTop(offset);
            this.createBottom(offset);
            this.createGoal();
            this.setGroup();
        }
        Gate.prototype.createTop = function (offset) {
            this.top = Zap.engine.game.add.sprite(Zap.engine.game.width + 100, 0, this.manager.image);
            this.top.entity = this.manager.entity;

            this.top.anchor.setTo(0.5, 0.5);
            this.top.y = ((Zap.engine.game.height / 2) + offset) - (this.top.height) - (this.manager.space / 2);
            this.top.body.x = this.top.x;
            this.top.body.velocity.setTo(this.manager.speed, 0);
            this.top.angle = 180;
        };

        Gate.prototype.createGoal = function () {
            this.goal = Zap.engine.game.add.sprite(Zap.engine.game.width + 100 + this.top.width, 0);
            this.goal.height = Zap.engine.game.height;
            this.goal.entity = this.manager.entity;
            this.goal.body.x = this.goal.x;
            this.goal.body.velocity.setTo(this.manager.speed, 0);
        };

        Gate.prototype.createBottom = function (offset) {
            this.bottom = Zap.engine.game.add.sprite(Zap.engine.game.width + 100, 0, this.manager.image);
            this.bottom.entity = this.manager.entity;

            this.bottom.anchor.setTo(0.5, 0.5);
            this.bottom.y = ((Zap.engine.game.height / 2) + offset) + (this.manager.space / 2);
            this.bottom.body.x = this.bottom.x;
            this.bottom.body.velocity.setTo(this.manager.speed, 0);
        };

        Gate.prototype.setGroup = function () {
            if (this.manager.group) {
                this.manager.entity.manager.groups[this.manager.group].add(this.top);
                this.manager.entity.manager.groups[this.manager.group].add(this.bottom);
            }
            this.manager.entity.manager.groups['goal'].add(this.goal);
        };
        return Gate;
    })();
    Demo.Gate = Gate;
})(Demo || (Demo = {}));

/// <reference path="../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../sdk/definitions/zapcoder.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    var PlayerCollision = (function (_super) {
        __extends(PlayerCollision, _super);
        function PlayerCollision(config) {
            _super.call(this, config);
        }
        PlayerCollision.prototype.init = function (entity) {
            _super.prototype.init.call(this, entity);

            // Add initialization code here
            entity.events.listen('collision.ground', function (e) {
                Zap.engine.lose();
            });

            entity.events.listen('collision.gate', function (e) {
                Zap.engine.lose();
            });

            entity.events.listen('collision.goal', function (e) {
                Zap.engine.session.score += 10;
                e.kill();
            });
        };

        PlayerCollision.prototype.update = function () {
            // Add update code here
        };
        return PlayerCollision;
    })(Zapcoder.Entities.Components.Component);
    Demo.PlayerCollision = PlayerCollision;

    Zap.components.register('Demo.PlayerCollision', Demo.PlayerCollision);
})(Demo || (Demo = {}));

/// <reference path="../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../sdk/definitions/zapcoder.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    var SmokeEmitter = (function (_super) {
        __extends(SmokeEmitter, _super);
        function SmokeEmitter(config) {
            _super.call(this, config);
        }
        SmokeEmitter.prototype.init = function (entity) {
            _super.prototype.init.call(this, entity);
            this.emitter = Zap.engine.game.add.emitter(entity.sprite.x, entity.sprite.y, 100);
            this.emitter.makeParticles(['megusta']);
            this.emitter.gravity = 10;
            this.emitter.start(false, 3000, 2);
        };

        SmokeEmitter.prototype.update = function () {
            this.emitter.emitX = this.entity.sprite.x;
            this.emitter.emitY = this.entity.sprite.y;
            // Add update code here
        };
        return SmokeEmitter;
    })(Zapcoder.Entities.Components.Component);
    Demo.SmokeEmitter = SmokeEmitter;

    Zap.components.register('Demo.SmokeEmitter', Demo.SmokeEmitter);
})(Demo || (Demo = {}));

/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    (function (Graphics) {
        var ScrollingSprite = (function (_super) {
            __extends(ScrollingSprite, _super);
            function ScrollingSprite(config) {
                _super.call(this, config);
                this.sprites = [];
                this.width = 0;
                this.image = config.image || null;
                this.speed = +config.speed || -100;
                this.group = config.group || null;
                this.velocity = new Phaser.Point(this.speed, 0);
            }
            ScrollingSprite.prototype.init = function (entity) {
                _super.prototype.init.call(this, entity);
                this.createSprites();
            };

            ScrollingSprite.prototype.update = function () {
                for (var i = 0; i < this.sprites.length; i++) {
                    var sprite = this.sprites[i];

                    if (this.speed < 0) {
                        if (sprite.body.right < 0) {
                            sprite.x += this.width;
                            break;
                        }
                    } else {
                        if (sprite.body.left > Zap.engine.game.width) {
                            sprite.x -= this.width;
                            break;
                        }
                    }
                }
            };

            ScrollingSprite.prototype.createSprites = function () {
                while (this.width < Zap.engine.game.width * 2 && this.sprites.length < 2) {
                    var sprite = Zap.engine.game.add.sprite(this.entity.pos.x + this.width, this.entity.pos.y, this.image, 0, this.entity.manager.groups[this.group]);

                    sprite.updateBounds();
                    sprite.body.velocity = this.velocity;
                    sprite.entity = this.entity;

                    this.width += sprite.width;

                    this.sprites.push(sprite);
                }
            };
            return ScrollingSprite;
        })(Zapcoder.Entities.Components.Component);
        Graphics.ScrollingSprite = ScrollingSprite;

        Zap.components.register('Demo.Graphics.ScrollingSprite', Demo.Graphics.ScrollingSprite);
    })(Demo.Graphics || (Demo.Graphics = {}));
    var Graphics = Demo.Graphics;
})(Demo || (Demo = {}));

/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    (function (Input) {
        var UpwardsForceController = (function (_super) {
            __extends(UpwardsForceController, _super);
            function UpwardsForceController(config) {
                _super.call(this, config);
                this.upwardsAcc = +config.upwardsAcc || 100;
                this.offset = 0;
            }
            UpwardsForceController.prototype.init = function (entity) {
                _super.prototype.init.call(this, entity);
                this.acceleration = entity.sprite.body.acceleration;
            };

            UpwardsForceController.prototype.update = function () {
                if (Zap.engine.game.input.activePointer.isDown)
                    this.acceleration.y = -this.upwardsAcc;
                else
                    this.acceleration.y = 0;

                this.entity.sprite.angle = Zap.math.clamp(-90, 90, this.entity.sprite.body.velocity.y / 20);
                this.offset += 10;
                this.entity.sprite.angle += this.offset;
            };
            return UpwardsForceController;
        })(Zapcoder.Entities.Components.Component);
        Input.UpwardsForceController = UpwardsForceController;

        Zap.components.register('Demo.Input.UpwardsForceController', Demo.Input.UpwardsForceController);
    })(Demo.Input || (Demo.Input = {}));
    var Input = Demo.Input;
})(Demo || (Demo = {}));

/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    (function (Managers) {
        var GateManager = (function (_super) {
            __extends(GateManager, _super);
            function GateManager(config) {
                _super.call(this, config);
                this.lastTime = 0;
                this.currentTime = 0;
                this.gates = [];
                this.speed = +config.speed || -100;
                this.image = config.image || 'scenery.rockGrass';
                this.group = config.group || 'gate';
                this.space = +config.space || 300;
                this.frequency = +config.frequency || 5;
            }
            GateManager.prototype.init = function (entity) {
                _super.prototype.init.call(this, entity);
            };

            GateManager.prototype.update = function () {
                this.currentTime += Zap.engine.game.time.physicsElapsed;
                if (this.currentTime - this.lastTime > this.frequency) {
                    this.lastTime = this.currentTime;
                    this.gates.push(new Demo.Gate(this));
                }
            };
            return GateManager;
        })(Zapcoder.Entities.Components.Component);
        Managers.GateManager = GateManager;

        Zap.components.register('Demo.Managers.GateManager', Demo.Managers.GateManager);
    })(Demo.Managers || (Demo.Managers = {}));
    var Managers = Demo.Managers;
})(Demo || (Demo = {}));

/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    (function (Managers) {
        var GroundManager = (function (_super) {
            __extends(GroundManager, _super);
            function GroundManager(config) {
                _super.call(this, config);
                this.speed = +config.speed || -100;
                this.ground = config.ground || 'ground';
            }
            GroundManager.prototype.init = function (entity) {
                _super.prototype.init.call(this, entity);
                var ground = this.entity.manager.createEntity(this.ground);

                var scrollingSprite = ground.requestComponent('ScrollingSprite');
                scrollingSprite.velocity.x = this.speed;
                if (scrollingSprite) {
                    var sprites = scrollingSprite.sprites;
                    for (var i = 0; i < sprites.length; i++) {
                        sprites[i].y = Zap.engine.game.height - sprites[i].height;
                    }
                }
            };

            GroundManager.prototype.update = function () {
                // Add update code here
            };
            return GroundManager;
        })(Zapcoder.Entities.Components.Component);
        Managers.GroundManager = GroundManager;

        Zap.components.register('Demo.Managers.GroundManager', Demo.Managers.GroundManager);
    })(Demo.Managers || (Demo.Managers = {}));
    var Managers = Demo.Managers;
})(Demo || (Demo = {}));

/// <reference path="../../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../../sdk/definitions/zapcoder.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    (function (Physics) {
        var Gravity = (function (_super) {
            __extends(Gravity, _super);
            function Gravity(config) {
                _super.call(this, config);
                this.gravity = +config.gravity || 100;
            }
            Gravity.prototype.init = function (entity) {
                _super.prototype.init.call(this, entity);
                entity.sprite.body.gravity.setTo(0, this.gravity);
            };

            Gravity.prototype.update = function () {
                // Add update code here
            };
            return Gravity;
        })(Zapcoder.Entities.Components.Component);
        Physics.Gravity = Gravity;

        Zap.components.register('Demo.Physics.Gravity', Demo.Physics.Gravity);
    })(Demo.Physics || (Demo.Physics = {}));
    var Physics = Demo.Physics;
})(Demo || (Demo = {}));
