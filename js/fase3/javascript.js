class posicao{
	constructor(obj){
		this.linha = obj.linha;
		this.coluna = obj.coluna
	}
}

class no{
	constructor(obj){
		this.id = ++id_increment;
		this.posicao = obj.posicao;
		this.resetar = function(){
			this.f = 0;
			this.g = 0;
			this.h = 0;
			this.dentro_conjunto_fechado = false;
			this.dentro_conjunto_aberto = false;
			this.antecessor = null;
		};
		this.f = 0;
		// Quando adicionar os niveis
		// de rua tem que adicionar
		// o custo G (em teste vai ser
		// sempre 1)
		this.g = 0;
		this.h = 0;
		this.fila_adjacencia = [];
		// Determina se este no esta no conjuto fechado
		this.dentro_conjunto_fechado = false;
		// Determina se este no esta no conjuto aberto
		this.dentro_conjunto_aberto = false;
		this.antecessor = null;
		// Determina se eh obstaculo ou nao
		// se for ele sera excluido na busca
		this.eh_obstaculo = false;
		// Texto para ser colocado dentro do quadrado
		this.texto = null;
		// Atribui o custo daquela rua
		this.custo = congestionamento(congestionamento_mapa[this.posicao.linha][this.posicao.coluna]);
		this.desenhar = function(obj){
			stroke(100);
			//noStroke();
			fill(obj.cor);
			rect(this.posicao.coluna * largura_bloco,this.posicao.linha * altura_bloco,largura_bloco,altura_bloco);
			if(this.texto != null){
				fill(0);
				text(this.texto, this.posicao.coluna * largura_bloco + (largura_bloco / 2), this.posicao.linha * altura_bloco + (altura_bloco / 2));
			}
		};
		// Desenha o no de acordo com a sua
		// configuracao e atribui os nos que
		// sao paredes
		if(config_mapa[this.posicao.linha][this.posicao.coluna] == 1){//obstaculo
			this.eh_obstaculo = true;
			desenhar_bloco(this, 50);
		}else if(config_mapa[this.posicao.linha][this.posicao.coluna] == 0)//Rua
			desenhar_bloco(this, 255);
		else if(config_mapa[this.posicao.linha][this.posicao.coluna] == 'A'){//Ammmo
			fila_comercios.push(this);
			this.texto = "A";
			desenhar_bloco(this, color(255,255,0));
		}else if(config_mapa[this.posicao.linha][this.posicao.coluna] == 'F'){//Food
			fila_comercios.push(this);
			this.texto = "F";
			desenhar_bloco(this, color(247,150,70));
		}else if(config_mapa[this.posicao.linha][this.posicao.coluna] == 'G'){//Guns
			fila_comercios.push(this);
			this.texto = "G";
			desenhar_bloco(this, color(0,176,80));
		}else if(config_mapa[this.posicao.linha][this.posicao.coluna] == 'W'){//Water
			fila_comercios.push(this);
			this.texto = "W";
			desenhar_bloco(this, color(0,112,192));
		}else if(config_mapa[this.posicao.linha][this.posicao.coluna] == '#'){//Casa
			robo = JSON.parse(JSON.stringify(this.posicao));
			casa = this;
			this.texto = "#";
			desenhar_bloco(this, color(0,176,240));
			image(robo_img,casa.posicao.coluna * largura_bloco, casa.posicao.linha * altura_bloco, largura_bloco, altura_bloco);
		}
		// Se nao for obstaculo adiciono os nos adjacentes
		if( ! this.eh_obstaculo){
			// No acima
			if(this.posicao.linha > 0
			&& config_mapa[this.posicao.linha - 1][this.posicao.coluna] != 1)
				this.fila_adjacencia.push(new posicao({linha: this.posicao.linha - 1,coluna: this.posicao.coluna}));
			// No a direita
			if(this.posicao.coluna < (colunas - 1)
			&& config_mapa[this.posicao.linha][this.posicao.coluna + 1] != 1)
				this.fila_adjacencia.push(new posicao({linha: this.posicao.linha,coluna: this.posicao.coluna + 1}));
			// No abaixo
			if(this.posicao.linha < (linhas - 1)
			&& config_mapa[this.posicao.linha + 1][this.posicao.coluna] != 1)
				this.fila_adjacencia.push(new posicao({linha: this.posicao.linha + 1,coluna: this.posicao.coluna}));
			// No a esquerda
			if(this.posicao.coluna > 0
			&& config_mapa[this.posicao.linha][this.posicao.coluna - 1] != 1)
				this.fila_adjacencia.push(new posicao({linha: this.posicao.linha,coluna: this.posicao.coluna - 1}));
		}
	}
}

