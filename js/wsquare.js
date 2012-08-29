/**
*
* wsquare.js
* =========
*/
$(document).ready(function(){

    var Canvas = getCanvas("wsquare");

    // constants.
    var FPS = 30;
    var BG_COLOR = "#efefef";
    var BG_STROKE = "#0f0f0f";

    // holds constants that relate to the environment
    var WorldConfig = {
        CELL_SIZE : 50,
        CELL_COLOR : "brown",
        CELL_STROKE : "white"
    }

    // variables.
    var w = Canvas.width;
    var h = Canvas.height;
    var mouse = {x: 0, y: 0}; // represent the mouse with a point on the canvas.
    var isMouseDown = false;

    // holds variables that relate to the environment
    var World = {
        // an array of cells of the form {x: number, y: number}
        cells : []
    }

    // start setting it up
    setupFrame();
    drawBackground(BG_COLOR, BG_STROKE);

    var gameLoop = setInterval(function() {
        drawBackground(BG_COLOR, BG_STROKE);

        // draw cells
        for(var i = 0; i < World.cells.length; i++){
            drawCell(World.cells[i]);
        }
    }, 1000 / FPS);

    // ========================================
    // Helpers
    // ========================================

    function setupFrame(){
        Canvas.setCanvasSize(window.innerWidth, window.innerHeight);
        w = Canvas.width;
        h = Canvas.height;
    }

    function drawBackground(bg, stroke) {
        Canvas.drawBackground(bg, stroke);
    }

    function updateMouse(x, y) {
        mouse.x = x;
        mouse.y = y;
    }

    function drawCell(cell) {
        var color = WorldConfig.CELL_COLOR;
        var scolor = WorldConfig.CELL_STROKE;
        var size = WorldConfig.CELL_SIZE;
        var pos = {
            x: cell.x - (size / 2),
            y: cell.y - (size / 2)
        }

        Canvas.drawRect(color, scolor, pos, size, size);
    }

    function addCell(cell) {
        World.cells.push(cell);
    }

    // lets make it so whenever i click it draws a square with the click as the center

    // this block of code keeps track of the mouse.
    $(document).mousedown(function(e){
        updateMouse(e.pageX, e.pageY);
        isMouseDown = true;
    }).mouseup(function(e) {
        updateMouse(e.pageX, e.pageY);
        addCell({x: e.pageX, y: e.pageY});
        isMouseDown = false;
    }).mousemove(function(e){
        if(isMouseDown) {
            // all this crazy stuff cuz apparently
            // you can move the mouse into negative coordinates,
            //while the mouse is stuck on the edge
            var x = e.pageX;
            var y = e.pageY;
            if(x < 0) x = 0;
            if(y < 0) y = 0;
            if(x > w) x = w;
            if(y > h) y = h;
            updateMouse(x, y);
            addCell({x: x, y: y});
        }
    });

    // whenever the window resizes we'll resize too
    $(window).resize(function(){
        setupFrame();
    });

    function log(e) {
        console.log(e);
    }

});