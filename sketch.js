let input, slider, jumpBtn, sel, radio;
let iframeDiv, iframe;
let isJumping = false;
let inputW = 200;
let colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 1. 文字輸入框
  input = createInput('大家好');
  input.size(inputW, 40);
  input.style('font-size', '20px');

  // 2. 跳動開關按鈕
  jumpBtn = createButton('跳動開關');
  jumpBtn.size(80, 44);
  jumpBtn.mousePressed(() => isJumping = !isJumping);

  // 3. 字體大小滑桿 (15-80)
  slider = createSlider(15, 80, 30);
  slider.size(100);

  // 4. 網頁下拉選單
  sel = createSelect();
  sel.size(120, 44);
  sel.option('淡江教科系', 'https://www.et.tku.edu.tw');
  sel.option('淡江大學', 'https://www.tku.edu.tw');
  sel.changed(() => iframe.attribute('src', sel.value()));

  // 5. 模式選鈕 (一般性, 旋轉, 大小)
  radio = createRadio();
  radio.option('一般性');
  radio.option('旋轉');
  radio.option('大小');
  radio.selected('一般性');
  radio.style('width', '220px');

  // 6. 嵌入網頁容器 (iframeDiv) 95% 透明度
  iframeDiv = createElement('div');
  iframeDiv.style('position', 'absolute');
  iframeDiv.style('top', '200px');
  iframeDiv.style('left', '200px');
  iframeDiv.style('width', 'calc(100% - 400px)');
  iframeDiv.style('height', 'calc(100% - 400px)');
  iframeDiv.style('background-color', 'white');
  iframeDiv.style('opacity', '0.95');
  iframeDiv.style('z-index', '10');
  iframeDiv.style('border-radius', '15px');
  iframeDiv.style('overflow', 'hidden');

  iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.et.tku.edu.tw');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none');
  iframe.parent(iframeDiv);

  updatePositions();
}

function draw() {
  drawSkyGradient(); // 天空藍漸層背景

  // 繪製右上角學號與姓名
  drawHeaderInfo();

  let baseSize = slider.value();
  let txt = input.value();
  let spacingY = baseSize + 40;
  let time = frameCount * 0.1;
  let mode = radio.value();

  if (txt.length > 0) {
    let rowIndex = 0;
    for (let y = 100; y < height; y += spacingY) {
      let rowStartX = 0;
      let charCounter = 0;
      let rowDirection = (rowIndex % 2 === 0) ? 1 : -1;

      while (rowStartX < width) {
        for (let i = 0; i < txt.length; i++) {
          let char = txt.charAt(i);
          fill(colors[charCounter % colors.length]);

          push();
          let offsetX = 0, offsetY = 0;
          let currentSize = baseSize;
          let currentRotation = 0;

          // 跳動邏輯 (同一排與不同排皆不同)
          if (isJumping) {
            offsetY = sin(time + charCounter * 0.5 + rowIndex) * (baseSize * 0.4) * rowDirection;
            offsetX = cos(time + charCounter * 0.3 + rowIndex) * (baseSize * 0.2);
          }

          // 模式處理
          if (mode === "旋轉") {
            currentRotation = sin(time + charCounter * 0.5) * HALF_PI;
          } else if (mode === "大小") {
            currentSize = baseSize * (1 + abs(sin(time + charCounter * 0.5)) * 0.3);
          }

          textSize(currentSize);
          translate(rowStartX + textWidth(char) / 2 + offsetX, y + spacingY / 2 + offsetY);
          rotate(currentRotation);
          textAlign(CENTER, CENTER);
          text(char, 0, 0);
          pop();

          rowStartX += textWidth(char);
          charCounter++;
          if (rowStartX > width) break;
        }
        rowStartX += textWidth(' ');
      }
      rowIndex++;
    }
  }
}

function drawHeaderInfo() {
  push();
  fill(0); // 黑色文字
  noStroke();
  textSize(20);
  textAlign(RIGHT, TOP);
  // 繪製於右上角，保留 20px 的邊距
  text("411136541 江奕葳", width - 20, 20);
  pop();
}

function drawSkyGradient() {
  let c1 = color('#87CEEB'); 
  let c2 = color('#F0F8FF');
  for (let i = 0; i <= height; i += 2) {
    let inter = map(i, 0, height, 0, 1);
    fill(lerpColor(c1, c2, inter));
    noStroke();
    rect(0, i, width, 2);
  }
}

function updatePositions() {
  let startX = 20;
  let startY = 20;
  input.position(startX, startY);
  jumpBtn.position(startX + 210, startY);
  slider.position(startX + 300, startY + 15);
  sel.position(startX + 420, startY);
  radio.position(startX + 550, startY + 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updatePositions();
}