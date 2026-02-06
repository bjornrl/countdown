/**
 * TARGET DATE CALCULATION:
 * The countdown ends exactly 100 days after January 1st.
 * 
 * Calculation:
 * - Start: January 1 at 00:00:00 in user's local timezone
 * - Add: 100 days
 * - Result: April 11 at 00:00:00 in user's local timezone
 * 
 * We use local time to ensure the countdown matches the user's timezone,
 * making it consistent regardless of where they are located.
 */
function getTargetDate() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0); // Jan 1 at 00:00:00 local time
  const targetDate = new Date(jan1);
  targetDate.setDate(jan1.getDate() + 100); // Add 100 days
  return targetDate;
}

/**
 * FONT ROTATION LOGIC:
 * To ensure fonts never repeat consecutively, we maintain:
 * 1. A list of at least 12 fonts (Google Fonts + fallbacks)
 * 2. An index tracking the current font position
 * 3. Logic to advance to the next font whenever ANY digit changes
 * 
 * When a digit changes:
 * - We increment the font index
 * - If we reach the end, we wrap around (but skip the previous font)
 * - This guarantees no two consecutive updates use the same font
 */
const fonts = [
  'Roboto Mono',           // Google Font
  'Space Mono',            // Google Font
  'JetBrains Mono',        // Google Font
  'Fira Code',             // Google Font
  'Source Code Pro',       // Google Font
  'IBM Plex Mono',         // Google Font
  'PT Mono',               // Google Font
  'Share Tech Mono',       // Google Font
  'VT323',                 // Google Font
  'Orbitron',              // Google Font
  'Rajdhani',              // Google Font
  'Quantico',              // Google Font
  'Courier New',           // Fallback
  'monospace'              // Final fallback
];

let targetDate;
let currentFontIndex = 0;
let previousFontIndex = -1; // Track previous to avoid immediate repeats
let currentFont;

// Countdown values
let days = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;

// Previous values to detect changes
let prevDays = -1;
let prevHours = -1;
let prevMinutes = -1;
let prevSeconds = -1;

// Animation state
let animatingElements = {
  days: false,
  hours: false,
  minutes: false,
  seconds: false
};

let lastUpdateTime = 0;
const updateInterval = 250; // Update every 250ms for accuracy

/**
 * Get the next font, ensuring it's different from the previous one
 */
function getNextFont() {
  // Advance to next font
  currentFontIndex = (currentFontIndex + 1) % fonts.length;
  
  // If we wrapped around and would use the previous font, skip it
  if (currentFontIndex === previousFontIndex && fonts.length > 1) {
    currentFontIndex = (currentFontIndex + 1) % fonts.length;
  }
  
  previousFontIndex = currentFontIndex;
  return fonts[currentFontIndex];
}

/**
 * Format number with leading zeros
 */
function pad(num, digits = 2) {
  return String(num).padStart(digits, '0');
}

/**
 * Calculate remaining time and update values
 */
function updateCountdown() {
  const now = Date.now();
  const target = targetDate.getTime();
  const difference = target - now;
  
  // Check if countdown has ended
  if (difference <= 0) {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
    return true; // Return true if complete
  }
  
  // Calculate time components
  days = Math.floor(difference / (1000 * 60 * 60 * 24));
  hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  // Check if any digit has changed
  let hasChanged = false;
  if (prevDays !== days || prevHours !== hours || 
      prevMinutes !== minutes || prevSeconds !== seconds) {
    hasChanged = true;
    
    // Trigger animations for changed elements
    if (prevDays !== days) {
      animatingElements.days = true;
      setTimeout(() => { animatingElements.days = false; }, 200);
    }
    if (prevHours !== hours) {
      animatingElements.hours = true;
      setTimeout(() => { animatingElements.hours = false; }, 200);
    }
    if (prevMinutes !== minutes) {
      animatingElements.minutes = true;
      setTimeout(() => { animatingElements.minutes = false; }, 200);
    }
    if (prevSeconds !== seconds) {
      animatingElements.seconds = true;
      setTimeout(() => { animatingElements.seconds = false; }, 200);
    }
  }
  
  // If any digit changed, update font
  if (hasChanged) {
    const newFontName = getNextFont();
    currentFont = newFontName;
  }
  
  // Update previous values
  prevDays = days;
  prevHours = hours;
  prevMinutes = minutes;
  prevSeconds = seconds;
  
  return false; // Return false if not complete
}

