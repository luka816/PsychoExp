function copyTextarea() {
    const textarea = document.getElementById("jsonArea");
    textarea.select();                  // Select all text
    textarea.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(textarea.value) // Copy to clipboard
        .then(() => alert("Text copied!"))
        .catch(() => alert("Copy failed"));
}

function downloadTextarea() {
    const textarea = document.getElementById("jsonArea");
    const text = textarea.value;
    if (!text) return alert("Textarea is empty!");

    const exp = getExp();
    const filename = (exp?.name || "experiment").replace(/[^a-z0-9_\-]/gi, "_") + ".txt";

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function clearTextarea() {
    const textarea = document.getElementById("jsonArea");
    textarea.value = "";                 // Clear the text area
}

function copyExperiment() {
    const exp = getExp();
    if (!exp) return;
    document.getElementById("jsonArea").value =
        JSON.stringify({
            name: exp.name,
            tests: exp.tests.map(t => ({ name: t.name, type: t.type, params: t.params }))
        }, null, 2);
}


function createExperimentFromJSON() {
    try {
        const obj = JSON.parse(document.getElementById("jsonArea").value);
        if (!obj.name || !Array.isArray(obj.tests)) throw "Invalid structure";
        if (experiments.some(e => e.name === obj.name)) throw "Experiment name must be unique";

        const testNames = obj.tests.map(t => t.name);
        if (new Set(testNames).size !== testNames.length) throw "Test names must be unique";

        const exp = {
            id: crypto.randomUUID(),
            name: obj.name,
            tests: obj.tests.map(t => ({
                id: crypto.randomUUID(),
                name: t.name,
                type: t.type,
                params: { ...t.params }
            }))
        };
        experiments.push(exp);
        selectedExperiment = exp.id;
        selectedTest = null;
        render();
    } catch (e) {
        alert("JSON error: " + e);
    }
}