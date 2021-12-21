var app = {
    //initial variables
    canvas: null,
    context: null,

    //resizing
    width: 800,
    height: 400,

    //nodes
    nodes: [],

    //timing
    timestamp: 0,
    now: 0,
    lastUpdate: 0,

    init: function () {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');

        this.render();
        this.onInit();
    },
    render: function () {
        this.clear();
        this.update();

        window.requestAnimationFrame(this.render.bind(this));
    },
    clear: function () {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    update: function () {
        var dt = Date.now() - this.lastUpdate;

        this.onUpdate(dt);

        for (var index in this.nodes) {
            var node = this.nodes[index];

            this.context.fillStyle = node.color;
            if (node.type === 'rect') {
                this.context.fillRect(node.x, node.y, node.width, node.height);
            } else if (node.type === 'text') {
                this.context.fillText(node.text, node.x, node.y, node.width);
            } else if (node.type === 'circle') {
                this.context.beginPath();
                this.context.moveTo(node.x + node.width / 2, node.y);
                this.context.ellipse(
                    node.x  + node.width / 2, node.y + node.height / 2,
                    node.width / 2,
                    node.height / 2,
                    0,
                    0,
                    Math.PI * 2
                );
                this.context.fill()
            }
        }

        this.lastUpdate = Date.now();
        this.timestamp += dt;
    },
    getNode: function (id) {
        for (var index in this.nodes) {
            var node = this.nodes[index];

            if (node.id == id) {
                return node;
            }
        }

        return {x: null, y: null, width: null, height: null};
    },

    //events
    onInit: function () {
    },
    onUpdate: function () {
    }
};

window.onload = function () {
    app.init();
};