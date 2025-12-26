function createFullDebugExperiment() {
    const name = "default (test) Experiment";
    experiments.push({
        id: crypto.randomUUID(),
        name,
        tests: [],
    });
    selectedExperiment = experiments.at(-1).id;
    selectedTest = null;

    const exp = getExp();
    if (!exp) return;

    // ---------------- VISUAL SHAPE TESTS ----------------
    // Rectangle
    addVisualTest("Rectangle - Filled", {
        text: "",
        shape: "rectangle",
        color: "#FF0000",
        fillMode: "fill",
        strokeWidth: 0,
        borderRadius: 0,
        width: 150,
        height: 100
    });
    addVisualTest("Rectangle - Outline", {
        text: "",
        shape: "rectangle",
        color: "#FF0000",
        fillMode: "outline",
        strokeWidth: 5,
        borderRadius: 0,
        width: 150,
        height: 100
    });
    addVisualTest("Rectangle - Outline Rounded", {
        text: "",
        shape: "rectangle",
        color: "#FF0000",
        fillMode: "outline",
        strokeWidth: 5,
        borderRadius: 20,
        width: 150,
        height: 100
    });

    // Circle
    addVisualTest("Circle - Filled", {
        text: "",
        shape: "circle",
        color: "#00FF00",
        fillMode: "fill",
        strokeWidth: 0,
        width: 120,
        height: 120
    });
    addVisualTest("Circle - Outline", {
        text: "",
        shape: "circle",
        color: "#00FF00",
        fillMode: "outline",
        strokeWidth: 4,
        width: 120,
        height: 120
    });

    // Ellipse
    addVisualTest("Ellipse - Filled", {
        text: "",
        shape: "ellipse",
        color: "#00FFFF",
        fillMode: "fill",
        strokeWidth: 0,
        width: 150,
        height: 100
    });
    addVisualTest("Ellipse - Outline", {
        text: "",
        shape: "ellipse",
        color: "#00FFFF",
        fillMode: "outline",
        strokeWidth: 3,
        width: 150,
        height: 100
    });

    // Triangle (CSS limitation for outline)
    addVisualTest("Triangle - Filled", {
        text: "",
        shape: "triangle",
        color: "#0000FF",
        fillMode: "fill",
        width: 100,
        height: 150
    });
    addVisualTest("Triangle - Outline", {
        text: "",
        shape: "triangle",
        color: "#0000FF",
        fillMode: "outline",
        width: 100,
        height: 150
    });

    // Star
    addVisualTest("Star - Filled", {
        text: "",
        shape: "star",
        color: "#FFD700",
        fillMode: "fill",
        width: 150,
        height: 150
    });
    addVisualTest("Star - Outline", {
        text: "",
        shape: "star",
        color: "#FFD700",
        fillMode: "outline",
        strokeWidth: 3,
        width: 150,
        height: 150
    });

    // ---------------- VISUAL TEXT TESTS ----------------
    addVisualTest("Text - Hello", {
        text: "Hello",
        color: "#000000",
        width: 200,
        height: 50,
        delay: 300,
        duration: 1000,
        position: "center"
    });
    addVisualTest("Text - Circle Label", {
        text: "Circle Label",
        color: "#00FF00",
        width: 120,
        height: 120,
        delay: 300,
        duration: 1200,
        position: "left"
    });

    // ---------------- IMAGE TESTS ----------------
    addImageTest("Image - Center", { imageSrc: "static/images/img1.png", width: 200, height: 200, position: "center", delay: 500, duration: 1500 });
    addImageTest("Image - Left", { imageSrc: "static/images/img1.png", width: 150, height: 150, position: "left", delay: 400, duration: 1200 });
    addImageTest("Image - Loop", { imageSrc: "static/images/img1.png", width: 100, height: 100, position: "right", delay: 300, duration: 1000, loop: { enabled: true, group: "images", repeat: 3, interDelay: 500, randomize: true } });

    // ---------------- WORD LIST TESTS ----------------
    addWordListTest("Word List - Simple", { fileUrl: "/PsychoExp/static/json/words.json", color: "#000000", fontSize: 48, delay: 300, duration: 1000, position: "center", randomize: false });
    addWordListTest("Word List - Random Loop", { fileUrl: "/PsychoExp//static/json/words.json", color: "#FF00FF", fontSize: 36, delay: 400, duration: 1000, position: "top", randomize: true, loop: { enabled: true, group: "wordLoop", repeat: 2, interDelay: 500, randomize: true } });

    // ---------------- IMAGE LIST TESTS ----------------
    addImageListTest("Image List - Center Random", { folderUrl: "/PsychoExp/static/json/images.json", width: 200, height: 200, delay: 300, duration: 1000, position: "center", randomize: true });
    addImageListTest("Image List - Top Fixed", { folderUrl: "/PsychoExp/static/json/images.json", width: 150, height: 150, delay: 400, duration: 1200, position: "top", randomize: false });
    addImageListTest("Image List - Left Loop", { folderUrl: "/PsychoExp/static/json/images.json", width: 100, height: 100, delay: 200, duration: 800, position: "left", randomize: true, loop: { enabled: true, group: "imageLoop1", repeat: 2, interDelay: 400, randomize: true } });
    addImageListTest("Image List - Right Loop Fixed", { folderUrl: "/PsychoExp/static/json/images.json", width: 100, height: 100, delay: 250, duration: 900, position: "right", randomize: false, loop: { enabled: true, group: "imageLoop2", repeat: 3, interDelay: 500, randomize: false } });

    render();
}

createFullDebugExperiment();