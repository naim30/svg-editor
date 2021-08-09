// let initialSVG = `<svg width="213" height="186" viewBox="0 0 213 186" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M189.169 119.577L157.271 96.1537L150.22 113.584L181.807 126.683C190.741 137.177 195.736 141.552 196.794 139.807C197.685 138.336 196.988 136.959 196.347 135.691C195.846 134.702 195.38 133.78 195.723 132.931C196.508 130.991 202.509 131.196 208.195 131.633C213.882 132.07 212.225 129.54 210.854 128.291C205.049 124.816 197.821 121.912 189.169 119.577ZM21.8884 160.85C24.8188 154.905 34.7984 96.9621 34.7984 96.9621L55.6957 97.0443C55.6957 97.0443 36.341 159.525 34.7984 163.348C32.7944 168.314 36.1984 175.529 38.5065 180.422C38.8636 181.179 39.1945 181.88 39.475 182.509C36.2723 183.942 34.7339 182.21 33.1119 180.384C31.28 178.321 29.3415 176.139 24.7783 178.261C23.0154 179.082 21.3471 180.051 19.7172 180.999C14.0872 184.271 8.91522 187.278 1.87952 182.936C0.764022 182.248 -0.458277 179.657 2.49502 177.632C9.85282 172.587 20.4557 163.757 21.8884 160.85Z" fill="#B28B67"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M94.1854 9.27419L102.832 7.79102C134.915 35.5065 148.093 88.7511 187.42 116.957L177.954 128.69C109.73 120.242 92.8204 55.297 94.1854 9.27419Z" fill="#E87613"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M56.4904 117.942C56.4904 117.942 108.498 117.942 133.001 117.942C136.498 117.942 135.839 112.894 135.333 110.346C129.501 80.9461 106.731 49.2538 106.731 7.40299L84.6624 3.94226C66.4079 33.3007 60.0952 69.4468 56.4904 117.942Z" fill="#DDE3E9"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M47.8873 138.942C44.4487 147.201 41.0767 154.407 37.8994 159.942H21.4904C19.725 102.861 41.3359 58.9386 59.422 32.4551C55.4063 32.1681 51.7816 30.4877 49.4904 26.3534C41.424 11.7983 44.3372 3.78462 52.9576 1.15048C57.6979 -0.298001 62.1561 0.690673 67.4924 1.87417C71.8594 2.8426 76.8154 3.94149 82.9944 3.94221C82.9964 3.94221 82.9984 3.94221 83.0004 3.94221C83.5994 3.94221 84.1444 3.98233 84.6394 4.05908L91.9624 4.47695C91.9624 4.47695 121.695 105.247 108.362 138.942H47.8873Z" fill="#FF9B21"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M47.8872 138.942C52.399 128.106 57.0255 115.458 61.4777 102.396C63.1351 116.781 65.8951 131.228 70.4904 138.942H47.8872Z" fill="black" fill-opacity="0.1"/>
// </svg>`;
// let updatedSVG = initialSVG;

let initialSVG = "";
let updatedSVG = "";

let colorArr = [];

let state = {
  selectedColor: null,
  itemColorIndex: 0,
  showArtboard: true,
  selectedMenu: "item-color",
};

let tiles = {
  selectedTile: "none",
  svgSize: 0.5,
  tileSize: 0.9,
  borderSize: 0.3,
  tileColor: "#87ddfd",
};

let monochrome = {
  hue: 180,
  saturation: 100,
};

let graytone = {
  hue: 180,
  tone: 25,
};

let svgTag = null;
const uploadNewSVG = document.getElementById("uploadNewSVG");
const artboard = document.getElementById("artboard");
const itemColorList = document.getElementById("item-color-list");
const colorInput = document.getElementById("color-input");
const itemDefaultColor = document.getElementById("item-default-color");
const artboardCheckbox = document.getElementById("artboard-checkbox");
const resetButton = document.getElementById("reset-button");
const downloadSvg = document.getElementById("download-svg");
const downloadSvgLink = document.getElementById("download-avg-link");
const recolorButtons = document.getElementById("recolor-buttons");
const addTilesButton = document.getElementById("add-tiles-button");
const addTilesOptions = document.getElementById("add-tiles-options");
const tileColorInput = document.getElementById("tile-color-input");
const tileIconSize = document.getElementById("tile-icon-size");
const tileTileSize = document.getElementById("tile-tile-size");
const tileBorderSize = document.getElementById("tile-border-size");
const tileDefaultColor = document.getElementById("tile-default-color");
const monochromeHueSelect = document.getElementById("monochrome-hue-select");
const monochromeSaturationSelect = document.getElementById(
  "monochrome-saturation-select"
);
const monochromeDefaultColor = document.getElementById(
  "monochrome-default-color"
);
const grayToneHueSelect = document.getElementById("gray-tone-hue-select");
const greyToneValueSelect = document.getElementById("gray-tone-value-select");
const grayToneDefaultColor = document.getElementById("gray-tone-default-color");