var linhas = 20;
var colunas = 20;
/**
0 - Rua
1 - Obstaculo
# - Casa
A - Comérciode Munição (Ammo)
F - Comérciode Alimentos (Food)
W - Comércio de Água (Water)
G - Comércio de Armas (Guns)
*/
var config_mapa = new Array(linhas);
config_mapa[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
config_mapa[1] = [0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0];
config_mapa[2] = [0,1,'#',0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0];
config_mapa[3] = [0,1,1,0,1,1,'A',0,0,0,0,0,1,1,0,1,1,1,1,0];
config_mapa[4] = [0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0];
config_mapa[5] = [0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1,'F',1,0];
config_mapa[6] = [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0];
config_mapa[7] = [0,1,1,0,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0];
config_mapa[8] = [0,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,0];
config_mapa[9] = [0,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,0];
config_mapa[10] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0];
config_mapa[11] = [0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0];
config_mapa[12] = [0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0];
config_mapa[13] = [0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,0,0,0];
config_mapa[14] = [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0];
config_mapa[15] = [0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0];
config_mapa[16] = [0,0,0,0,1,1,0,'W',1,1,0,1,1,0,1,1,0,1,'G',0];
config_mapa[17] = [0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0];
config_mapa[18] = [0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0];
config_mapa[19] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
/**
Nível 1 - Tempo Gasto: +3 min
Nível 2 - Tempo Gasto: +8 min
Nível 3 - Tempo Gasto: +14 min
Nível 4 - Tempo Gasto: +20 min
Nível 5 - Tempo Gasto: +30 min
null - Quando eh um obstaculo
*/
var congestionamento_mapa = new Array(linhas);
/*congestionamento_mapa[0] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
congestionamento_mapa[1] = [1,null,null,1,null,null,null,1,null,null,null,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[2] = [1,null,1,1,null,null,null,1,null,null,null,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[3] = [1,null,null,1,null,null,1,1,1,1,1,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[4] = [1,null,null,1,null,null,null,1,null,null,null,1,null,null,1,1,1,1,1,1];
congestionamento_mapa[5] = [1,null,null,1,null,null,null,1,null,null,null,1,null,null,1,null,null,1,null,1];
congestionamento_mapa[6] = [1,1,1,1,1,1,1,1,1,1,1,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[7] = [1,null,null,1,null,null,1,null,null,null,null,1,1,1,1,1,1,1,1,1];
congestionamento_mapa[8] = [1,null,null,1,null,null,1,null,null,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[9] = [1,null,null,1,null,null,1,null,null,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[10] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,null,null,1];
congestionamento_mapa[11] = [1,null,null,1,null,null,null,null,1,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[12] = [1,null,null,1,null,null,null,null,1,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[13] = [1,null,null,1,null,null,null,null,1,null,null,1,null,null,null,null,1,1,1,1];
congestionamento_mapa[14] = [1,null,null,1,1,1,1,1,1,1,1,1,1,1,1,1,1,null,null,1];
congestionamento_mapa[15] = [1,null,null,1,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1];
congestionamento_mapa[16] = [1,1,1,1,null,null,1,1,null,null,1,null,null,1,null,null,1,null,1,1];
congestionamento_mapa[17] = [1,null,null,1,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1];
congestionamento_mapa[18] = [1,null,null,1,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1];
congestionamento_mapa[19] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];*/
congestionamento_mapa[0] =  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
congestionamento_mapa[1] =  [1,null,null,1,null,null,null,1,null,null,null,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[2] =  [1,null,1,5,null,null,null,1,null,null,null,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[3] =  [1,null,null,5,null,null,1,1,1,1,1,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[4] =  [1,null,null,5,null,null,null,1,null,null,null,1,null,null,1,1,1,1,1,1];
congestionamento_mapa[5] =  [1,null,null,5,null,null,null,1,null,null,null,1,null,null,1,null,null,1,null,1];
congestionamento_mapa[6] =  [1,1,1,5,1,1,1,1,1,1,1,1,null,null,1,null,null,null,null,1];
congestionamento_mapa[7] =  [1,null,null,5,null,null,1,null,null,null,null,1,1,1,1,1,1,1,1,1];
congestionamento_mapa[8] =  [1,null,null,5,null,null,1,null,null,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[9] =  [1,null,null,5,null,null,1,null,null,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[10] = [1,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,null,null,1];
congestionamento_mapa[11] = [1,null,null,5,null,null,null,null,1,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[12] = [1,null,null,5,null,null,null,null,1,null,null,1,null,null,null,null,1,null,null,1];
congestionamento_mapa[13] = [1,null,null,5,null,null,null,null,1,null,null,1,null,null,null,null,1,1,1,1];
congestionamento_mapa[14] = [1,null,null,5,1,1,1,1,1,1,1,1,1,1,1,1,1,null,null,1];
congestionamento_mapa[15] = [1,null,null,5,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1];
congestionamento_mapa[16] = [1,1,1,5,null,null,1,1,null,null,1,null,null,1,null,null,1,null,1,1];
congestionamento_mapa[17] = [1,null,null,5,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1];
congestionamento_mapa[18] = [1,null,null,5,null,null,1,null,null,null,1,null,null,1,null,null,1,null,null,1];
congestionamento_mapa[19] = [1,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var mapa = [];
var conjunto_aberto = [];
var conjunto_fechado = [];
var id_increment = 0;
var caminho = [];
var casa = null;
var fila_comercios = [];
var robo = null;
var contador_movimentos = 0;

function congestionamento(nivel){
	var custo = null;
	if(nivel == 1)
		custo = 3;
	else if(nivel == 2)
		custo = 8;
	else if(nivel == 3)
		custo = 14;
	else if(nivel == 4)
		custo = 20;
	else if(nivel == 5)
		custo = 30;
	return custo;
}

function reseta_variaveis(){
	for(var i = 0; i < conjunto_aberto.length; i++){
		conjunto_aberto[i].resetar();
	}
	conjunto_aberto = [];
	for(var i = 0; i < conjunto_fechado.length; i++){
		conjunto_fechado[i].resetar();
	}
	conjunto_fechado = [];
}

function preload(){
	robo_img = loadImage("imgs/fase3/robot.png");
}

function setup(){
	var canv = createCanvas(800,800);
	canv.parent("container-mapa");
	background(50);
	altura_bloco = height / linhas;
	largura_bloco = width / colunas;
	for(var i = 0; i < linhas; i++){
		mapa[i] = [];
		for(var j = 0; j < colunas; j++){
			mapa[i][j] = new no({
				posicao: new posicao({
					linha: i,
					coluna: j
				})
			});
		}
	}
	// Organiza ordem de visita dos 
	// comercios
	var aux = [];
	// Comercio mais proximo de casa
	var mais_perto_casa = 0;
	for(var i = 0; i < fila_comercios.length; i++){
		if(manhattan(casa, fila_comercios[i]) < manhattan(casa, fila_comercios[mais_perto_casa]))
			mais_perto_casa = i;
	}
	aux.push(fila_comercios[mais_perto_casa]);
	remover_elemento_array(fila_comercios, fila_comercios[mais_perto_casa]);
	while(fila_comercios.length > 0){
		var comercio_atual = aux[aux.length - 1];
		var comercio_mais_perto = 0;
		// Proximo comercio mais proximo do atual
		for(var i = 0; i < fila_comercios.length; i++){
			if(manhattan(comercio_atual, fila_comercios[i]) < manhattan(comercio_atual, fila_comercios[comercio_mais_perto]))
				comercio_mais_perto = i;
		}
		aux.push(fila_comercios[comercio_mais_perto]);
		remover_elemento_array(fila_comercios, fila_comercios[comercio_mais_perto]);
	}
	// Fila recebe os comercios organizados
	fila_comercios = aux;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buscar(){
	inicio = casa;
	meta = fila_comercios[0];
	conjunto_aberto.push(inicio);
	if( ! busca()){
		alert("Não tem solução!");
		return false;
	}

	for(var i = 1; i < fila_comercios.length; i++){
		reseta_variaveis();
		inicio = fila_comercios[i - 1];
		meta = fila_comercios[i];
		conjunto_aberto.push(inicio);
		if( ! busca()){
			alert("Não tem solução!");
			return false;
		}
	}

	reseta_variaveis();
	inicio = fila_comercios[fila_comercios.length - 1];
	meta = casa;
	conjunto_aberto.push(inicio);
	if( ! busca()){
		alert("Não tem solução!");
		return false;
	}
	desenhar_caminho();
}

function manhattan(no1, no2){
	return abs(no1.posicao.coluna - no2.posicao.coluna) + abs(no1.posicao.linha - no2.posicao.linha);
}

function remover_elemento_array(arr, el){
	for(var i = arr.length - 1; i >= 0; i--){
		if(arr[i] == el)
			arr.splice(i, 1);
	}
}

function add_caminho(no_atual){
	var aux = no_atual;
	caminho.push(new Array());
	let l = caminho.length - 1;
	caminho[l].push(JSON.parse(JSON.stringify(no_atual)));
	while(aux.antecessor){
		caminho[l].push(JSON.parse(JSON.stringify(aux.antecessor)));
		aux = aux.antecessor;
	}
}

function desenhar_bloco(no, cor){
	stroke(100);
	fill(cor);
	rect(no.posicao.coluna * largura_bloco,no.posicao.linha * altura_bloco,largura_bloco,altura_bloco);
	if(no.texto != null){
		fill(0);
		text(no.texto, no.posicao.coluna * largura_bloco + (largura_bloco / 2), no.posicao.linha * altura_bloco + (altura_bloco / 2));
	}
}

async function desenhar_caminho(){
	let caminhos = caminho.length;
	for(var i = 0; i < caminhos; i++){
		let fim = caminho[i].length - 1;
		let passos = -1;
		for(let j = fim; j >= 0; j--){
			passos++;
			atualizar_contador_movimentos(parseInt(contador_movimentos) + parseInt(passos));
			$("#tabela-custo tbody").html(
				"<tr><td>"+passos+"</td><td>"+caminho[i][j].f+"</td><td>"+caminho[i][j].g+"</td><td>"+caminho[i][j].h+"</td></tr>"
			);
			desenhar_bloco(caminho[i][j], color(color(95,158,160)));
			image(
				robo_img,
				caminho[i][j].posicao.coluna * largura_bloco,
				caminho[i][j].posicao.linha * altura_bloco,
				largura_bloco,
				altura_bloco
			);
			await sleep(350);
			desenhar_bloco(caminho[i][j], color(color(95,158,160)));
		}
		contador_movimentos += passos;
	}
	jogo_terminou();
}

function busca(){
	meta_atingida = false;
	while(conjunto_aberto.length > 0){
		var menor_f = 0;
		for(var i = 0; i < conjunto_aberto.length; i++){
			if(conjunto_aberto[i].f < conjunto_aberto[menor_f].f){
				menor_f = i;
			}
		}
		var no_atual = conjunto_aberto[menor_f];
		if(no_atual === meta){
			meta_atingida = true;
			add_caminho(no_atual);
			break;
		}

		remover_elemento_array(conjunto_aberto, no_atual);
		no_atual.dentro_conjunto_aberto = false;
		conjunto_fechado.push(no_atual);
		no_atual.dentro_conjunto_fechado = true;
	
		for(var i = 0; i < no_atual.fila_adjacencia.length; i++){
			var posicao = no_atual.fila_adjacencia[i];
			var no_vizinho = mapa[posicao.linha][posicao.coluna];
			// Se o no ja estiver no conjunto fechado
			// nao eh necessario revisita-lo e mudar
			// o seu custo G
			/*if(conjunto_fechado.includes(no_vizinho)
			|| no_vizinho.eh_obstaculo)
				continue;*/
			if(no_vizinho.dentro_conjunto_fechado
			|| no_vizinho.eh_obstaculo)
				continue;

			var temp_g = no_atual.g + no_vizinho.custo;
			//if(conjunto_aberto.includes(no_vizinho))
			if(no_vizinho.dentro_conjunto_aberto)
			{
				if(temp_g < no_vizinho.g)
					no_vizinho.g = temp_g;
			}else{
				no_vizinho.g = temp_g;
				conjunto_aberto.push(no_vizinho);
				no_vizinho.dentro_conjunto_aberto = true;
			}

			no_vizinho.h = manhattan(no_vizinho, meta);
			no_vizinho.f = no_vizinho.g + no_vizinho.h;
			no_vizinho.antecessor = no_atual;
		}
	}

	return meta_atingida;
}

function atualizar_contador_movimentos(num = null){
	if(num === null)
		$("#contador_movimentos").html(contador_movimentos);
	else
		$("#contador_movimentos").html(num);
}

function jogo_terminou(){
	swal({
		title: "Parabens!",
		text: "O melhor caminho é realizado com "+contador_movimentos+" movimentos, você conseguiu realizar a tarefa com o menor número de movimentos?",
		icon: "success",
		buttons: {
			confirm: {
				text: "Resetar",
				value: true,
				visible: true,
				closeModal: true
			}
		}
	}).then(function(result){
		if(result)
			window.location.reload();
	});
}

$(document).ready(function(){
	$("#buscar").on("click", function(){
		buscar();
		$("#buscar").unbind();
	});

});