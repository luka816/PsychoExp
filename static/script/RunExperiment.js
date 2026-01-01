async function preloadAllExperimentImages(exp) {
    const allUrls = [];

    for (const t of exp.tests) {
        try {
            // ----- SINGLE IMAGE TEST -----
            if (t.type === "image" && t.params?.imageSrc) {
                allUrls.push(t.params.imageSrc);
            }

            // ----- IMAGE LIST TEST -----
            else if (t.type === "imageList" && t.params?.folderUrl) {
                let urls = [];

                // Case 1: folderUrl is a JSON file URL
                if (typeof t.params.folderUrl === "string") {
                    try {
                        const res = await fetch(t.params.folderUrl);
                        if (res.ok) {
                            const json = await res.json();
                            if (Array.isArray(json)) urls = json;
                        } else {
                            console.warn(`Failed to fetch image list: ${t.params.folderUrl}`);
                        }
                    } catch (err) {
                        console.warn("Error fetching image list:", t.params.folderUrl, err);
                    }
                }

                // Case 2: folderUrl is already an array of URLs
                if (Array.isArray(t.params.folderUrl)) {
                    urls = t.params.folderUrl;
                }

                allUrls.push(...urls);
            }
        } catch (err) {
            console.warn("Error processing test for preloading:", t, err);
        }
    }

    if (allUrls.length > 0) {
        console.log(`Preloading ${allUrls.length} images...`);
        await preloadImages(allUrls);
        alert("✅ All experiment images loaded and ready!");
    }
}

// Preload helper
async function preloadImages(urls = []) {
    const promises = urls.map(url => {
        return new Promise(resolve => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn("Failed to load image:", url);
                resolve(null);
            };
        });
    });
    const loadedImages = await Promise.all(promises);
    return loadedImages.filter(img => img);
}




async function runExperiment() {
    const exp = getExp();
    if (!exp || !Array.isArray(exp.tests)) {
        console.warn("No valid experiment tests found");
        return;
    }

    await preloadAllExperimentImages(exp);
    const stim = document.getElementById("stimulus");
    if (!stim) {
        console.warn("No stimulus element found");
        return;
    }

    stim.style.display = "block";
    stim.innerHTML = "";
    document.documentElement.requestFullscreen?.();

    const executedLoopGroups = new Set();

    for (let i = 0; i < exp.tests.length; i++) {
        const t = exp.tests[i];
        if (!t || !t.params) {
            console.warn(`Skipping invalid test at index ${i}`, t);
            continue;
        }

        try {
            // ----- LOOPED TEST GROUP -----
            if (t.params.loop?.enabled) {
                const groupId = t.params.loop.group || `loop_${i}`;

                // already executed this loop → skip
                if (executedLoopGroups.has(groupId)) continue;

                // collect tests in this loop group (ORDER PRESERVED)
                const loopTests = exp.tests.filter(
                    tt => tt?.params?.loop?.enabled && tt.params.loop.group === groupId
                );

                executedLoopGroups.add(groupId);

                const repeat = t.params.loop.repeat || 1;
                const interDelay = t.params.loop.interDelay || 0;

                for (let r = 0; r < repeat; r++) {
                    const iterationTests = t.params.loop.randomize
                        ? shuffleArray(loopTests)
                        : loopTests;

                    for (const lt of iterationTests) {
                        try {
                            await executeTest(lt, stim);
                        } catch (err) {
                            console.warn("Error executing test in loop:", err, lt);
                        }
                        if (interDelay > 0) await wait(interDelay);
                    }
                }

            } else {
                // ----- WORD LIST TEST / OTHER TEST -----
                try {
                    await executeTest(t, stim);
                } catch (err) {
                    console.warn("Error executing test:", err, t);
                }
            }
        } catch (err) {
            console.warn("Unexpected error in test loop:", err, t);
        }
    }

    stim.style.display = "none";
    document.exitFullscreen?.();
}



async function executeTest(t, stim) {
    // ----- WORD LIST -----
    if (t.type === "wordList") {
        let words = [];

        if (t.params.fileUrl) {
            try {
                const res = await fetch(t.params.fileUrl);

                // Check HTTP status
                if (!res.ok) {
                    console.warn(`Warning: Failed to fetch "${t.params.fileUrl}" (status ${res.status})`);
                } else {
                    try {
                        words = await res.json();
                    } catch (jsonErr) {
                        console.warn(`Warning: File "${t.params.fileUrl}" is not valid JSON`);
                    }
                }
            } catch (fetchErr) {
                console.warn(`Warning: Could not fetch file "${t.params.fileUrl}"`, fetchErr);
            }
        } else {
            console.warn("Warning: No fileUrl provided for wordList test");
        }

        // Fallback to empty list if fetch failed
        if (!Array.isArray(words)) words = [];

        // Shuffle if needed
        let list = [...words];
        if (t.params.randomize) list = shuffleArray(list);

        // Run each word
        for (const word of list) {
            await runSingleTest({
                type: "visual",
                params: {
                    ...t.params,
                    text: word
                }
            }, stim);
        }
        return;
    }

    // ----- IMAGE LIST TEST -----
    if (t.type === "imageList") {
        let images = [];

        if (t.params.folderUrl) {
            try {
                const res = await fetch(t.params.folderUrl);
                if (res.ok) {
                    images = await res.json();  // expect an array of image URLs
                } else {
                    console.warn(`Failed to fetch image list from ${t.params.folderUrl}`);
                }
            } catch (err) {
                console.warn(`Error fetching image list:`, err);
            }
        }

        if (!Array.isArray(images)) images = [];
        let list = [...images];

        if (t.params.randomize) list = shuffleArray(list);

        for (const imgSrc of list) {
            await runSingleTest({
                type: "image",
                params: {
                    ...t.params,
                    imageSrc: imgSrc
                }
            }, stim);
        }
        return;
    }

    // ----- ALL OTHER TESTS -----
    await runSingleTest(t, stim);
}



