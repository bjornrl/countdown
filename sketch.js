/**
 * TARGET DATE CALCULATION:
 * The countdown ends on April 11 at 00:00:00 in the user's local timezone.
 * 
 * Calculation:
 * - Target: April 11 at 00:00:00 in user's local timezone
 * - If April 11 of current year has passed, target next year's April 11
 * 
 * We use local time to ensure the countdown matches the user's timezone,
 * making it consistent regardless of where they are located.
 */
function getTargetDate() {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Create April 11 of current year at 00:00:00 local time
  const april11ThisYear = new Date(currentYear, 3, 11, 0, 0, 0, 0); // Month 3 = April (0-indexed)
  
  // If April 11 has already passed this year, target next year
  if (now > april11ThisYear) {
    return new Date(currentYear + 1, 3, 11, 0, 0, 0, 0);
  }
  
  return april11ThisYear;
}

let targetDate;

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
  
  // Check if any digit has changed and trigger animations
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
  textStyle(BOLD);
  textFont('Helvetica');
  const targetYear = targetDate.getFullYear();
  text(`Countdown to April 11, ${targetYear}`, width / 2, height * 0.15);
  
  // Check if countdown is complete
  const isComplete = days === 0 && hours === 0 && minutes === 0 && seconds === 0 && 
                     targetDate.getTime() <= Date.now();
  
  if (isComplete) {
    // Show completion message
    fill(255);
    textSize(min(width, height) * 0.05);
    textStyle(BOLD);
    textFont('Helvetica');
    text('Countdown complete', width / 2, height * 0.85);
  }
  
  // Calculate positions for countdown display
  const centerX = width / 2;
  const centerY = height / 2;
  const digitSize = min(width, height) * 0.12;
  const labelSize = min(width, height) * 0.025;
  const spacing = min(width, height) * 0.15; // Increased spacing between numbers
  
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
  // Animation effect (scale and opacity)
  let scaleFactor = 1.0;
  let alpha = 255;
  if (isAnimating) {
    scaleFactor = 1.1;
    alpha = 180;
  }
  
  push();
  translate(x, y);
  scale(scaleFactor);
  
  // Draw digit value with Helvetica Bold
  fill(255, alpha);
  textSize(digitSize);
  textStyle(BOLD);
  textFont('Helvetica');
  text(pad(value), 0, -labelSize * 2);
  
  // Draw label with Helvetica Bold
  fill(255, 230);
  textSize(labelSize);
  textStyle(BOLD);
  textFont('Helvetica');
  text(label, 0, digitSize * 0.4);
  
  pop();
}

function drawSeparator(x, y, digitSize) {
  fill(255, 180);
  textSize(digitSize * 0.6);
  textStyle(BOLD);
  textFont('Helvetica');
  text(':', x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
