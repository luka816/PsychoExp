function renderExperiments() {
    const el = document.getElementById("experimentList");
    el.innerHTML = "";
    experiments.forEach(e => {
        const d = document.createElement("div");
        d.className = "item" + (e.id === selectedExperiment ? " active" : "");
        d.innerHTML = `
            <input value="${e.name}" onclick="event.stopPropagation()" oninput="renameExperiment('${e.id}', this.value)" style="width:70%">
            <button onclick="deleteExperiment('${e.id}')">🗑️</button>`;
        d.onclick = () => { selectedExperiment = e.id; selectedTest = null; render(); };
        el.appendChild(d);
    });
}

function renderTimeline() {
    const el = document.getElementById("timeline");
    el.innerHTML = "";
    const exp = getExp();
    if (!exp) return;

    exp.tests.forEach(t => {
        const d = document.createElement("div");
        d.className = "item" + (t.id === selectedTest ? " active" : "");
        d.innerHTML = `
            ${t.name}
            <div class="controls">
                <button class="icon-btn" onclick="moveTest('${t.id}',-1)">▲</button>
                <button class="icon-btn" onclick="moveTest('${t.id}',1)">▼</button>
                <button onclick="duplicateTest('${t.id}')">📄</button>
                <button onclick="deleteTest('${t.id}')">🗑️</button>
            </div>`;
        d.onclick = () => { selectedTest = t.id; render(); };
        el.appendChild(d);
    });
}

/* ---------- DYNAMIC PARAMS ---------- */
function renderParams() {
    const el = document.getElementById("params");
    const exp = getExp();
    if (!exp || !selectedTest) {
        el.textContent = "Select test";
        return;
    }

    const t = exp.tests.find(t => t.id === selectedTest);
    if (!t) {
        el.textContent = "Test not found";
        return;
    }

    el.innerHTML = "";

    // ====== Basic Info ======
    el.innerHTML += `<b>Test Name</b><br>
        <input value="${t.name}" oninput="renameTestFromParams(this.value)"><br><br>`;

    // ====== Loop Parameters ======
    renderLoopParams(el, t);

    // ====== Type-specific Parameters ======
    switch (t.type) {
        case "visual":
            renderVisualParams(el, t);
            break;
        case "image":
            renderImageParams(el, t);
            break;
        case "wordList":
            renderWordListParams(el, t);
            break;
        case "imageList":
            renderImageListParams(el, t);
            break;
    }

    // ====== Common Display & Shape Parameters ======
    renderCommonParams(el, t);

    // Apply dynamic behavior
    const textInput = document.getElementById("textInput");
    if (textInput) handleTextInput(textInput);
}


function renderVisualParams(el, t) {
    el.innerHTML += `<hr>
            Text/Shape Element (If text input is not clear, Shape input is disabled)<br>
        <input id="textInput" value="${t.params.text || ''}" oninput="handleTextInput(this)"><br><br>`;

    el.innerHTML += `Font Size<br>
        <input type="number" id="fontSizeInput" value="${t.params.fontSize || 48}" oninput="updateParam('fontSize', +this.value)"><br><br>`;

}

function renderImageParams(el, t) {
    el.innerHTML += `<hr><b>Image Element</b><br>
                    Image URL / path (e.g. images/brain.jpeg)<br>
                    <input
                    value="${t.params.imageSrc || ''}"
                    oninput="updateParam('imageSrc', this.value)"
                    placeholder="e.g. images/brain.jpeg"
                    ><br><br>`;
}

function renderWordListParams(el, t) {

    el.innerHTML += `<hr><b>Word list</b><br>
JSON file URL / PATH <br>
<input value="${t.params.fileUrl || ''}"
       oninput="updateParam('fileUrl', this.value)"
       placeholder="E.g words.json"><br><br>

<label>
<input type="checkbox"
 ${t.params.randomize ? "checked" : ""}
 onchange="updateParam('randomize', this.checked)">
 Randomize words
</label><br><br>

Font Size (px)<br>
<input type="number"
 value="${t.params.fontSize}"
 oninput="updateParam('fontSize', +this.value)"><br><br>`;
}

