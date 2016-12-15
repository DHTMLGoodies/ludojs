
ludo.geometry = {

    toRadians: function (degrees) {
        return (degrees * Math.PI) / 180;
    },

    toDegrees: function (radians) {
        return radians * (180 / Math.PI);
    },

    getPointDistanceFrom:function(originX, originY, radiansFromOrigin, distance){
        var xDelta = distance * Math.cos(radiansFromOrigin);
        var yDelta = distance * Math.sin(radiansFromOrigin);

        return {
            x: originX + xDelta, y: originY + yDelta
        }
    },

    getPoint: function (originX, originY, degreesFromOrigin, distance) {
        return this.getPointDistanceFrom(originX, originY, this.toRadians(degreesFromOrigin), distance);
    },

    distanceBetweenPoints: function (x1, y1, x2, y2) {

        var xDiff = Math.abs(x2 - x1);
        var yDiff = Math.abs(y2 - y1);

        return this.distanceBetweenVectors(xDiff, yDiff);
    },

    distanceBetweenVectors: function (vectorX, vectorY) {
        return Math.sqrt((vectorX * vectorX) + (vectorY * vectorY));

    },

    // Returns angle in degrees
    // @function getAngleFrom
    // @memberOf ludo.geometry
    getAngleFrom: function (fromX, fromY, toX, toY) {
        var angle = this.toDegrees(Math.atan2(fromY - toY, fromX - toX));

        if (angle < 0) {
            angle += 360;
        }
        angle = ((angle - 90) + 360) % 360;
        return angle;
    },

    cosSinBetween:function(lat1, long1, lat2, long2) {
        var dLon = (long2 - long1);

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
            * Math.cos(lat2) * Math.cos(dLon);

        var brng = Math.atan2(y, x);

        // TODO this should be moved out
        // Temporary fix since 0 degrees(NORTH) is right in view
        brng -= this.toRadians(90);

        return { x: Math.cos(brng), y: Math.sin(brng) };
    },

    bearing: function (lat1, long1, lat2, long2) {
        var dLon = (long2 - long1);

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
            * Math.cos(lat2) * Math.cos(dLon);

        var brng = Math.atan2(y, x);
        brng = this.toDegrees(brng);
        brng = (brng + 360) % 360;
        brng = 360 - brng;

        return brng;
    },

    isWithinBox:function(x,y,boxX,boxY,boxWidth,boxHeight){
        return x >= boxX && y >= boxY && x<= x + boxWidth && y <= y + boxHeight;
    }


};