const regx = new RegExp(/#[a-fA-F0-9]{6}|rgba?\([\d\s,.]*\)/gi);

const rgb2hex = (rgb) =>
  `#${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
    .join("")}`;

function hexToHSL(H) {
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// setSVG(initialSVG);
// getSVGColors(initialSVG);
// setItemColor(colorArr);

function onOpenFileHandler(event) {
  let file = event.target.files[0];
  if (!file) {
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    initialSVG = e.target.result;
    updatedSVG = e.target.result;

    setSVG(initialSVG);
  };
  reader.readAsText(file);
}

function setSVG(img) {
  artboard.innerHTML = img;
  svgTag = document.querySelector("svg");
  svgTag.setAttribute("width", "288");
  svgTag.setAttribute("height", "288");
  svgTag.style.visibility = "visible";

  updatedSVG = svgTag.outerHTML;
  getSVGColors(updatedSVG);
  setItemColor(colorArr);
}

function getSVGColors(initialSVG) {
  colorArr = [...new Set(initialSVG.match(regx))].map((color) => [
    color,
    initialSVG.indexOf(color),
  ]);
}

function setItemColor(colorArr) {
  itemColorList.innerHTML = colorArr.reduce(
    (list, color, i) =>
      list +
      `<li ${
        i == 0 ? 'class="selectedItemColor"' : ""
      } id="item-color" itemColorIndex="${i}" style="background-color: ${
        color[0]
      }"></li>`,
    ""
  );
}

function onColorInputHandler(event) {
  changeColor(event.target.value);
}

function changeColor(color) {
  state.selectedColor = color;
  updatedSVG =
    updatedSVG.substring(0, colorArr[state.itemColorIndex][1]) +
    state.selectedColor +
    updatedSVG.substring(colorArr[state.itemColorIndex][1] + 7);
  colorArr[state.itemColorIndex][0] = state.selectedColor;

  document.querySelector(
    `[itemColorIndex="${state.itemColorIndex}"]`
  ).style.backgroundColor = state.selectedColor;

  addTile(
    tiles.selectedTile,
    tiles.tileSize,
    tiles.svgSize,
    tiles.tileColor,
    tiles.borderSize
  );
}

function onItemColorClickHandler(event) {
  if (event.target.hasAttribute("itemColorIndex")) {
    document
      .getElementsByClassName("selectedItemColor")[0]
      ?.classList.remove("selectedItemColor");
    event.target.classList.add("selectedItemColor");
    state.itemColorIndex = event.target.getAttribute("itemColorIndex");
  }
}

function onDefaultColorClick(event) {
  if (event.target.tagName === "LI") {
    changeColor(rgb2hex(event.target.style.backgroundColor));
  }
}

function onToggleArtboard(event) {
  if (state.showArtboard) {
    artboardCheckbox.childNodes[1].style.visibility = "hidden";
    document.getElementsByClassName("artboard")[0].style.visibility = "hidden";
    document.getElementsByClassName("image")[0].style.backgroundColor = "white";
    state.showArtboard = false;
  } else {
    artboardCheckbox.childNodes[1].style.visibility = "visible";
    document.getElementsByClassName("artboard")[0].style.visibility = "visible";
    document.getElementsByClassName("image")[0].style.backgroundColor =
      "#f5f6fa";
    state.showArtboard = true;
  }
}

function onResetClickHandler() {
  setSVG(initialSVG);
  getSVGColors(initialSVG);
  setItemColor(colorArr);

  updatedSVG = initialSVG;
  state = {
    selectedColor: null,
    itemColorIndex: 0,
    showArtboard: true,
  };
}

function onDownloadSvgHandler() {
  let svgData = artboard.innerHTML;
  var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);

  downloadSvgLink.href = svgUrl;
  downloadSvgLink.download = "editedSVG.svg";
}

function onRecolorButtonHandler(event) {
  if (
    event.target.parentNode.tagName === "BUTTON" ||
    event.target.tagName === "BUTTON"
  ) {
    document
      .getElementsByClassName("selectedRecolorOption")[0]
      .classList.remove("selectedRecolorOption");

    state.selectedMenu =
      event.target.tagName === "BUTTON"
        ? event.target.getAttribute("class")
        : event.target.parentNode.getAttribute("class");

    showMenu(state.selectedMenu);
    event.target.tagName === "BUTTON"
      ? event.target.classList.add("selectedRecolorOption")
      : event.target.parentNode.classList.add("selectedRecolorOption");
  }
}

function onAddTilesHandler(event) {
  if (
    event.target.parentNode.parentNode.classList.contains("add-tiles") ||
    event.target.parentNode.classList.contains("add-tiles")
  ) {
    state.selectedMenu = "add-tiles";
    showMenu(state.selectedMenu);
  }
}

function showMenu(menuName) {
  document
    .getElementsByClassName("selectedOption")[0]
    .classList.remove("selectedOption");
  document
    .getElementsByClassName(menuName + "-menu")[0]
    .classList.add("selectedOption");

  if (state.selectedMenu === "item-color") {
    itemColor();
  }

  if (state.selectedMenu === "monochrome-color") {
    monochromeConvert(monochrome.hue, monochrome.saturation);
  }
  if (state.selectedMenu === "gray-tone") {
    grayToneConvert(graytone.hue, graytone.tone);
  }
}

function itemColor() {
  for (let i = 0; i < colorArr.length; i++) {
    chageColorForMonoGray(colorArr[i][0], colorArr[i][1]);
  }
}

function onAddTileHandler(event) {
  if (event.target.tagName === "LI") {
    document
      .getElementsByClassName("selectedTile")[0]
      .classList.remove("selectedTile");
    tiles.selectedTile = event.target.getAttribute("class");
    event.target.classList.add("selectedTile");
    addTile(
      tiles.selectedTile,
      tiles.tileSize,
      tiles.svgSize,
      tiles.tileColor,
      tiles.borderSize
    );
  }
}

function addTile(tile, tileSize, svgSize, tileColor, borderSize) {
  if (tile === "none") {
    artboard.innerHTML = updatedSVG;
    addTilesButton.childNodes[1].innerHTML = "None";
  } else if (tile === "square") {
    addTilesButton.childNodes[1].innerHTML = "Square";
    document.getElementsByClassName("tile-border-size")[0].style.display =
      "block";
    artboard.innerHTML = addSquareTile(
      updatedSVG,
      tileSize,
      svgSize,
      tileColor,
      borderSize
    );
  } else if (tile === "squircle") {
    addTilesButton.childNodes[1].innerHTML = "Squircle";
    document.getElementsByClassName("tile-border-size")[0].style.display =
      "none";
    artboard.innerHTML = addSquircleTile(
      updatedSVG,
      tileSize,
      svgSize,
      tileColor
    );
  } else if (tile === "circle") {
    addTilesButton.childNodes[1].innerHTML = "Circle";
    document.getElementsByClassName("tile-border-size")[0].style.display =
      "none";
    artboard.innerHTML = addCircleTile(
      updatedSVG,
      tileSize,
      svgSize,
      tileColor
    );
  } else {
    addTilesButton.childNodes[1].innerHTML = "Beacon";
    document.getElementsByClassName("tile-border-size")[0].style.display =
      "block";
    artboard.innerHTML = addBeaconTile(
      updatedSVG,
      tileSize,
      svgSize,
      tileColor,
      borderSize
    );
  }
}

function addSquareTile(svg, tileSize, svgSize, tileColor, borderSize) {
  return `
<svg width="288" height="288" viewbox="0 0 288 288" style="visibility: visible" >
  <rect width="288" height="288" ry="${borderSize * 100}" rx="${
    borderSize * 100
  }" transform="translate(${(288 - tileSize * 288) / 2}, ${
    (288 - tileSize * 288) / 2
  }) scale(${tileSize})" fill="${tileColor}" />
  <g transform="translate(${(288 - svgSize * 288) / 2}, ${
    (288 - svgSize * 288) / 2
  }) scale(${svgSize})">
    ${svg}
  </g>
</svg>`;
}

function addSquircleTile(svg, tileSize, svgSize, tileColor) {
  return `
  <svg width="288" height="288" viewbox="0 0 288 288" style="visibility: visible">
    <g transform="translate(${(288 - tileSize * 288) / 2}, ${
    (288 - tileSize * 288) / 2
  }) scale(${tileSize})">
      <svg width="288" height="288" viewbox="0 0 200 200"><path d="
      M 0, 100
      C 0, 3.0000000000000027 3.0000000000000027, 0 100, 0
      S 200, 3.0000000000000027 200, 100
          197, 200 100, 200
          0, 197 0, 100
  " fill="${tileColor}" ></path>
      </svg>
    </g>
    <g transform="translate(${(288 - svgSize * 288) / 2}, ${
    (288 - svgSize * 288) / 2
  }) scale(${svgSize})">
      ${svg}
    </g>
  </svg>`;
}

function addCircleTile(svg, tileSize, svgSize, tileColor) {
  return `
  <svg width="288" height="288" viewbox="0 0 288 288" style="visibility: visible">
    <circle cx="${288 / 2}" cy="${288 / 2}" r="${
    288 / 2
  }" transform="translate(${(288 - tileSize * 288) / 2}, ${
    (288 - tileSize * 288) / 2
  }) scale(${tileSize})" fill="${tileColor}" />
    <g transform="translate(${(288 - svgSize * 288) / 2}, ${
    (288 - svgSize * 288) / 2
  }) scale(${svgSize})">
      ${svg}
    </g>
  </svg>`;
}

function addBeaconTile(svg, tileSize, svgSize, tileColor, borderSize) {
  return `
  <svg width="288" height="288" viewbox="0 0 288 288" style="visibility: visible">
    <g transform="translate(${(288 - tileSize * 288) / 2}, ${
    (288 - tileSize * 288) / 2
  }) scale(${tileSize})">
      <svg width="288" height="288" viewBox="0 0 288 288" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 140C0 62.6801 62.6801 0 140 0H148C225.32 0 288 62.6801 288 140V148C288 225.32 225.32 288 148 288H140C62.6801 288 0 225.32 0 148V140Z" fill="${tileColor}"/>
        <rect x="${132 - borderSize * 100}" y="${
    132 - borderSize * 100
  }" width="${156 + borderSize * 100}" height="${156 + borderSize * 100}" rx="${
    borderSize * 100
  }"  fill="${tileColor}"/>
      </svg>
    </g>
  
    <g transform="translate(${(288 - svgSize * 288) / 2}, ${
    (288 - svgSize * 288) / 2
  }) scale(${svgSize})">
      ${svg}
    </g>
  </svg>`;
}

function onTileColorInputHandler(event) {
  tiles.tileColor = event.target.value;
  addTile(
    tiles.selectedTile,
    tiles.tileSize,
    tiles.svgSize,
    tiles.tileColor,
    tiles.borderSize
  );
}

function onIconSizeChangeHandler(event) {
  event.target.style.background = `linear-gradient(
    to right,
    #6666ff 0%,
    #6666ff ${event.target.value * 100}%,
    #ebedf5 ${event.target.value * 100}%,
    #ebedf5 100%
  )`;
  tiles.svgSize = event.target.value;
  addTile(
    tiles.selectedTile,
    tiles.tileSize,
    tiles.svgSize,
    tiles.tileColor,
    tiles.borderSize
  );
}

function onTileSizeChangeHandler(event) {
  event.target.style.background = `linear-gradient(
    to right,
    #6666ff 0%,
    #6666ff ${event.target.value * 100}%,
    #ebedf5 ${event.target.value * 100}%,
    #ebedf5 100%
  )`;
  tiles.tileSize = event.target.value;
  addTile(
    tiles.selectedTile,
    tiles.tileSize,
    tiles.svgSize,
    tiles.tileColor,
    tiles.borderSize
  );
}

function onBorderSizeChangeHandler(event) {
  event.target.style.background = `linear-gradient(
    to right,
    #6666ff 0%,
    #6666ff ${event.target.value * 100}%,
    #ebedf5 ${event.target.value * 100}%,
    #ebedf5 100%
  )`;
  tiles.borderSize = event.target.value;
  addTile(
    tiles.selectedTile,
    tiles.tileSize,
    tiles.svgSize,
    tiles.tileColor,
    tiles.borderSize
  );
}

function onTileDefaultColorHandler(event) {
  if (event.target.tagName === "LI") {
    tiles.tileColor = rgb2hex(event.target.style.backgroundColor);
    addTile(
      tiles.selectedTile,
      tiles.tileSize,
      tiles.svgSize,
      tiles.tileColor,
      tiles.borderSize
    );
  }
}

function onMonochromeColorChange(event) {
  monochrome.hue = event.target.value;
  monochromeConvert(monochrome.hue, monochrome.saturation);
}

function onMonochromeSaturationChange(event) {
  monochrome.saturation = event.target.value;
  event.target.style.background = `linear-gradient(
    to right,
    #6666ff 0%,
    #6666ff ${event.target.value}%,
    #ebedf5 ${event.target.value}%,
    #ebedf5 100%
  )`;
  monochromeConvert(monochrome.hue, monochrome.saturation);
}

function onMonochromeDefaultColorHandler(event) {
  if (event.target.tagName === "LI") {
    let [h, s] = hexToHSL(rgb2hex(event.target.style.backgroundColor));
    monochrome.hue = h;
    monochromeConvert(monochrome.hue, monochrome.saturation);
    monochromeHueSelect.value = monochrome.hue;
  }
}

function monochromeConvert(hue, saturation) {
  let color = hslToHex(monochrome.hue, monochrome.saturation, 50);

  document.getElementsByClassName(
    "show-monochrome-color"
  )[0].childNodes[1].innerHTML = color;

  document.getElementsByClassName(
    "show-monochrome-color"
  )[0].childNodes[3].style.backgroundColor = color;

  for (let i = 0; i < colorArr.length; i++) {
    let [h, s, l] = hexToHSL(colorArr[i][0]);
    let color = hslToHex(hue, saturation, l);
    chageColorForMonoGray(color, colorArr[i][1]);
  }
}

function chageColorForMonoGray(color, index) {
  updatedSVG =
    updatedSVG.substring(0, index) + color + updatedSVG.substring(index + 7);
  addTile(
    tiles.selectedTile,
    tiles.tileSize,
    tiles.svgSize,
    tiles.tileColor,
    tiles.borderSize
  );
}

function onGrayToneColorChange(event) {
  graytone.hue = event.target.value;
  grayToneConvert(graytone.hue, graytone.tone);
}

function onGrayToneValueChange(event) {
  graytone.tone = event.target.value;
  event.target.style.background = `linear-gradient(
    to right,
    #6666ff 0%,
    #6666ff ${event.target.value * 2}%,
    #ebedf5 ${event.target.value * 2}%,
    #ebedf5 100%
  )`;
  monochromeConvert(graytone.hue, graytone.tone);
}

function onGrayToneDefaultColorHandler(event) {
  if (event.target.tagName === "LI") {
    let [h] = hexToHSL(rgb2hex(event.target.style.backgroundColor));
    graytone.hue = h;
    monochromeConvert(graytone.hue, graytone.tone);
    console.log(graytone.hue);
    grayToneHueSelect.value = graytone.hue;
  }
}

function grayToneConvert(hue, tone) {
  let color = hslToHex(graytone.hue, 100, 50);

  document.getElementsByClassName(
    "show-gray-tone-color"
  )[0].childNodes[1].innerHTML = color;

  document.getElementsByClassName(
    "show-gray-tone-color"
  )[0].childNodes[3].style.backgroundColor = color;

  color = hslToHex(graytone.hue, graytone.tone, 50);

  for (let i = 0; i < colorArr.length; i++) {
    let [h, s, l] = hexToHSL(colorArr[i][0]);
    let color = hslToHex(hue, tone, l);
    chageColorForMonoGray(color, colorArr[i][1]);
  }
}

uploadNewSVG.addEventListener("change", onOpenFileHandler);
colorInput.addEventListener("input", onColorInputHandler);
itemColorList.addEventListener("click", onItemColorClickHandler);
itemDefaultColor.addEventListener("click", onDefaultColorClick);
artboardCheckbox.addEventListener("click", onToggleArtboard);
resetButton.addEventListener("click", onResetClickHandler);
downloadSvg.addEventListener("click", onDownloadSvgHandler);
recolorButtons.addEventListener("click", onRecolorButtonHandler);
addTilesButton.addEventListener("click", onAddTilesHandler);
addTilesOptions.addEventListener("click", onAddTileHandler);
tileColorInput.addEventListener("input", onTileColorInputHandler);
tileIconSize.addEventListener("input", onIconSizeChangeHandler);
tileTileSize.addEventListener("input", onTileSizeChangeHandler);
tileBorderSize.addEventListener("input", onBorderSizeChangeHandler);
tileDefaultColor.addEventListener("click", onTileDefaultColorHandler);
monochromeHueSelect.addEventListener("input", onMonochromeColorChange);
monochromeSaturationSelect.addEventListener(
  "input",
  onMonochromeSaturationChange
);
monochromeDefaultColor.addEventListener(
  "click",
  onMonochromeDefaultColorHandler
);
grayToneHueSelect.addEventListener("input", onGrayToneColorChange);
greyToneValueSelect.addEventListener("input", onGrayToneValueChange);
grayToneDefaultColor.addEventListener("click", onGrayToneDefaultColorHandler);
