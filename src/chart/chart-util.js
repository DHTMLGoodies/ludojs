ludo.chart.ChartUtil = {


    getShape:function(shape, size){
        var s = size;
        if (shape == 'rotatedrect') {
            s = Math.sqrt((s * s) + (s * s));
        }

        var min = -(s / 2);
        var max = (s / 2);

        /*

         I know it's a bit late in the game, but I remembered this question from when it was new and I had a similar dillemma, and I accidently found the "right" solution, if anyone is still looking for one:

         <path
         d="
         M cx cy
         m -r, 0
         a r,r 0 1,0 (r * 2),0
         a r,r 0 1,0 -(r * 2),0
         "
         />
         In other words, this:

         <circle cx="100" cy="100" r="75" />
         can be achieved as a path with this:

         <path
         d="
         M 100, 100
         m -75, 0
         a 75,75 0 1,0 150,0
         a 75,75 0 1,0 -150,0
         "
         />
         */
        switch (shape) {
            case 'circle':
                var radius = size / 2;
                return ['m', min, 0,
                    'a', radius, radius, 0, 1, 0, size, 0,
                    'a', radius, radius, 0, 1, 0, -size, 0].join(' ');
            case 'rect':
                return ['M', min, min, 'L', max, min, max, max, min, max, min, min].join(' ');
            case 'triangle':
                return ['M', 0, min, 'L', max, max, min, max, 0, min].join(' ');
            case 'rotatedrect':
                return ['M', min, 0, "L", 0, min, max, 0, 0, max, min, 0].join(' ');

        }
    }

};