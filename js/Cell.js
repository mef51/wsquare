// describe a Cell
var Cell = function(x, y, color, strokeColor, size){
    return {
        x: x,
        y: y,
        color: color,
        strokeColor: strokeColor,
        size: size,

        draw: function() {
            var color = this.color;
            var scolor = this.strokeColor;
            var size = this.size;
            var pos = {
                x: this.x - (size / 2),
                y: this.y - (size / 2)
            }
            Canvas.drawRect(color, scolor, pos, size, size);
        },

        equals: function(cell) {
            return this.x == cell.x && this.y == cell.y;
        }
    }
}