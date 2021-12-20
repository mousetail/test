const ball_speed = 1.5

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
        x: app.width / 2 - app.width/64,
        y: app.height / 2 - app.height/64,
        width: app.width/32,
        height: app.width/32,
        color: 'black',
        direction: [Math.sin(angle) * ball_speed * app.width / 1000, Math.cos(angle) * ball_speed * app.height /1000]
    });

};

app.onUpdate = function (time) {
    let ball = this.getNode('ball');
    if (ball.id) {
        ball.x += ball.direction[0] * time;
        ball.y += ball.direction[1] * time;

        if (ball.y < 0 || ball.y > app.height) {
            ball.direction[1]*=-1;
        }
    }


    //this.getNode('red-box').x += this.getNode('red-box').direction;
};