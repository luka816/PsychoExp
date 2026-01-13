async function createDefaultExps() {
    const LIST_URL =
        "https://raw.githubusercontent.com/luka816/Experimets_Files/refs/heads/master/default_exp_jsons/experiments_urls_list.json";

    try {
        const res = await fetch(LIST_URL);
        if (!res.ok) throw `HTTP ${res.status}`;

        const { experiments } = await res.json();
        if (!Array.isArray(experiments)) throw "Invalid list format";

        for (const url of experiments) {
            await CreateExpFromJsonURL(url);
        }

        /* CreateExpFromJsonURL("exps/AHS-word-name.json")
        CreateExpFromJsonURL("exps/AHS-word-draw.json") */

        CreateExpFromJsonURL("exps/DFP-word-name.json")
        CreateExpFromJsonURL("exps/DFP-word-draw_var_1.json")
        CreateExpFromJsonURL("exps/DFP-word-draw_var_2.json")

        document.getElementById("jsonArea").value = "";
    } catch (e) {
        alert("Failed to load default experiments: " + e);
    }
}

createDefaultExps();