function setup() {
  // Create full-screen canvas
  createCanvas(windowWidth, windowHeight);
  
  // Initialize target date
  targetDate = getTargetDate();
  
  // Initialize font
  currentFont = fonts[0];
  
  // Set initial countdown values
  updateCountdown();
  
  // Set text properties
  textAlign(CENTER, CENTER);
}

function draw() {
  // Use requestAnimationFrame timing (p5.js handles this via draw())
  const now = millis();
  if (now - lastUpdateTime >= updateInterval) {
    const isComplete = updateCountdown();
    lastUpdateTime = now;
    
    if (isComplete) {
      // Still draw the "00:00:00:00" display
    }
  }
  
  // Gradient background
  for (let i = 0; i <= height; i++) {
    const inter = map(i, 0, height, 0, 1);
    const c = lerpColor(color(102, 126, 234), color(118, 75, 162), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  // Title
  fill(255);
  noStroke();
  textSize(min(width, height) * 0.04);
  textFont('Roboto Mono');
  text('100-Day Countdown', width / 2, height * 0.15);
  
  // Check if countdown is complete
  const isComplete = days === 0 && hours === 0 && minutes === 0 && seconds === 0 && 
                     targetDate.getTime() <= Date.now();
  
  if (isComplete) {
    // Show completion message
    fill(255);
    textSize(min(width, height) * 0.05);
    textFont('Roboto Mono');
    text('Countdown complete', width / 2, height * 0.85);
  }
  
  // Calculate positions for countdown display
  const centerX = width / 2;
  const centerY = height / 2;
  const digitSize = min(width, height) * 0.12;
  const labelSize = min(width, height) * 0.025;
  const spacing = min(width, height) * 0.08;
  
  // Draw countdown digits
  drawTimeUnit(centerX - spacing * 1.5, centerY, days, 'Days', digitSize, labelSize, animatingElements.days);
  drawSeparator(centerX - spacing * 0.5, centerY, digitSize);
  drawTimeUnit(centerX - spacing * 0.5, centerY, hours, 'Hours', digitSize, labelSize, animatingElements.hours);
  drawSeparator(centerX + spacing * 0.5, centerY, digitSize);
  drawTimeUnit(centerX + spacing * 0.5, centerY, minutes, 'Minutes', digitSize, labelSize, animatingElements.minutes);
  drawSeparator(centerX + spacing * 1.5, centerY, digitSize);
  drawTimeUnit(centerX + spacing * 1.5, centerY, seconds, 'Seconds', digitSize, labelSize, animatingElements.seconds);
}

function drawTimeUnit(x, y, value, label, digitSize, labelSize, isAnimating) {
  // Apply font to digits
  textFont(currentFont);
  
  // Animation effect (scale and opacity)
  let scale = 1.0;
  let alpha = 255;
  if (isAnimating) {
    scale = 1.1;
    alpha = 180;
  }
  
  push();
  translate(x, y);
  scale(scale);
  
  // Draw digit value
  fill(255, alpha);
  textSize(digitSize);
  text(pad(value), 0, -labelSize * 2);
  
  // Draw label (always use default font, not rotated font)
  fill(255, 230);
  textSize(labelSize);
  textFont('Roboto Mono');
  text(label, 0, digitSize * 0.4);
  
  pop();
}

function drawSeparator(x, y, digitSize) {
  fill(255, 180);
  textSize(digitSize * 0.6);
  textFont('Roboto Mono');
  text(':', x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
