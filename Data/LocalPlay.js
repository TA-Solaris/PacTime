///// PACTIME TWO PLAYER CODE /////

/// Making the code listen for keypresses
document.onkeydown = checkKey;

/// Assigning Code Constants
var POWERTIME = 20;
var NUMROWS = 22;
var NUMCOLUMNS = 22;

/// Assigning Varibles

// Misc Variables
var GPip = 0;
var GPower = 0;
var PipNum = 0;
var Power = 0;
var WillCrash = false;
var GhostKilled = false;
var intervalHandle;

// To store movement direction
var PxDir = 0;
var PyDir = 0;
var GxDir = 0;
var GyDir = 0;
var LastPxDir = 0;
var LastPyDir = 0;
var LastGxDir = 0;
var LastGyDir = 0;

// To store current column position
var Pcolumn = 0;
var Prow = 0;
var Gcolumn = 0;
var Grow = 0;

/// Check the keypress
function checkKey(e) {
    // this next line is a workaround for older versions of IE which didn't pass the event as a parameter
    e = e || window.event;

    if (e.keyCode == '39') { // right arrow
	    PxDir = 1;
      PyDir = 0;
    } else if (e.keyCode == '37') { // left arrow
	    PxDir = -1;
      PyDir = 0;
    } else if (e.keyCode == '40') { // down arrow
	    PyDir = 1;
      PxDir = 0;
    } else if (e.keyCode == '38') { // up arrow
	    PyDir = -1;
      PxDir = 0;
    }
    if (e.keyCode == '68') { // d
	    GxDir = 1;
      GyDir = 0;
    } else if (e.keyCode == '65') { // a
	    GxDir = -1;
      GyDIr = 0;
    } else if (e.keyCode == '83') { // s
	    GyDir = 1;
      GxDir = 0;
    } else if (e.keyCode == '87') { // w
	    GyDir = -1;
      GxDir = 0;
    }
}

