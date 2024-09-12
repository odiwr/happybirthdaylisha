// Define a list of passwords and corresponding URLs
const passwordMap = {
  'helloworld': 'helloworld.html',
  'hbd': 'happybirthday.html',
  'formeonly': 'private.html',
  'happybirthday': 'happybirthday.html'
};

// Function to check if a password is valid (case-insensitive and typo-tolerant)
function checkPassword() {
  const enteredPassword = passwordValue.toLowerCase(); // Use lowercase for case-insensitive comparison
  const bodyElement = document.body;

  // Check if the entered password is close enough to any valid password
  const validPassword = Object.keys(passwordMap).find(password => {
    // Convert the password to lowercase and calculate the similarity
    return levenshteinDistance(password.toLowerCase(), enteredPassword) <= 2; // Allow up to 2 typos
  });

  if (validPassword) {
    // Flash green for correct password
    flashBackground('#1ed92e');
    setTimeout(() => {
      window.location.href = passwordMap[validPassword]; // Redirect to the corresponding URL
    }, 1000); // Slight delay before redirect
  } else {
    // Flash red for incorrect password
    flashBackground('#d91e1e');
  }
}

// Function to flash the background color on the entire body and html
function flashBackground(color) {
  const bodyElement = document.body;
  const htmlElement = document.documentElement;

  bodyElement.style.backgroundColor = color;
  htmlElement.style.backgroundColor = color;

  setTimeout(() => {
    bodyElement.style.backgroundColor = 'white';
    htmlElement.style.backgroundColor = 'white';
  }, 1000); // Duration of the flash
}

// Levenshtein Distance function: calculates the edit distance between two strings
function levenshteinDistance(a, b) {
  const matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Compute the edit distance
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1,     // Insertion
          matrix[i - 1][j] + 1      // Deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// iOS-like effect: only show the last typed character for a brief moment
const passwordInput = document.getElementById('password-input');
let passwordValue = ""; // Store the actual password value
let timeoutID;

passwordInput.addEventListener('input', function() {
  clearTimeout(timeoutID); // Clear the previous timeout
  let currentValue = passwordInput.value;

  if (currentValue.length > passwordValue.length) {
    // If a new character is added
    let lastChar = currentValue.slice(-1); // Get the last typed character
    passwordValue += lastChar; // Append the last character to the actual password

    // Temporarily show the last character
    passwordInput.value = passwordValue.slice(0, -1) + lastChar;
    timeoutID = setTimeout(() => {
      // After a short delay, hide the last character
      passwordInput.value = passwordValue.replace(/./g, '•');
    }, 1000); // Change it after 1 second
  } else {
    // If backspace or deletion occurs, update the password value accordingly
    passwordValue = passwordValue.slice(0, currentValue.length);
    passwordInput.value = passwordValue.replace(/./g, '•');
  }
});

const noise = () => {
  let canvas, ctx;

  let wWidth, wHeight;

  let noiseData = [];
  let frame = 0;

  let loopTimeout;


  // Create Noise
  const createNoise = () => {
    const idata = ctx.createImageData(wWidth, wHeight);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.5) {
        buffer32[i] = 0xff000000;
      }
    }

    noiseData.push(idata);
  };


  // Play Noise
  const paintNoise = () => {
    if (frame === 9) {
      frame = 0;
    } else {
      frame++;
    }

    ctx.putImageData(noiseData[frame], 0, 0);
  };


  // Loop
  const loop = () => {
    paintNoise(frame);

    loopTimeout = window.setTimeout(() => {
      window.requestAnimationFrame(loop);
    }, (1000 / 25));
  };


  // Setup
  const setup = () => {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;

    canvas.width = wWidth;
    canvas.height = wHeight;

    for (let i = 0; i < 10; i++) {
      createNoise();
    }

    loop();
  };


  // Reset
  let resizeThrottle;
  const reset = () => {
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeThrottle);

      resizeThrottle = window.setTimeout(() => {
        window.clearTimeout(loopTimeout);
        setup();
      }, 200);
    }, false);
  };


  // Init
  const init = (() => {
    canvas = document.getElementById('noise');
    ctx = canvas.getContext('2d');

    setup();
  })();
};

noise();