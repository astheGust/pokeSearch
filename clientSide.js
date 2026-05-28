const urlDebug = "http://127.0.0.1:5000"
const url = "https://pokesearch-j1yc.onrender.com"
document.getElementById("button").addEventListener("click", async (e) => {
    e.preventDefault();
    let data = document.getElementById("name").value
    if (!data.trim()) {
        alert("Digite um nome!")
        return
    }
    let pokemon = document.getElementById("pokeName").textContent
    const rawText = (str) => str.toLowerCase().trim().replace(/[^\w]/g, "")

    if (rawText(data) === rawText(pokemon)) {
        alert("Pokemon já exibido!")
        return
    }

    let payload = { pokemon: data }
    try {
        let res = await fetch(url + "/pokeInfo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        if (!res.ok) {
            if (res.status === 404) {
                let erro = await res.json()
                console.error(erro["err"])
                alert("Este pokemon não existe")
                inputClear()
                return
            }
            throw new Error(`Erro interno:${res.status}`)

        }
        const result = await res.json()
        const name = result["pokemon"]
        const img = result["srcImg"]
        const stats = result["attributes"]
        loading()
        attDados(name, img, stats)
    } catch (err) {
        console.error("Erro apresentado:", err)
    }
})

function inputClear() {

    document.getElementById("name").value = ""
}



function loading() {
    inputClear()
    const lmnts = document.getElementsByClassName("statNumber")
    for (let i = 0; i < 6; i++) {
        lmnts[i].textContent = ""
    }
    document.getElementById("pokeName").textContent = "Loading..."
    document.getElementById("pokeImg").src = "./imgs/Ellipsis@1x-2.4s-200px-200px.gif"
}

function attDados(name, img, stats) {
    const lmnts = document.getElementsByClassName("statNumber")
    const statsOrder = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"]
    document.getElementById("pokeName").textContent = name;
    document.getElementById("pokeImg").src = img
    document.getElementById("content").style.display = "flex"

    statsOrder.forEach((statName, index) => {
        const value = stats[statName] || 0
        lmnts[index].textContent = `${value}/200`
    })


    inputClear()
}
