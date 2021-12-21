const ball_speed = 1.2

function object_collision(ob1, ob2) {
    return (
        (ob1.x < ob2.x && ob1.x + ob1.width > ob2.x ||
            ob1.x > ob2.x && ob1.x < ob2.x + ob2.width
        ) &&
        (ob1.y < ob2.y && ob1.y + ob1.height > ob2.y ||
            ob1.y > ob2.y && ob1.y < ob2.y + ob2.height)
    )
}

function ellipseCollision(paddle, ball) {
    let offset = [
        (ball.x + ball.width / 2 - paddle.x - paddle.width / 2) / (paddle.width * 2),
        (ball.y + ball.height / 2 - paddle.y - paddle.height / 2) / (paddle.height)];
    let angle = Math.atan2(offset[0], offset[1]);
    let tangent = [Math.sin(angle + Math.PI / 2) * paddle.width, Math.cos(angle + Math.PI / 2) * paddle.height];
    let normal = [-tangent[1], tangent[0]]; // Rotate tangent 90 degrees to get normal
    let normal_distance = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
    let normal_normalized = [normal[0] / normal_distance, normal[1] / normal_distance];
    let normal_dot_ball = normal_normalized[0] * ball.direction[0] + normal_normalized[1] * ball.direction[1] //Dot product
    ball.direction[0] -= 2 * normal_dot_ball * normal_normalized[0];
    ball.direction[1] -= 2 * normal_dot_ball  * normal_normalized[1];
}

app.onInit = function () {
    app.width = window.innerWidth;
    app.height = window.innerHeight;


    document.querySelector('canvas').width = window.innerWidth;
    document.querySelector('canvas').height = window.innerHeight;

    app.context.font = '96px "Nova Square", Arial';
    app.context.textAlign = 'center';

    this.nodes.push({
        type: 'rect',
        id: 'center-line-top',
        x: app.width / 2 - app.width / 256,
        y: 0,
        width: app.width / 128,
        height: app.height / 2 - app.height / 8,
        color: 'black'
    });


    this.nodes.push({
        type: 'rect',
        id: 'center-line-bottom',
        x: app.width / 2 - app.width / 256,
        y: app.height / 2 + app.height / 8,
        width: app.width / 128,
        height: app.height,
        color: 'black'
    });


    this.nodes.push({
        type: 'rect',
        id: 'left-paddle',
        x: app.width / 30,
        y: app.height / 2 - app.height / 8,
        width: app.width / 80,
        height: app.height / 4,
        color: 'red',
    });

    this.nodes.push({
        type: 'rect',
        id: 'right-paddle',
        x: app.width - app.width / 30 - app.width / 80,
        y: app.height / 2 - app.height / 8,
        width: app.width / 80,
        height: app.height / 4,
        color: 'red',
    })

    let direction = Math.random();
    this.nodes.push({
        type: 'circle',
        id: 'ball',
        x: app.width / 2 - app.width / 64,
        y: app.height / 2 - app.height / 64,
        width: app.width / 32,
        height: app.width / 32,
        color: 'red',
        direction: [direction > 0.5 ? -ball_speed : ball_speed, Math.random() * ball_speed * app.height / 1000]
    });

    this.nodes.push({
        type: 'text',
        id: 'left-score',
        x: app.width / 16,
        y: app.height / 8,
        color: 'black',
        text: '0'
    });


    this.nodes.push({
        type: 'text',
        id: 'right-score',
        x: app.width - app.width / 16,
        y: app.height / 8,
        color: 'black',
        text: '0'
    });

    this.nodes.push({
        type: 'text',
        id: 'paused-text',
        x: app.width / 2,
        y: app.height / 2,
        color: 'black',
        text: 'Press space to start'
    })

    this.paused = true;

    app.score = [0, 0]
};

function resetBall(ball) {
    ball.x = app.width / 2 - app.width / 64;
    ball.y = app.height / 2 - app.height / 64;

    let direction = Math.random();
    ball.direction = [direction > 0.5 ? -ball_speed : ball_speed, Math.random() * ball_speed * app.height / 1000];

    app.getNode('left-score').text = app.score[0];
    app.getNode('right-score').text = app.score[1];
}

app.pause = function () {
    app.paused = true;
}

app.reset = function () {
    resetBall(app.getNode('ball'));
    app.score = [0, 0];
}

app.onUpdate = function (time) {
    let ball = this.getNode('ball');
    if (ball.id && !app.paused) {
        app.getNode('paused-text').text = '';

        ball.x += ball.direction[0] * time;
        ball.y += ball.direction[1] * time;

        if (ball.y < 0 || ball.y + ball.height > app.height) {
            ball.direction[1] *= -1;
            ball.y += ball.direction[1] * time;
        }

        if (ball.x + ball.width < 0) {
            app.score[1] += 1;
            console.log("score ", JSON.stringify(app.score));
            resetBall(ball);
        } else if (ball.x > app.width) {
            app.score[0] += 1;
            console.log("score ", JSON.stringify(app.score));
            resetBall(ball);
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
                ellipseCollision(paddle, ball);

                ball.x += ball.direction[0] * time;
            }
        }
    } else {

        app.getNode('paused-text').text = 'Press space to start';
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
    if (ev.key === ' ') {
        app.paused ^= true;
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