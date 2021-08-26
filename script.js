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

function indexes(source, find) {
  if (!source) {
    return [];
  }
  if (!find) {
    return source.split("").map(function (_, i) {
      return i;
    });
  }
  var result = [];
  for (i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) == find) {
      result.push(i);
    }
  }
  return result;
}

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
    indexes(initialSVG, color),
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
  for (i = 0; i < colorArr[state.itemColorIndex][1].length; i++) {
    updatedSVG =
      updatedSVG.substring(0, colorArr[state.itemColorIndex][1][i]) +
      state.selectedColor +
      updatedSVG.substring(colorArr[state.itemColorIndex][1][i] + 7);
  }
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

    state.itemColorIndex = event.target.getAttribute("itemColorIndex");
    event.target.classList.add("selectedItemColor");
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
  artboard.innerHTML = initialSVG;
  svgTag = document.querySelector("svg");
  svgTag.setAttribute("width", "288");
  svgTag.setAttribute("height", "288");
  svgTag.style.visibility = "visible";

  updatedSVG = svgTag.outerHTML;
  setSVG(initialSVG);
  state = {
    selectedColor: null,
    itemColorIndex: 0,
    showArtboard: true,
  };
  tiles = {
    selectedTile: "none",
    svgSize: 0.5,
    tileSize: 0.9,
    borderSize: 0.3,
    tileColor: "#87ddfd",
  };
  monochrome = {
    hue: 180,
    saturation: 100,
  };
  graytone = {
    hue: 180,
    tone: 25,
  };
  addTile(
    tiles.selectedTile,
    tiles.tileSize,
    tiles.svgSize,
    tiles.tileColor,
    tiles.borderSize
  );
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

    document.getElementsByClassName(state.selectedMenu)[0].scrollTop = 0;
  }
}

function onAddTilesHandler(event) {
  if (
    event.target.parentNode.parentNode.classList.contains("add-tiles") ||
    event.target.parentNode.classList.contains("add-tiles")
  ) {
    state.selectedMenu = "add-tiles";
    showMenu(state.selectedMenu);
    document.getElementsByClassName("add-tiles-menu")[0].scrollTop = 0;
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
    for (let j = 0; j < colorArr[i][1].length; j++) {
      chageColorForMonoGray(colorArr[i][0], colorArr[i][1][j]);
    }
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
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="288" height="288" viewbox="0 0 288 288" style="visibility: visible" >
  <rect width="288" height="288" ry="${borderSize * 100}" rx="${
    borderSize * 100
  }" transform="matrix(${tileSize},0,0,${tileSize},${
    (288 - tileSize * 288) / 2
  },${(288 - tileSize * 288) / 2})" fill="${tileColor}" />
  <g transform="matrix(${svgSize},0,0,${svgSize},${(288 - svgSize * 288) / 2},${
    (288 - svgSize * 288) / 2
  })">
    ${svg}
  </g>
</svg>`;
}

function addSquircleTile(svg, tileSize, svgSize, tileColor) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="288" height="288" viewbox="0 0 288 288" style="visibility: visible">
    <g transform="matrix(${tileSize},0,0,${tileSize},${
    (288 - tileSize * 288) / 2
  },${(288 - tileSize * 288) / 2})">
      <svg width="288" height="288" viewbox="0 0 200 200"><path d="
      M 0, 100
      C 0, 3.0000000000000027 3.0000000000000027, 0 100, 0
      S 200, 3.0000000000000027 200, 100
          197, 200 100, 200
          0, 197 0, 100
  " fill="${tileColor}" ></path>
      </svg>
    </g>
    <g transform="matrix(${svgSize},0,0,${svgSize},${
    (288 - svgSize * 288) / 2
  },${(288 - svgSize * 288) / 2})">
      ${svg}
    </g>
  </svg>`;
}

function addCircleTile(svg, tileSize, svgSize, tileColor) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="288" height="288" viewbox="0 0 288 288" style="visibility: visible">
    <circle cx="${288 / 2}" cy="${288 / 2}" r="${
    288 / 2
  }" transform="matrix(${tileSize},0,0,${tileSize},${
    (288 - tileSize * 288) / 2
  },${(288 - tileSize * 288) / 2})" fill="${tileColor}" />
    <g transform="matrix(${svgSize},0,0,${svgSize},${
    (288 - svgSize * 288) / 2
  },${(288 - svgSize * 288) / 2})">
      ${svg}
    </g>
  </svg>`;
}

function addBeaconTile(svg, tileSize, svgSize, tileColor, borderSize) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="288" height="288" viewbox="0 0 288 288" style="visibility: visible">
    <g transform="matrix(${tileSize},0,0,${tileSize},${
    (288 - tileSize * 288) / 2
  },${(288 - tileSize * 288) / 2})">
      <svg width="288" height="288" viewBox="0 0 288 288" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 140C0 62.6801 62.6801 0 140 0H148C225.32 0 288 62.6801 288 140V148C288 225.32 225.32 288 148 288H140C62.6801 288 0 225.32 0 148V140Z" fill="${tileColor}"/>
        <rect x="${132 - borderSize * 100}" y="${
    132 - borderSize * 100
  }" width="${156 + borderSize * 100}" height="${156 + borderSize * 100}" rx="${
    borderSize * 100
  }"  fill="${tileColor}"/>
      </svg>
    </g>
  
    <g transform="matrix(${svgSize},0,0,${svgSize},${
    (288 - svgSize * 288) / 2
  },${(288 - svgSize * 288) / 2})">
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
    for (let j = 0; j < colorArr[i][1][j]; j++) {
      chageColorForMonoGray(color, colorArr[i][1][j]);
    }
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
    #6666ff ${event.target.value * 4}%,
    #ebedf5 ${event.target.value * 4}%,
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
    for (let j = 0; j < colorArr[i][1].length; j++) {
      chageColorForMonoGray(color, colorArr[i][1][j]);
    }
  }
}

function onSvgElementClick(event) {
  if (state.selectedMenu === "item-color") {
    let color = event.target.outerHTML.match(regx);
    if (color.length === 1) {
      let index = colorArr.findIndex((col) => col[0] === color[0]);

      document
        .getElementsByClassName("selectedItemColor")[0]
        ?.classList.remove("selectedItemColor");
      document
        .querySelector(`[itemColorIndex="${index}"]`)
        .classList.add("selectedItemColor");
      state.itemColorIndex = index;
    }
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
artboard.addEventListener("click", onSvgElementClick);
