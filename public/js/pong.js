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
        width: app.width / 80,
        height: app.height / 4,
        color: 'red',
    });

    this.nodes.push({
        id: 'right-paddle',
        x: app.width - app.width / 30 - app.width / 80,
        y: app.height / 2 - app.height / 8,
        width: app.width / 80,
        height: app.height / 4,
        color: 'red',
    })

    let direction = Math.random();
    this.nodes.push({
        id: 'ball',
        x: app.width / 2 - app.width / 64,
        y: app.height / 2 - app.height / 64,
        width: app.width / 32,
        height: app.width / 32,
        color: 'black',
        direction: [direction > 0.5 ? -ball_speed : ball_speed, Math.random() * ball_speed * app.height / 1000]
    });

};

app.onUpdate = function (time) {
    let ball = this.getNode('ball');
    if (ball.id) {
        ball.x += ball.direction[0] * time;
        ball.y += ball.direction[1] * time;

        if (ball.y < 0 || ball.y + ball.height > app.height) {
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
                ball.direction[0] *= -1;
                let offset_factor = 0.0025 * ((ball.y - ball.height / 2) - (paddle.y - paddle.height / 2));
                ball.direction[1] += offset_factor;

                if (ball.direction[1] > 3 * ball_speed * app.height / 10000) {
                    ball.direction[1] = 3 * ball_speed * app.height / 10000;
                } else if (ball.direction[1] < 3 * -ball_speed * app.height / 10000) {
                    ball.direction[1] = 3 * -ball_speed * app.height / 10000;
                }

                ball.x += ball.direction[0] * time;
            }
        }

    }
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