/* ---------- GENERIC VISUAL TEST ---------- */
function addVisualTest(name = "VisualTest", defaultParams = {}) {
    const exp = getExp();
    if (!exp) return;

    const testName = uniqueName(name, exp.tests.map(t => t.name));

    const params = {
        text: defaultParams.text ?? "",
        color: defaultParams.color ?? "#000000",
        shape: defaultParams.shape ?? "rectangle",
        fillMode: defaultParams.fillMode ?? "fill",       // "fill" or "outline"
        strokeWidth: defaultParams.strokeWidth ?? 2,      // in px
        borderRadius: defaultParams.borderRadius ?? 0,
        width: defaultParams.width ?? 100,
        height: defaultParams.height ?? 100,
        delay: defaultParams.delay ?? 500,
        duration: defaultParams.duration ?? 1000,
        position: defaultParams.position ?? "center",
        x: defaultParams.x ?? 0,
        y: defaultParams.y ?? 0,

        loop: {
            enabled: defaultParams.loop?.enabled ?? false,
            group: defaultParams.loop?.group ?? "",
            repeat: defaultParams.loop?.repeat ?? 1,
            interDelay: defaultParams.loop?.interDelay ?? 0,
            randomize: defaultParams.loop?.randomize ?? false
        }
    };

    exp.tests.push({
        id: crypto.randomUUID(),
        name: testName,
        type: "visual",
        params
    });

    render();
}


/* ---------- IMAGE TEST ---------- */
function addImageTest(name = "ImageTest", defaultParams = {}) {
    const exp = getExp();
    if (!exp) return;

    const testName = uniqueName(name, exp.tests.map(t => t.name));

    const params = {
        imageSrc: defaultParams.imageSrc ?? "",
        width: defaultParams.width ?? 200,
        height: defaultParams.height ?? 200,
        delay: defaultParams.delay ?? 500,
        duration: defaultParams.duration ?? 1000,
        position: defaultParams.position ?? "center",
        x: defaultParams.x ?? 0,
        y: defaultParams.y ?? 0,

        loop: {
            enabled: defaultParams.loop?.enabled ?? false,
            group: defaultParams.loop?.group ?? "",
            repeat: defaultParams.loop?.repeat ?? 1,
            interDelay: defaultParams.loop?.interDelay ?? 0,
            randomize: defaultParams.loop?.randomize ?? false
        }
    };

    exp.tests.push({
        id: crypto.randomUUID(),
        name: testName,
        type: "image",
        params
    });

    render();
}



/* ---------- WORD LIST TEST ---------- */
function addWordListTest(name = "WordListTest", defaultParams = {}) {
    const exp = getExp();
    if (!exp) return;

    const testName = uniqueName(name, exp.tests.map(t => t.name));

    const params = {
        fileUrl: defaultParams.fileUrl ?? "",
        color: defaultParams.color ?? "#000000",
        fontSize: defaultParams.fontSize ?? 48,
        delay: defaultParams.delay ?? 500,
        duration: defaultParams.duration ?? 1000,
        position: defaultParams.position ?? "center",
        x: defaultParams.x ?? 0,
        y: defaultParams.y ?? 0,
        randomize: defaultParams.randomize ?? false,

        loop: {
            enabled: defaultParams.loop?.enabled ?? false,
            group: defaultParams.loop?.group ?? "",
            repeat: defaultParams.loop?.repeat ?? 1,
            interDelay: defaultParams.loop?.interDelay ?? 0,
            randomize: defaultParams.loop?.randomize ?? false
        }
    };

    exp.tests.push({
        id: crypto.randomUUID(),
        name: testName,
        type: "wordList",
        params
    });

    render();
}


/* ---------- IMAGE LIST TEST ---------- */
function addImageListTest(name = "ImageListTest", defaultParams = {}) {
    const exp = getExp();
    if (!exp) return;

    const testName = uniqueName(name, exp.tests.map(t => t.name));

    const params = {
        folderUrl: defaultParams.folderUrl ?? "",  // URL or folder JSON listing images
        width: defaultParams.width ?? 200,
        height: defaultParams.height ?? 200,
        delay: defaultParams.delay ?? 500,
        duration: defaultParams.duration ?? 1000,
        position: defaultParams.position ?? "center",
        x: defaultParams.x ?? 0,
        y: defaultParams.y ?? 0,
        randomize: defaultParams.randomize ?? false,  // shuffle images

        loop: {
            enabled: defaultParams.loop?.enabled ?? false,
            group: defaultParams.loop?.group ?? "",
            repeat: defaultParams.loop?.repeat ?? 1,
            interDelay: defaultParams.loop?.interDelay ?? 0,
            randomize: defaultParams.loop?.randomize ?? false
        }
    };

    exp.tests.push({
        id: crypto.randomUUID(),
        name: testName,
        type: "imageList",
        params
    });

    render();
}
