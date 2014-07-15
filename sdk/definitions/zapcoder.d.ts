declare module Zapcoder {
    module Collisions {
        class CollisionManager {}
    }

    module Entities {
        module Components {
            class Component {
                config;
                entity: Zapcoder.Entities.Entity;
                constructor(config);
                init(entity:Zapcoder.Entities.Entity);
                update();
                render();
                kill();
            }
        }

        class Entity {
            id;
            sprite: Phaser.Sprite;
            manager: EntityManager;
            events: Zapcoder.Events.EventDispatcher;
            pos;
            constructor(config);
            update();
            init(manager:EntityManager);
            addComponent(component:Zapcoder.Entities.Components.Component);
            setSprite(sprite:Phaser.Sprite);
            kill();
            onCollision(entity:Entity);
        }

        class EntityFactory {
            create(data); 
        }

        class EntityManager {
            background: Phaser.Group;
            foreground: Phaser.Group;
            entities: Zapcoder.Entities.Entity[];
            events: Zapcoder.Events.EventDispatcher;
            messages: Zapcoder.Messages.MessageDispatcher;
            groups;
            factory: EntityFactory;
            state: Phaser.State;
            addEntity(entity:Zapcoder.Entities.Entity);
            createEntity(name:string);
            getEntity(id);
            removeEntity(id);
        }
    }

    module Events {
        class Event {
            type:string;
            data;
            sender;
        }

        class EventDispatcher {
            listen(type:string, callback);  
            add(event:Event);
            remove(type:string, id);
        }

        class EventPool{
            create(type, data, sender);
        }
    }

    module Input {
        class Controller {
            right;             
            left;
            setRight(touchable);
            setLeft(touchable);
        }

        class Touchable {
            constructor( controller );
            controller: Controller; 
            active: boolean;    
            activeInput;
            originX:number;
            originY:number;
        }

        class Button extends Touchable{}
        class Thumbstick extends Touchable{
            nx:number;
            ny:number;
        }
    }
    module Messages {
        class Message {
            type;
            sender;
            recipientId;
            data;
        }

        class MessageDispatcher {
            listen(type:string, object, callback);
            add(message:Zapcoder.Messages.Message);
            remove(type:string, id);
        }

        class MessagePool{
            create(type, data, recipientId: number, sender);
        }
    }
    module Registers {
        class ComponentRegister {
            register(key:string, component:Zapcoder.Entities.Components.Component);
            static request(key:string);
        }

        class EntityRegister {
            static register(key:string, entity:Zapcoder.Entities.Entity); 
            static request(key:string);
        }
    }
    module Session {
        class Session {
            public score:number; 
        }
        class User {}
    }
    module States {
        class State {
            engine: Zapcoder.Engine;
        }

        class TemplateState extends State{
            entities: Zapcoder.Entities.EntityManager;
            collisions: Zapcoder.Collisions.CollisionManager;
        }
    }

    module Util {
        class Pool {
            constructor(size:number, object);
            create(); 
        }
        class Queue<T> {
            add(item:T);
            next();
        }
        class Screen {
            stringToCoord(text:string);
        }
    }

    class Engine {
        game: Phaser.Game;
        events: Zapcoder.Events.EventPool;
        messages: Zapcoder.Messages.MessagePool;
        controller: Zapcoder.Input.Controller;
        session: Zapcoder.Session.Session;
        screen: Zapcoder.Util.Screen;
        win();
        lose();
    }

    class ZMath {
        PIm2: number;
        PId180: number;
        randomRange(min:number, max:number);
        min(a:number, b:number);
        max(a:number, b:number);
        clamp(min:number, max:number, value:number);
        radToDeg(rad:number);
        degToRad(deg:number);
    }
}

declare class Zap {
    static components;
    static engine: Zapcoder.Engine;
    static math: Zapcoder.ZMath;
    static entities;
}