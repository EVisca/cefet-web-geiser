// importação de dependência(s)
//### Exercício 1: Arquivos Estáticos

// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código
const express = require("express");
const app = express();
const fs = require("fs");



// variáveis globais deste módulo
const PORT = 3000
//const db = {}

//"Agora, modifique o arquivo `server/app.js` para ativar um servidor estático"

//endereço de onde está o servidor
const baseUrl = "C:Users/Eduardo/Documents/GitHub/cefet-web-geiser-main/server"; 

//databases para jogador e os jogos do mesmo
let dbjogador= {};
let dbJogosJogador = {};

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código

//o servidor deve servir os arquivos da pasta `client/`
app.use(express.static("C:/Users/Eduardo/Documents/GitHub/cefet-web-geiser-main/client"));

//"Abra" o servidor e deixe-o escutando (`app.listen`) na porta 3000

app.listen(PORT, function () 
{
    console.log("Porta: 3000");
}
);
//ENOENT- No such file or directory => ???
/*Error: ENOENT: no such file or directory, open 'C:Users/Eduardo/Documents/GitHub/cefet-web-geiser-main/server/data/jogosPorJogador.json'
    at Object.openSync (fs.js:458:3)
    at Object.readFileSync (fs.js:360:35)
    at Object.<anonymous> (C:\Users\Eduardo\Documents\GitHub\cefet-web-geiser-main\server\app.js:51:4)
    at Module._compile (internal/modules/cjs/loader.js:1138:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1158:10)
    at Module.load (internal/modules/cjs/loader.js:986:32)
    at Function.Module._load (internal/modules/cjs/loader.js:879:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:71:12)
    at internal/main/run_main_module.js:17:47 {
  errno: -4058,
  syscall: 'open',
  code: 'ENOENT',
  path: 'C:Users/Eduardo/Documents/GitHub/cefet-web-geiser-main/server/data/jogosPorJogador.json'
*/




// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))

//Leitura/load da DB p/ Jogador e jogosJogador

dbJogosJogador = JSON.parse(
        // baseUrl definida acima na linha 17
    fs.readFileSync(baseUrl + "/data/jogosPorJogador.json", {
    encoding: "utf8",
    flag: "r",
    })
);

dbJogador = JSON.parse(

    fs.readFileSync(baseUrl + "/data/jogadores.json", {
    encoding: "utf8",
    flag: "r",
    })
);



// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
//Alterações feitas no index.hbs


dbJogador.players.forEach((player) => 
{
    let games = dbJogosJogador[player.steamid].games.sort(compare).slice(0, 5);
    games.forEach(

      (e) => (e.playtime_forever = Math.floor(e.playtime_forever / 60))
    );

    player.notplayedgames = getNotPlayedGames(
      dbJogosJogador[player.steamid].games
    );

    player.favoriteGame = games[0];
    player.top5 = games;
    getPlayerDeatils(player);

  }
  
  );
  
  app.set("view engine", "hbs");
  app.set("views", baseUrl + "/views");
  
  app.get("/", function (req, res)
    {
        
    res.render("index", dbJogador);
  }
  
);


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código

//"campos calculados" como os detalhes do jogador, tempo total nos jogos,
//quant de jogos, quais jogadors e os não jogados (aka pegar aqui com 80%
//de desconto pra não perder promoção)


  
  const getNotPlayedGames = (games) => 
  
  {
    let totalNotPlayed = 0;

    games.forEach((game) => 
    {
      if (game.playtime_forever === 0) totalNotPlayed++;
    }
    );
  
    return totalNotPlayed;
  };

//sempre buscar os dados dentre aquilo que já existe nas dbs
//e atrelado a sua ID de conta
  const getPlayerDetails = (player) => 
  {
    app.get(`/jogador/${player.steamid}`, function (req, res)
     {

      res.render(
        "jogador",
        Object.assign(player, dbJogosJogador[player.steamid])
      );

    }
    );
  };