/// Called when the page is loaded
function runGame() {
  var x;
  var y;
  for (x = 0; x < NUMROWS; x++) {
    for (y = 0; y < NUMCOLUMNS; y++) {
      // Count the Pips
      if ((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "Pip") {
        PipNum += 1;
      }
      // Find PacMan
      if (((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "Pacman_left") || ((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "Pacman_right") || ((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "Pacman_up") || ((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "Pacman_down")) {
        Prow = x;
        Pcolumn = y;
      }
      // Find Ghost
      if ((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "Ghost") {
        Grow = x;
        Gcolumn = y;
      }
    }
  }
  // Start the clock
	intervalHandle = setInterval(updatePosition, 200);
}

/// The clock funtion which runs every interval
function updatePosition() {
  // If power is active then it decrements with time
  if (Power != 0) {
    Power += -1;
    // Set the Weak Ghost back to Ghost when the power ends
    if (Power == 0) {
      var x;
      var y;
      for (x = 0; x < NUMROWS; x++) {
        for (y = 0; y < NUMCOLUMNS; y++) {
          if ((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "GhostWeak") {
            document.getElementById("r" + x + " c" + y).className = "Ghost";
          }
        }
      }
    }
  }
	if (PxDir != 0 || PyDir != 0) {
    if ((document.getElementById("r" + (Prow + PyDir) + " c" + (Pcolumn + PxDir)).getAttribute('class')) != "Wall") {
      if (document.getElementById("r" + Prow + " c" +   Pcolumn)) {
        if ((document.getElementById("r" + (Prow + PyDir) + " c" + (Pcolumn + PxDir)).getAttribute('class')) != "Ghost") {
          // If Pacman eats the weak Ghost
          if ((document.getElementById("r" + (Prow + PyDir) + " c" + (Pcolumn + PxDir)).getAttribute('class')) == "GhostWeak") {
            GhostKilled = true;
            WillCrash = true;
          }
          // Victory condition for PacMan
          if ((document.getElementById("r" + (Prow + PyDir) + " c" + (Pcolumn + PxDir)).getAttribute('class')) == "Pip") {
            PipNum += -1;
            if (PipNum == 0) {
              end()
            }
          }
          // If a Powerup is picked up then Pacman gain POWERTIME
          if ((document.getElementById("r" + (Prow + PyDir) + " c" + (Pcolumn + PxDir)).getAttribute('class')) == "Powerup") {
            Power += POWERTIME;
            // Set the Ghost to be weak
            var x;
            var y;
            for (x = 0; x < NUMROWS; x++) {
              for (y = 0; y < NUMCOLUMNS; y++) {
                if ((document.getElementById("r" + x + " c" + y).getAttribute('class')) == "Ghost") {
                  document.getElementById("r" + x + " c" + y).className = "GhostWeak";
                }
              }
            }
          }
          // Set the cell where PacMan was to empty
          document.getElementById("r" + Prow + " c" + Pcolumn).className = "Empty";
          // Check if there is a Portal where the Pacman is going to move
          if ((document.getElementById("r" + (Prow + PyDir) + " c" + (Pcolumn + PxDir)).getAttribute('class')) == "Portal") {
            if (Pcolumn > (NUMCOLUMNS/2)) {
              Pcolumn = NUMCOLUMNS - (Pcolumn + 2); // right side
            } else {
              Pcolumn = NUMCOLUMNS - Pcolumn; // left side
            }
          }
          // Update the column position for PacMan
  	      Pcolumn += PxDir;
          Prow += PyDir;
          // Re-draw the PacMan
          if (PxDir == 1) {
            document.getElementById("r" + Prow + " c" + Pcolumn).className = "Pacman_left";
          } else {
            if (PxDir == -1) {
              document.getElementById("r" + Prow + " c" + Pcolumn).className = "Pacman_right";
            } else {
              if (PyDir == 1) {
                document.getElementById("r" + Prow + " c" + Pcolumn).className = "Pacman_down";
              } else {
                if (PyDir == -1) {
                  document.getElementById("r" + Prow + " c" + Pcolumn).className = "Pacman_up";
                }
              }
            }
          }
          LastPxDir = PxDir;
          LastPyDir = PyDir;
          if (WillCrash == true) {
            end()
          }
        } else {
          // Set the cell where PacMan was to empty
  		    document.getElementById("r" + Prow + " c" + Pcolumn).className = "Empty";
          end()
        }
  		} else {
        PxDir = 0;
        PyDir = 0;
      }
    } else {
      PxDir = 0;
      PyDir = 0;
    }
  }
  // Checks if the area the ghost will move to is where PacMan is
  if (((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) == "Pacman_left") || ((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) == "Pacman_right") || ((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) == "Pacman_up") || ((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) == "Pacman_down")) {
    WillCrash = true;
    // If the Ghost moved into PacMan while he is powered up
    if (Power != 0) {
      GhostKilled = true;
      end()
    }
  }
  if (GxDir != 0 || GyDir != 0) {
    if ((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) != "Wall") {
      if (document.getElementById("r" + Grow + " c" +   Gcolumn)) {
        // Set the cell where Ghost was to empty, pip or powerup
        if (GPip == 0) {
          if (GPower == 0) {
            document.getElementById("r" + Grow + " c" + Gcolumn).className = "Empty";
          } else {
            document.getElementById("r" + Grow + " c" + Gcolumn).className = "Powerup";
            GPower = 0;
          }
        } else {
          document.getElementById("r" + Grow + " c" + Gcolumn).className = "Pip";
          GPip = 0;
          PipNum += 1;
        }
        // Check if there is a Portal where the Ghost is going to move
        if ((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) == "Portal") {
          if (Gcolumn > (NUMCOLUMNS/2)) {
            Gcolumn = NUMCOLUMNS - (Gcolumn + 2); // right side
          } else {
            Gcolumn = NUMCOLUMNS - Gcolumn; // left side
          }
        }
        // Check if there is a Pip where the Ghost is going to move
        if ((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) == "Pip") { 
          GPip = 1;
          PipNum += -1;
        }
        // Check if there is a Powerup where the Ghost is going to move
        if ((document.getElementById("r" + (Grow + GyDir) + " c" + (Gcolumn + GxDir)).getAttribute('class')) == "Powerup") { 
          GPower = 1;
        }
        // Update the column position for Ghost
	      Gcolumn += GxDir;
        Grow += GyDir;
        // Re-draw the Ghost
        if (Power != 0) {
          if (GhostKilled == false) {
            document.getElementById("r" + Grow + " c" + Gcolumn).className = "GhostWeak";
          }
        } else {
          document.getElementById("r" + Grow + " c" + Gcolumn).className = "Ghost";
        }
        LastGxDir = GxDir;
        LastGyDir = GyDir;
        if (WillCrash == true) {
          end()
        }
  		} else {
        GxDir = 0;
        GyDir = 0;
      }
    } else {
      GxDir = 0;
      GyDir = 0;
    }
	}
}

/// If the victory condition is met or PacMan died this function is called to end the game
function end() {
  if (PipNum == 0 || GhostKilled == true) {
    window.clearInterval(intervalHandle);
	  document.getElementById("Message").innerText = "PacMan Wins!";
  } else {
	  window.clearInterval(intervalHandle);
	  document.getElementById("Message").innerText = "PacMan Died!";
  }
}
