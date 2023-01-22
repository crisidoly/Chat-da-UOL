
let nome;
let objetoNome;
let requisicao;
pegarNome();

function pegarNome(){ 
    nome = prompt("Digite seu nome"); 
    objetoNome = {
        name: nome
    }; 
    requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objetoNome);
    requisicao.catch(tratarErro); 
    requisicao.then(inicializaSite);
} 

function inicializaSite(){
    setInterval(carregarMensagens, 3000);
    setInterval(verificaOnline, 4000);
    carregarMensagens();
}

function tratarErro(erro){
    let statusCode = erro.response.status;
    if (statusCode != 200){
        alert("Esse nome já existe");
        pegarNome();
    }
}

function mensagemStatus(mensagem){
    document.querySelector(".messages").innerHTML += `
    <div data-test="message" class="status">
        <p>
            <span class="timer">
                (${mensagem.time})
            </span> 
            <span class="sender">
                ${mensagem.from}
            </span>
                ${mensagem.text}
        </p>
    </div>
    `
}

function mensagemNormal(mensagem){
    document.querySelector(".messages").innerHTML += `
    <div data-test="message" class="line">
            <p>
                <span class="timer">
                    (${mensagem.time})
                </span> 
                <span class="sender">
                    ${mensagem.from}
                </span>
                    para
                <span class="recipient">
                    ${mensagem.to}:
                </span>
                    ${mensagem.text}
            </p>
    </div>
    `
}

function mensagemPrivada(mensagem){
    document.querySelector(".messages").innerHTML += `
    <div data-test="message" class="line private">
            <p>
                <span class="timer">
                    (${mensagem.time})
                </span>
                <span class="sender">
                    ${mensagem.from}
                </span>
                    reservadamente para
                <span class="recipient">
                    ${mensagem.to}:
                </span>
                    ${mensagem.text}
            </p>
    </div>
    `
}

function adicionarMensagens(response){
    const dadosMensagens = response.data;
    document.querySelector(".messages").innerHTML = ""
    for (let i = 0; dadosMensagens.length > i ;i++){
        if("status" === dadosMensagens[i].type){
            mensagemStatus(dadosMensagens[i]);
        } else if("message" === dadosMensagens[i].type){
            mensagemNormal(dadosMensagens[i]);
        }else if("private_message" === dadosMensagens[i].type && (dadosMensagens[i].from === nome || dadosMensagens[i].to === nome || dadosMensagens[i].to === "Todos")){
            mensagemPrivada(dadosMensagens[i]);
        }
    } 
    document.querySelector(".line:last-child").scrollIntoView();
}

function carregarMensagens(){
    promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(adicionarMensagens);
}

function verificaOnline(){
    requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objetoNome);
//    requisicao.catch();
}

function enviarMensagem(btn){
    const textoMensagem = btn.parentNode.querySelector("input").value
    btn.parentNode.querySelector("input").value = ""
    const mensagem = {
        from: nome,
        to: "Todos",
        text: textoMensagem,
        type: "message"
    }
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    promisse.then(carregarMensagens);
    promisse.catch(function(){
        window.location.reload();
    });
}