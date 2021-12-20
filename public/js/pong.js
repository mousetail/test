const ball_speed = 0.75

function object_collision(ob1, ob2) {
    return (
        (ob1.x < ob2.x && ob1.x + ob1.width > ob2.x ||
            ob1.x > ob2.x && ob1.x < ob2.x + ob2.width
        ) &&
        (ob1.y < ob2.y && ob1.y + ob1.height > ob2.y ||
            ob1.y > ob2.y && ob1.y < ob2.y + ob2.height)
    )
}

app.onInit = function () {
    app.width = window.innerWidth;
    app.height = window.innerHeight;


    document.querySelector('canvas').width = window.innerWidth;
    document.querySelector('canvas').height = window.innerHeight;

    this.nodes.push({
        id: 'left-paddle',
        x: app.width / 30,
        y: app.height / 2 - app.height / 8,
        width: app.width / 40,
        height: app.height / 4,
        color: 'red',
    });

    this.nodes.push({
        id: 'right-paddle',
        x: app.width - app.width / 30 - app.width / 40,
        y: app.height / 2 - app.height / 8,
        width: app.width / 40,
        height: app.height / 4,
        color: 'red',
    })

    let angle = Math.random() * 2 * Math.PI
    this.nodes.push({
        id: 'ball',
        x: app.width / 2 - app.width / 64,
        y: app.height / 2 - app.height / 64,
        width: app.width / 32,
        height: app.width / 32,
        color: 'black',
        direction: [Math.sin(angle) * ball_speed * app.width / 1000, Math.cos(angle) * ball_speed * app.height / 1000]
    });

};

app.onUpdate = function (time) {
    let ball = this.getNode('ball');
    if (ball.id) {
        ball.x += ball.direction[0] * time;
        ball.y += ball.direction[1] * time;

        if (ball.y < 0 || ball.y > app.height) {
            ball.direction[1] *= -1;
            ball.y += ball.direction[1] * time;
        }


        let paddles = [this.getNode('left-paddle'), this.getNode('right-paddle')];
        for (let paddle of paddles) {
            if (paddle.up_pressed) {
                paddle.y -= time * app.height * 0.0025;
            }
            if (paddle.down_pressed) {
                paddle.y += time * app.height * 0.0025;
            }

            if (object_collision(ball, paddle)) {
                paddle.x += 1;
                ball.direction[0] *= -1;
                ball.x += ball.direction[0] * time;
            }
        }

    }
    //this.getNode('red-box').x += this.getNode('red-box').direction;
};

addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowUp') {
        app.getNode(
            'right-paddle'
        ).up_pressed = true;
    }
    if (ev.key === 'ArrowDown') {
        app.getNode(
            'right-paddle'
        ).down_pressed = true;
    }
    if (ev.key === 'w') {
        app.getNode(
            'left-paddle'
        ).up_pressed = true;
    }
    if (ev.key === 's') {
        app.getNode(
            'left-paddle'
        ).down_pressed = true;
    }
});

addEventListener('keyup', function (ev) {
    if (ev.key === 'ArrowUp') {
        app.getNode(
            'right-paddle'
        ).up_pressed = false;
    }
    if (ev.key === 'ArrowDown') {
        app.getNode(
            'right-paddle'
        ).down_pressed = false;
    }
    if (ev.key === 'w') {
        app.getNode(
            'left-paddle'
        ).up_pressed = false;
    }
    if (ev.key === 's') {
        app.getNode(
            'left-paddle'
        ).down_pressed = false;
    }
})