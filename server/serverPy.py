from flask import Flask,request,jsonify
from flask_cors import CORS
import requests
app = Flask(__name__)
CORS(app)
urlPoke = "https://pokeapi.co/api/v2"


@app.route("/pokeInfo",methods=["POST"])
def pokeInfo():

    dados = request.json
    nome = dados.get("pokemon","").lower().strip()
    if not nome: return jsonify({"err":"Nome vazio"}),400
    try:
        req = requests.get(f"{urlPoke}/pokemon/{nome}")
        req.raise_for_status()
        res = req.json()

        name = res.get("species",{}).get("name",{})
        artwork= res.get("sprites",{}).get("other",{}).get("official-artwork",{})
        default_art = artwork.get("front_default","")
        if not default_art: return jsonify({"err":"Imagem não disponível"}),404
        statsList = res.get("stats")
        stats = {i["stat"]["name"]:i["base_stat"]
                for i in statsList
                if i.get("base_stat")}
        dices = {"pokemon":name.capitalize(),"srcImg":default_art,"attributes":stats}
        return jsonify(dices),200
            
    except requests.exceptions.HTTPError as err:
        print(f"Erro Http:,{err}\nPokemon possivelmente não encontrado.")
        return jsonify({"err":"Pokemon não encontrado"}),404
    except requests.RequestException as err:
        print("Erro de requisição:",err)
        return jsonify({"err":"Erro ao se conectar a api"}),500


if __name__ == "__main__":
    print("server rodando!")
    app.run(debug=True,port=5000)