function renderImageListParams(el, t) {
    el.innerHTML += `<hr><b>Image list</b><br>
Folder / JSON file URL 
(For example: [
    "static/images/img1.png",
    "static/images/img2.jpeg"])
    <br>
<input value="${t.params.folderUrl || ''}"
       oninput="updateParam('folderUrl', this.value)"
       placeholder="E.g images.json"><br><br>

<label>
<input type="checkbox"
 ${t.params.randomize ? "checked" : ""}
 onchange="updateParam('randomize', this.checked)">
 Randomize images
</label><br><br>`;

}

function renderCommonParams(el, t) {
    const keys = ["color", "shape", "width", "height", "delay", "duration", "x", "y", "position"];

    keys.forEach(key => {
        if (!(key in t.params)) return;

        switch (key) {
            case "color":
                el.innerHTML += `<hr>
                    Color<br>
                    <input type="color" value="${t.params[key]}" oninput="updateParam('${key}', this.value)"><br><br>`;
                break;

            case "shape":
                el.innerHTML += `<hr>
                    Shape<br>
                    <select id="shapeInput" onchange="updateParam('${key}', this.value)">
                        <option value="rectangle" ${t.params[key] === 'rectangle' ? 'selected' : ''}>Rectangle</option>
                        <option value="circle" ${t.params[key] === 'circle' ? 'selected' : ''}>Circle</option>
                        <option value="ellipse" ${t.params[key] === 'ellipse' ? 'selected' : ''}>Ellipse</option>
                        <option value="triangle" ${t.params[key] === 'triangle' ? 'selected' : ''}>Triangle</option>
                        <option value="star" ${t.params[key] === 'star' ? 'selected' : ''}>Star</option>
                    </select><br><br>`;

                // Fill mode
                el.innerHTML += `
        Fill style (do not work on triangle and star)<br>
        <select id="FillModeInput" onchange="updateParam('fillMode', this.value)">
            <option value="fill" ${t.params.fillMode === 'fill' ? 'selected' : ''}>Filled</option>
            <option value="outline" ${t.params.fillMode === 'outline' ? 'selected' : ''}>Outline</option>
        </select><br><br>`;

                // Stroke width
                el.innerHTML += `
        Border width<br>
        <input id="strokeInput" type="number" min="1" value="${t.params.strokeWidth}"
               onchange="updateParam('strokeWidth', Number(this.value))"><br><br>`;

                // Border radius
                el.innerHTML += `
        Border radius<br>
        <input id="borderInput" type="number" min="0" value="${t.params.borderRadius}"
               onchange="updateParam('borderRadius', Number(this.value))"><br><hr><br>`;
                break;

            case "position":
                el.innerHTML += `Position<br>
                    <select onchange="updateParam('${key}', this.value)">
                        <option value="center" ${t.params[key] === "center" ? "selected" : ""}>Center</option>
                        <option value="left" ${t.params[key] === "left" ? "selected" : ""}>Left</option>
                        <option value="right" ${t.params[key] === "right" ? "selected" : ""}>Right</option>
                        <option value="top" ${t.params[key] === "top" ? "selected" : ""}>Top</option>
                        <option value="bottom" ${t.params[key] === "bottom" ? "selected" : ""}>Bottom</option>
                    </select><br><br>`;
                break;

            default:
                const inputId = key === "width" ? "widthInput" : key === "height" ? "heightInput" : "";
                let min = (key === "duration") ? -1 : 0; // allow -1 for duration
                el.innerHTML += `${key.charAt(0).toUpperCase() + key.slice(1)}<br>
                <input type="number" ${inputId ? `id="${inputId}"` : ''} 
                       min="${min}" 
                       value="${t.params[key]}" 
                       oninput="updateParam('${key}', +this.value)"><br><br>
                    `;
        }
    });
}

