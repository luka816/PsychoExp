function deleteTest(id) {
    const exp = getExp();
    if (!exp) return;

    const test = exp.tests.find(t => t.id === id);
    if (!test) return;

    const ok = confirm(`Are you sure you want to delete the test "${test.name}"?`);
    if (!ok) return;

    exp.tests = exp.tests.filter(t => t.id !== id);
    selectedTest = null;
    render();
}

/* ---------- TEST CONTROLS ---------- */
function duplicateTest(id) {
    const exp = getExp();
    const t = exp.tests.find(t => t.id === id);
    const name = uniqueName(t.name, exp.tests.map(tt => tt.name));

    const clonedParams = structuredClone(t.params); // ✅ deep clone

    exp.tests.push({
        id: crypto.randomUUID(),
        name,
        type: t.type,
        params: clonedParams
    });

    render();
}

function moveTest(id, dir) {
    const exp = getExp();
    const i = exp.tests.findIndex(t => t.id === id);
    const j = i + dir;
    if (j < 0 || j >= exp.tests.length) return;
    [exp.tests[i], exp.tests[j]] = [exp.tests[j], exp.tests[i]];
    render();
}