async function runSingleTest(t, stim) {
    if (!t || !t.params) {
        console.warn("Invalid test object:", t);
        return;
    }

    stim.innerHTML = "";
    await wait(t.params.delay || 0);

    const el = document.createElement("div");

    // ===== IMAGE TEST =====
    if (t.type === "image") {
        const img = document.createElement("img");
        img.src = t.params.imageSrc || "";
        img.style.width = (t.params.width || 100) + "px";
        img.style.height = (t.params.height || 100) + "px";
        img.style.position = "absolute";

        setElementPosition(img, t.params.position, t.params.x, t.params.y);

        stim.appendChild(img);

        if (t.params.duration === -1) await waitForNKey();
        else await wait(t.params.duration || 1000);

        return; // stop here for image test
    }

    // ===== VISUAL ELEMENT TEST =====
    const w = t.params.width || t.params.size || 100;
    const h = t.params.height || t.params.size || 100;

    if (t.params.text) {
        el.textContent = t.params.text;
        el.style.color = t.params.color || "#000";
        el.style.fontSize = (t.params.fontSize || 48) + "px";
    } else if (t.params.shape) {
        setupShape(
            el,
            t.params.shape,       // shape type
            w,                    // width
            h,                    // height
            t.params.color,       // color
            t.params.fillMode,    // "fill" or "outline"
            t.params.strokeWidth, // border thickness
            t.params.borderRadius // rounded corners
        );
    }

    setElementPosition(el, t.params.position, t.params.x, t.params.y);

    el.style.whiteSpace = "nowrap";
    stim.appendChild(el);

    if (t.params.duration === -1) await waitForNKey();
    else await wait(t.params.duration || 1000);
}


function setElementPosition(el, position, x = 0, y = 0) {
    el.style.position = "absolute";
    switch (position) {
        case "center": el.style.left = "50%"; el.style.top = "50%"; el.style.transform = "translate(-50%, -50%)"; break;
        case "left": el.style.left = "5%"; el.style.top = "50%"; el.style.transform = "translate(0, -50%)"; break;
        case "right": el.style.left = "95%"; el.style.top = "50%"; el.style.transform = "translate(-100%, -50%)"; break;
        case "top": el.style.left = "50%"; el.style.top = "5%"; el.style.transform = "translate(-50%, 0)"; break;
        case "bottom": el.style.left = "50%"; el.style.top = "95%"; el.style.transform = "translate(-50%, -100%)"; break;
        default: el.style.left = "50%"; el.style.top = "50%"; el.style.transform = "translate(-50%, -50%)";
    }
    el.style.marginLeft = (x || 0) + "px";
    el.style.marginTop = -(y || 0) + "px";
}

function setupShape(el, shape, w, h, color = "#000", fillMode = "fill", strokeWidth = 2, borderRadius = 0) {
    // Reset styles
    el.style.background = "transparent";
    el.style.border = "none";
    el.style.clipPath = "none";
    el.style.borderRadius = "0";

    const outline = fillMode === "outline";

    switch (shape) {
        case "rectangle":
            el.style.width = w + "px";
            el.style.height = h + "px";
            el.style.borderRadius = borderRadius + "px";

            if (outline) {
                el.style.border = `${strokeWidth}px solid ${color}`;
            } else {
                el.style.background = color;
            }
            break;

        case "circle":
            const size = Math.max(w, h);
            el.style.width = el.style.height = size + "px";
            el.style.borderRadius = "50%";

            if (outline) {
                el.style.border = `${strokeWidth}px solid ${color}`;
            } else {
                el.style.background = color;
            }
            break;

        case "ellipse":
            el.style.width = w + "px";
            el.style.height = h + "px";
            el.style.borderRadius = "50% / 50%";

            if (outline) {
                el.style.border = `${strokeWidth}px solid ${color}`;
            } else {
                el.style.background = color;
            }
            break;

        case "triangle":
            el.style.width = "0";
            el.style.height = "0";
            el.style.background = "transparent";

            el.style.borderLeft = w / 2 + "px solid transparent";
            el.style.borderRight = w / 2 + "px solid transparent";
            el.style.borderBottom = h + "px solid " + color;

            // Outline = only borderBottom, no perfect CSS stroke
            /* if (outline) {
                el.style.background = "transparent";
            } */
            break;

        case "star":
            el.style.width = w + "px";
            el.style.height = h + "px";
            el.style.clipPath =
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

            /*             if (outline) {
                            el.style.background = "transparent";
                            el.style.border = `${strokeWidth}px solid ${color}`; // rectangular outline around star
                        } else {
                            el.style.background = color;
                        } */
            break;

        default:
            el.style.width = w + "px";
            el.style.height = h + "px";

            if (outline) {
                el.style.border = `${strokeWidth}px solid ${color}`;
            } else {
                el.style.background = color;
            }
            break;
    }
}




function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function waitForNKey() {
    return new Promise(resolve => {
        function onKey(e) {
            // Directly check for ArrowRight without .toLowerCase()
            if (e.key === "ArrowRight") {
                document.removeEventListener("keydown", onKey);
                resolve();
            }
        }
        document.addEventListener("keydown", onKey);
    });
}