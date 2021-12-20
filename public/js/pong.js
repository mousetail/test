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
        direction: 0
    });

    this.nodes.push({
        id: 'right-paddle',
        x: app.width - app.width / 30 - app.width / 40,
        y: app.height / 2 - app.height / 8,
        width: app.width / 40,
        height: app.height / 4,
        color: 'red',
        direction: 0
    })

    this.nodes.push({
        id: 'ball',
        x: app.width / 2 - app.width/64,
        y: app.height / 2 - app.height/64,
        width: app.width/32,
        height: app.width/32,
        color: 'black'
    });

};

app.onUpdate = function (time) {
    this.getNode('black-box').y++;

    if (Math.cos(this.timestamp / 100) > 0) {
        this.getNode('red-box').direction = -1;
    } else {
        this.getNode('red-box').direction = 1;
    }

    this.getNode('red-box').x += this.getNode('red-box').direction;
};