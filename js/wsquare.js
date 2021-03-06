/**
*
* wsquare.js
* =========
*/
$(document).ready(function(){

    // constants.
    var FPS = 30;
    var BG_COLOR = "#efefef";
    var BG_STROKE = "#0f0f0f";

    // variables.
    var w = Canvas.width;
    var h = Canvas.height;
    var mouse = {x: 0, y: 0}; // represent the mouse with a point on the canvas.
    var isMouseDown = false;

    // start setting it up
    setupFrame();
    drawBackground(BG_COLOR, BG_STROKE);

    // holds variables that relate to the environment
    var World = {
        // an array of cells of the form Cell below
        cells : [],
        grid : {
            origin : {x: -1, y: -1}, // -1 signals uninitialized
            cellsize : -1
        },
    };

    // initially place character
    var character = new Cell(0, 0, CharacterConfig.COLOR, CharacterConfig.STROKE_COLOR, CharacterConfig.SIZE);
    initializeCharacter(character);
    

    // All the Important(tm) stuff is here.
    var gameLoop = setInterval(function() {
        drawBackground(BG_COLOR, BG_STROKE);
        placeCells(World.cells);
        updateCharacter(character);
    }, 1000 / FPS);

    // ========================================
    // Character Stuff
    // ========================================

    function updateCharacter(character) {
        collision = getCollision(character);
        if(collision){
            log("boom!");
            if(collision.isBottomCollision){
                character.dy = 0;
                character.y = collision.cell.y - CharacterConfig.SIZE;
            }
            else{
                character.dy = 0;
                character.y = collision.cell.y + WorldConfig.CELL_SIZE;
            }
        }
        else{
            fall(character);
        }

        if(isOnScreen(character.x, character.y))
            character.draw();
        else
            initializeCharacter(character);
    }

    function initializeCharacter(character) {
        character.x = w / CharacterConfig.INITIAL_X_PROPORTION;
        // character.y = h / CharacterConfig.INITIAL_Y_PROPORTION;
        character.y = 0;
        character.dx = 0;
        character.dy = 0;
    }

    function fall(character) {
        character.dy += WorldConfig.GRAVITY / 2;
        character.y += character.dy;
        character.dy += WorldConfig.GRAVITY / 2;
    }

    function getCollision(character) {
        // check every corner of the box character.
        var topLeftCorner = {
            x : character.x,
            y : character.y
        };

        var topRightCorner = {
            x : character.x + CharacterConfig.SIZE,
            y : character.y
        };

        var botLeftCorner = {
            x : character.x,
            y : character.y + CharacterConfig.SIZE
        };

        var botRightCorner = {
            x : character.x + CharacterConfig.SIZE,
            y : character.y + CharacterConfig.SIZE
        };

        for(var i = 0; i < World.cells.length; i++){
            var cellRect = {
                x : World.cells[i].x,
                y : World.cells[i].y
            }
            var size = World.cells[i].size;

            // character fell and hit the ground
            if(isInRect(botLeftCorner, cellRect, size, size) || isInRect(botRightCorner, cellRect, size, size)){
                return {
                    cell : World.cells[i],
                    isBottomCollision : true
                }
            }

            // character jumped and hit its head
            if(isInRect(botLeftCorner, cellRect, size, size) || isInRect(botRightCorner, cellRect, size, size)){
                return {
                    cell : World.cells[i],
                    isBottomCollision : false
                }
            }
        }
        return null;
    }

    // ========================================
    // Helpers
    // ========================================

    function setupFrame() {
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

    /**
    * Expects an array 'cells' of the form 'Cell'
    */
    function placeCells(cells) {
        // draw cells
        for(var i = 0; i < World.cells.length; i++){
            World.cells[i].draw();
        }
    }

    function addCell(cell) {
        var c = new Cell(cell.x, cell.y, WorldConfig.CELL_COLOR, WorldConfig.CELL_STROKE, WorldConfig.CELL_SIZE);

        // only add a cell if it isnt already in the array.
        var isDuplicate = false;
        for(var i = 0; i < World.cells.length && !isDuplicate; i++){
            if(c.equals(World.cells[i])) isDuplicate = true;
        }

        if(!isDuplicate) World.cells.push(c);
    }

    /**
    * Get the cell that the point (x, y) is in
    * in relation to the grid specified by 'grid'.
    * The point (x, y) is on the pixel grid.
    *
    * All the size/2 stuff is incidental complexity
    * from drawing the square around the mouse (see drawCell()).
    *
    * You can generate the whole grid with.
    * pixel coordinates = size * (x on grid) + origin
    * for-loop with (x on grid) as your increment to get
    * cells in a row.
    *
    * I don't understand much of the math here.
    * I guessed it all.
    * It was all trial and error.
    * It's two in the morning.
    * It works.
    */
    function getContainingCell(x, y, grid){
        var origin = {
            x: grid.origin.x,
            y: grid.origin.y
        };
        var size = grid.cellsize;

        var ix = Math.floor((x - origin.x - size/2) / size);
        var iy = Math.floor((y - origin.y - size/2) / size);

        return {
            x: origin.x + size * ix + size,
            y: origin.y + size * iy + size
        };
    }

    function isOnScreen(x, y) {
        return x >= 0 && y >= 0 && x <= w && y <= h;
    }

    /**
    * Generalization of isOnScreen
    * Check if Point is in the rectangle
    * at RectPoint of width w and height h
    */
    function isInRect(Point, RectPoint, w, h) {
        return Point.x >= RectPoint.x && Point.y >= RectPoint.y && Point.x <= RectPoint.x + w && Point.y <= RectPoint.y + h;
    }

    // ========================================
    // Handlers
    // ========================================

    // lets make it so whenever i click it draws a square with the click as the center

    // this block of code keeps track of the mouse.
    // only addCell when mouseup, otherwise, update the hoverCell
    $(document).mousedown(function(e){
        updateMouse(e.pageX, e.pageY);
        isMouseDown = true;

        if(World.grid.origin.x == -1) { // if grid is not init'ed
            World.grid.origin = {x: e.pageX, y: e.pageY};
            World.grid.cellsize = WorldConfig.CELL_SIZE;

            addCell(World.grid.origin);
        }
        else {
            addCell(getContainingCell(e.pageX, e.pageY, World.grid));
        }
    }).mouseup(function(e) {
        updateMouse(e.pageX, e.pageY);
        isMouseDown = false;
    }).mousemove(function(e){
        if(isMouseDown) {
            // all this crazy stuff cuz apparently
            // you can move the mouse into negative coordinates,
            // while the mouse is stuck on the edge
            var x = e.pageX;
            var y = e.pageY;
            if(x < 0) x = 0;
            if(y < 0) y = 0;
            if(x > w) x = w;
            if(y > h) y = h;
            updateMouse(x, y);

            // this will lead to many duplicate cells.
            addCell(getContainingCell(x, y, World.grid));
        }
    }).keydown(function(e){
        // left
        if(e.keyCode == 37){
            log("left!");
        }

        // up
        if(e.keyCode == 38){
            log("up!");
        }

        // right
        if(e.keyCode == 39){
            log("right!");
        }

        // down
        if(e.keyCode == 40){
            log("down!");
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