(function gameSetup() {
    'use strict';
    // Create your "ship" object and any other variables you might need...

    var ship = {
        shipElem: document.getElementById('ship'),
        currentVelocity: 0,
        currentAngle: 0
    };
    //          |--------------obj------------------|
    console.log(ship.shipElem.getBoundingClientRect());



    var allAsteroids = []; //<---an array?
    ship.shipElem.addEventListener('asteroidDetected', function (event) {
        // You can detect when a new asteroid appears with this event.
        // The new asteroid's HTML element will be in:  event.detail

        allAsteroids.push(event.detail);// What might you need/want to do in here?
        //console.log(event.detail, event.detail.getBoundingClientRect().width);
    });



    // if (allAsteroids.length >= 1 ) {
    //     console.log(allAsteroids.event.detail.getBoundingClientRect());
    // }
    /**
     * Use this function to handle when a key is pressed. Which key? Use the
     * event.keyCode property to know:
     *
     * 37 = left
     * 38 = up
     * 39 = right
     * 40 = down
     *
     * @param  {Event} event   The "keyup" event object with a bunch of data in it
     * @return {void}          In other words, no need to return anything
     */
    function handleKeys(event) {
        //console.log(event.keyCode, typeof(event.keyCode));

        if (event.keyCode === 38) { //up
             ship.currentVelocity++;
         } else if (event.keyCode === 40) {//down
             if (ship.currentVelocity < 0) {
                 ship.currentVelocity = 0;
             } else if (ship.currentVelocity > 0) {
                 ship.currentVelocity--;
             }
         } else if (event.keyCode === 37) {//left
             ship.currentAngle -= 10;
             ship.shipElem.style.transform = 'rotate(' + ship.currentAngle + 'deg)';
         } else if (event.keyCode === 39) {//right
             ship.currentAngle += 10;
             ship.shipElem.style.transform = 'rotate(' + ship.currentAngle + 'deg)';
         }
         console.log(ship.currentVelocity, ship.currentAngle);
     }

    document.querySelector('body').addEventListener('keyup', handleKeys);

    /**
     * This is the primary "game loop"... in traditional game development, things
     * happen in a loop like this. This function will execute every 20 milliseconds
     * in order to do various things. For example, this is when all game entities
     * (ships, etc) should be moved, and also when things like hit detection happen.
     *
     * @return {void}
     */
    function gameLoop() {
        // This function for getting ship movement is given to you (at the bottom).
        // NOTE: you will need to change these arguments to match your ship object!
        // What does this function return? What will be in the `move` variable?
        // Read the documentation!
        var move = getShipMovement(ship.currentVelocity, ship.currentAngle);

        if ( ship.shipElem.style.top.length === 0) {
            ship.shipElem.style.top = '0px';
        }
        ship.shipElem.style.top = (parseInt(ship.shipElem.style.top, 10) - move.top) + 'px';

        if ( ship.shipElem.style.left.length === 0) {
            ship.shipElem.style.left = '0px';
        }
        ship.shipElem.style.left = (parseInt(ship.shipElem.style.left, 10) + move.left) + 'px';

        //WRAP THE SCREEN

        var w = window;
        var x = w.innerWidth;
        var y = w.innerHeight;

        if ( (parseInt(ship.shipElem.style.left, 10)) < 0 ) {
            // console.log(typeof(w.innerWidth));
            ship.shipElem.style.left = w.innerWidth + 'px';
        } else if ( (parseInt(ship.shipElem.style.top, 10) < 0)) {
            ship.shipElem.style.top = w.innerHeight + 'px';
        } else if ( (parseInt(ship.shipElem.style.left, 10) > w.innerWidth)) {
            ship.shipElem.style.left = '0px';
        } else if ( (parseInt(ship.shipElem.style.top, 10) > w.innerHeight)) {
            ship.shipElem.style.top = '0px';
        }

        if ( ((parseInt(ship.shipElem.style.left, 10)) < 0) && (parseInt(ship.shipElem.style.top, 10) < 0) ) {
            ship.shipElem.style.left = w.innerWidth + 'px';
            ship.shipElem.style.top = w.innerHeight + 'px';
        } else if ( ((parseInt(ship.shipElem.style.left, 10)) > w.innerWidth) && (parseInt(ship.shipElem.style.top, 10) > w.innerHeight) ) {
            ship.shipElem.style.left = '0px';
            ship.shipElem.style.top = '0px';
        } else if ( ((parseInt(ship.shipElem.style.left, 10)) > w.innerWidth) && (parseInt(ship.shipElem.style.top, 10) < 0) ) {
            ship.shipElem.style.left = '0px';
            ship.shipElem.style.top = w.innerHeight + 'px';
        } else if ( ((parseInt(ship.shipElem.style.left, 10)) < 0) && (parseInt(ship.shipElem.style.top, 10) > w.innerHeight )) {
            ship.shipElem.style.left = w.innerWidth + 'px';
            ship.shipElem.style.top = '0px';
        }
        // Time to check for any collisions (see below)...
        checkForCollisions();
    }

    /**
     * This function checks for any collisions between asteroids and the ship.
     * If a collision is detected, the crash method should be called with the
     * asteroid that was hit:
     *    crash(someAsteroidElement);
     *
     * You can get the bounding box of an element using:
     *    someElement.getBoundingClientRect();
     *
     * A bounding box is an object with top, left, width, and height properties
     * that you can use to detect whether one box is on top of another.
     *
     * @return void
     */
    function checkForCollisions() {
        var shipBox = ship.shipElem.getBoundingClientRect();
        var astBox, i, l;
        for ( i=0, l=allAsteroids.length; i<l; i++) {
            astBox = allAsteroids[i].getBoundingClientRect();

            // move into fn below?
            if ( (shipBox.top <= astBox.top) && (astBox.top <= (shipBox.top + shipBox.height) ) && ( (shipBox.left <= astBox.left) && (astBox.left <= (shipBox.left + shipBox.width))) ){
                crash(allAsteroids[i]);
            } else if ( ( (shipBox.top <= astBox.top) && (astBox.top <= (shipBox.top + shipBox.height)) ) && ( (shipBox.right <= astBox.right) && ( astBox.right <= (shipBox.right + shipBox.width)) ) ) {
                crash(allAsteroids[i]);
            } else if ( ( (shipBox.bottom <= astBox.bottom) && (astBox.bottom <= (shipBox.bottom + shipBox.width)) ) && ( (shipBox.right <= astBox.right) && (astBox.right <= (shipBox.right+ shipBox.width)) ) ) {
                crash(allAsteroids[i]);
            } else if ( ( (shipBox.bottom <= astBox.bottom) && (astBox.bottom <= (shipBox.bottom + shipBox.height))) && ( (shipBox.left <= astBox.left) && (astBox.left <= (shipBox.left + shipBox.width))) ) {
                crash(allAsteroids[i])
            }

        }

        // Implement me!

    }

    function isBoxInBox(boxA, boxB) {
        return true; // or false
    }


    /**
     * This event handler will execute when a crash occurs
     *
     * return {void}
     */
    document.querySelector('main').addEventListener('crash', function () {
        console.log('A crash occurred!');

        ship.currentVelocity = 0;
        // What might you need/want to do in here?

    });



    /** ************************************************************************
     *             These functions and code are given to you.
     *
     *                   !!! DO NOT EDIT BELOW HERE !!!
     ** ************************************************************************/

     var loopHandle = setInterval(gameLoop, 20);

     /**
      * Executes the code required when a crash has occurred. You should call
      * this function when a collision has been detected with the asteroid that
      * was hit as the only argument.
      *
      * @param  {HTMLElement} asteroidHit The HTML element of the hit asteroid
      * @return {void}
      */
    function crash(asteroidHit) {
        document.querySelector('body').removeEventListener('keyup', handleKeys);
        asteroidHit.classList.add('hit');
        document.querySelector('#ship').classList.add('crash');

        var event = new CustomEvent('crash', { detail: asteroidHit });
        document.querySelector('main').dispatchEvent(event);
    }

    /**
     * Get the change in ship position (movement) given the current velocity
     * and angle the ship is pointing.
     *
     * @param  {Number} velocity The current speed of the ship (no units)
     * @param  {Number} angle    The angle the ship is pointing (no units)
     * @return {Object}          The amount to move the ship by with regard to left and top position (object with two properties)
     */
    function getShipMovement(velocity, angle) {
        return {
            left: (velocity * Math.sin(angle * Math.PI / 180)),
            top: (velocity * Math.cos(angle * Math.PI / 180))
        };
    }

})();
