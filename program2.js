// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;
    Mouse = Matter.Mouse;
    MouseConstraint = Matter.MouseConstraint;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0.2;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 1000
    }
});

function getBall() {
    var boxA = Bodies.circle(350 + Math.random() * 100, 0, 15);
    boxA.friction = 0.000000001;
    boxA.frictionAir = 0.00000005;
    boxA.restitution = 0.8;
    return boxA;
}
var boxB = Bodies.rectangle(400, 500, 100, 20, {isStatic: true});
boxB.friction = 0.01;
boxB.restitution = 0;
boxB.frictionAir = 0.0005;
boxB.mass = 100;
var ground = Bodies.rectangle(400, 910, 810, 60, { isStatic: true });

let staff = [];
function addStaticCircle(x, y) {
    let circle = Bodies.circle(x, y, 5, {isStatic: true});
    staff.push(circle);
}

function addPlank(x) {
    let circle = Bodies.rectangle(x, 680, 10, 450, {isStatic: true});
    staff.push(circle);
}

for(let i = 50; i < 800; i += 50) {
    addPlank(i);
    for(let j = 100; j < 500; j += 50) {
        let x = i;
        if(j % 100 === 0) {
            x += 25;
        }
        addStaticCircle(x, j);
    }
}
// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 1,
            render: {
                visible: true
            }
        }
    });


// keep the mouse in sync with rendering
render.mouse = mouse;

// add all of the bodies to the world
let all = [ground, mouseConstraint];
// let all = [];
all = all.concat(staff);
World.add(engine.world, all);

setTimeout(
    ()=>{
        World.add(engine.world, getBall());
    },
    500
)
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

  function onClick() {
    // feature detect
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', function(event) {
                console.log(event.alpha + ' : ' + event.beta + ' : ' + event.gamma);
                engine.world.gravity.y = Math.sin(event.beta * 2 * Math.PI / 360);
                engine.world.gravity.x = Math.sin(event.gamma * 2 * Math.PI / 360);
              });          
            }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }
}