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

        CreateExpFromJsonURL("http://127.0.0.1:8000/exps/AHS.json")

        document.getElementById("jsonArea").value = "";
    } catch (e) {
        alert("Failed to load default experiments: " + e);
    }
}

createDefaultExps();