function renderLoopParams(el, t) {
    const loopEnabled = t.params.loop.enabled;

    el.innerHTML += `<hr><b>Loop</b><br>`;

    el.innerHTML += `
<label>
  <input type="checkbox"
    ${loopEnabled ? "checked" : ""}
    onchange="
      updateLoopParam('enabled', this.checked);
      renderParams();
    ">
  Include in loop
</label><br><br>
`;

    el.innerHTML += `
Loop group<br>
<input
  ${!loopEnabled ? "disabled" : ""}
  value="${t.params.loop.group}"
  oninput="updateLoopParam('group', this.value)"
  placeholder="e.g. A"><br><br>
`;

    el.innerHTML += `
Repeat count (how many times repeat loop)<br>
<input type="number" min="1"
  ${!loopEnabled ? "disabled" : ""}
  value="${t.params.loop.repeat}"
  oninput="updateLoopParam('repeat', +this.value)"><br><br>
`;

    el.innerHTML += `
<label>
  <input type="checkbox"
    ${!loopEnabled ? "disabled" : ""}
    ${t.params.loop.randomize ? "checked" : ""}
    onchange="updateLoopParam('randomize', this.checked)">
  Randomize order inside loop
</label><br><br>
`;

    el.innerHTML += `
Delay between tests (ms)<br>
<input type="number" min="0"
  ${!loopEnabled ? "disabled" : ""}
  value="${t.params.loop.interDelay}"
  oninput="updateLoopParam('interDelay', +this.value)"><br><br>
`;
}



// Handle text input changes
function handleTextInput(inputEl) {
    const exp = getExp();
    if (!exp || !selectedTest) return;
    const t = exp.tests.find(t => t.id === selectedTest);
    t.params.text = inputEl.value;

    const shapeEl = document.getElementById("shapeInput");
    const widthEl = document.getElementById("widthInput");
    const heightEl = document.getElementById("heightInput");
    const fillEl = document.getElementById("FillModeInput");
    const strokeEl = document.getElementById("strokeInput");
    const borderEl = document.getElementById("borderInput");
    const fontSizeEl = document.getElementById("fontSizeInput");
    /* const instructionEl = document.querySelector(".instruction"); */

    if (t.params.text) {
        // Disable shape/width/height
        if (shapeEl) shapeEl.disabled = true;
        if (widthEl) widthEl.disabled = true;
        if (heightEl) heightEl.disabled = true;
        if (fillEl) fillEl.disabled = true;
        if (strokeEl) strokeEl.disabled = true;
        if (borderEl) borderEl.disabled = true;
        // Enable font size
        if (fontSizeEl) fontSizeEl.disabled = false;
        // Show automatic instruction
        /* if (instructionEl) instructionEl.value = "Text is provided. If you want a shape, clear the text input."; */
    } else {
        // Enable shape/width/height
        if (shapeEl) shapeEl.disabled = false;
        if (widthEl) widthEl.disabled = false;
        if (heightEl) heightEl.disabled = false;
        if (fillEl) fillEl.disabled = false;
        if (strokeEl) strokeEl.disabled = false;
        if (borderEl) borderEl.disabled = false;
        // Disable font size
        if (fontSizeEl) fontSizeEl.disabled = true;
        // Restore user-written instruction
        /* if (instructionEl) instructionEl.value = t.params.instruction || ""; */
    }
}

function updateParam(key, value) {
    const exp = getExp();
    if (!exp || !selectedTest) return;
    const t = exp.tests.find(t => t.id === selectedTest);
    t.params[key] = value;
}

function updateLoopParam(key, value) {
    const exp = getExp();
    if (!exp || !selectedTest) return;
    const t = exp.tests.find(t => t.id === selectedTest);
    t.params.loop[key] = value;
}

function renameTestFromParams(newName) {
    const exp = getExp();
    if (!exp || !selectedTest) return;
    newName = newName.trim();
    if (!newName) return;
    if (exp.tests.some(t => t.name === newName && t.id !== selectedTest)) { alert("Test name must be unique"); return; }
    const test = exp.tests.find(t => t.id === selectedTest);
    test.name = newName;
    renderTimeline();
}


function render() {
    renderExperiments();
    renderTimeline();
    renderParams();
}

