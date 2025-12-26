/* ---------- EXPERIMENTS ---------- */
function addExperiment() {
    const name = uniqueName("Experiment", experiments.map(e => e.name));
    experiments.push({
        id: crypto.randomUUID(),
        name,
        tests: [],      // test definitions
    });
    selectedExperiment = experiments.at(-1).id;
    selectedTest = null;
    render();
}

/* addExperiment() */

function deleteExperiment(id) {
    const exp = experiments.find(e => e.id === id);
    if (!exp) return;

    const ok = confirm(`Are you sure you want to delete the experiment "${exp.name}"?`);
    if (!ok) return;

    experiments = experiments.filter(e => e.id !== id);
    selectedExperiment = experiments[0]?.id || null;
    selectedTest = null;
    render();
}

function renameExperiment(id, newName) {
    if (!newName.trim()) return;
    if (experiments.some(e => e.name === newName && e.id !== id)) return alert("Experiment name must be unique");
    const exp = experiments.find(e => e.id === id);
    exp.name = newName;
}