var contador_imgs = 0;
var linhas = 1;
var colunas = 2;
var aspirador = null;
// Quadro sujo?
//   true para sujo, false para limpo
var quadrados = null;
var lista_sujos = new Array();
var contador_movimentos = 0;

class posicao{
	constructor(linha, coluna) {
		this.linha = linha;
		this.coluna = coluna;
	}
};

class no{
	constructor(obj) {
		this.posicao = new posicao(obj.linha, obj.coluna);
		this.sujo = obj.sujo;
		this.visitado = obj.visitado;
		this.listado = obj.listado;
	}
};

function inicializar_matriz(){
	quadrados = new Array(linhas);
	for(linha = 0; linha < linhas; linha++){
		quadrados[linha] = new Array(colunas);
		for(coluna = 0; coluna < colunas; coluna++){
			//quadrados[linha][coluna] = true;
			quadrados[linha][coluna] = new no({
				linha: linha,
				coluna: coluna,
				sujo: true,
				visitado: false,
				listado: false
			});
			lista_sujos.push(new posicao(linha, coluna));
		}
	}
}

function construir_img(linha, coluna, src){
	contador_imgs++;
	return '<img id="img_linha'+linha+'_coluna'+coluna+'" src="'+src+'">';
}

function gerar_imgs_sujo(){
	var imgs = '<table class="table table-bordered">';
	for(linha = 0; linha < linhas; linha++){
		imgs += '<tr>';
		for(coluna = 0; coluna < colunas; coluna++){
			imgs += '<td class="text-center">'+construir_img(linha, coluna, "imgs/sujo.png")+'</td>';
		}
		imgs += '</tr>';
	}
	$("#container-imgs").html(imgs);
}

function gerar_img_aspirador(){
	var seletor = "#img_linha"+aspirador.linha+"_coluna"+aspirador.coluna;
	$(seletor).attr("src", "imgs/sujo-aspirador.png");
}

function gerar_posicao_aspirador(){
	var linha, coluna;
	linha = Math.floor(Math.random() * linhas);
	coluna = Math.floor(Math.random() * colunas);
	aspirador = new posicao(linha, coluna);
}

function aspirar(){
	contador_movimentos++;
	quadrados[aspirador.linha][aspirador.coluna].sujo = false;
	seletor = "#img_linha"+aspirador.linha+"_coluna"+aspirador.coluna;
	$(seletor).attr("src", "imgs/limpo-aspirador.png");
	for(i = 0; i < lista_sujos.length; i++){
		if(lista_sujos[i].linha == aspirador.linha
		&& lista_sujos[i].coluna == aspirador.coluna)
			lista_sujos.splice(i, 1);
	}

	atualizar_contador_quadros_sujos();
	tudo_limpo();
}

function atualizar_img_movimento(img_true, img_false){
	if(quadrados[aspirador.linha][aspirador.coluna].sujo === true){
		img = img_true;
	}else if(quadrados[aspirador.linha][aspirador.coluna].sujo === false){
		img = img_false;
	}
	$("#img_linha"+aspirador.linha+"_coluna"+aspirador.coluna).attr("src", img);
}

function mover(direcao){
	contador_movimentos++;
	switch(direcao){
		case "direita":
			var limite = colunas - 1;
			var img = "";
			var seletor = "";
			if(aspirador.coluna < limite){
				// Atualizar o quadro antigo onde o aspirador estava
				atualizar_img_movimento("imgs/sujo.png", "imgs/limpo.png");

				// Atualizar o quadro novo onde o aspirador esta
				aspirador.coluna++;
				atualizar_img_movimento("imgs/sujo-aspirador.png", "imgs/limpo-aspirador.png");
			}
			break;
		case "esquerda":
			var limite = 0;
			if(aspirador.coluna > limite){
				// Atualizar o quadro antigo onde o aspirador estava
				atualizar_img_movimento("imgs/sujo.png", "imgs/limpo.png");

				// Atualizar o quadro novo onde o aspirador esta
				aspirador.coluna--;
				atualizar_img_movimento("imgs/sujo-aspirador.png", "imgs/limpo-aspirador.png");
			}
			break;
		case "acima":
			var limite = 0;
			if(aspirador.linha > limite){
				// Atualizar o quadro antigo onde o aspirador estava
				atualizar_img_movimento("imgs/sujo.png", "imgs/limpo.png");

				// Atualizar o quadro novo onde o aspirador esta
				aspirador.linha--;
				atualizar_img_movimento("imgs/sujo-aspirador.png", "imgs/limpo-aspirador.png");
			}
			break;
		case "abaixo":
			var limite = linhas - 1;
			if(aspirador.linha < limite){
				// Atualizar o quadro antigo onde o aspirador estava
				atualizar_img_movimento("imgs/sujo.png", "imgs/limpo.png");

				// Atualizar o quadro novo onde o aspirador esta
				aspirador.linha++;
				atualizar_img_movimento("imgs/sujo-aspirador.png", "imgs/limpo-aspirador.png");
			}
			break;
		default:
			break;
	}
	tudo_limpo();
}

function tudo_limpo(){
	atualizar_contador_movimentos();
	if(lista_sujos.length == 0){
		swal({
			title: "Parábens!",
			text: "Todos os quadrados estão limpos!",
			icon: "success",
			closeOnClickOutside: false,
			buttons: {
				confirm: {
					text: "OK",
					value: true,
					visible: true,
					closeModal: true
				}
			}
		}).then(function(value){
			location.reload();
		});
	}
}

function atualizar_contador_movimentos(){
	$("#contador_movimentos").html(contador_movimentos);
}

function atualizar_contador_quadros_sujos(){
	$("#contador_quadros_sujos").html(lista_sujos.length);
}

function inicializar(){
	contador_imgs = 0;
	aspirador = null;
	// Quadro sujo?
	//   true para sujo, false para limpo
	quadrados = null;
	lista_sujos = new Array();
	contador_movimentos = 0;

	inicializar_matriz();
	// Gera todas as imagens como quadrados sujos e injeta no html
	gerar_imgs_sujo();
	// Gera a posicao do aspirador de forma aleatoria
	/*gerar_posicao_aspirador();*/
	aspirador = new posicao(0,0);
	// Gera a imagem do aspirador com o quadro sujo e injeta no html
	gerar_img_aspirador();
	
	atualizar_contador_movimentos();
	atualizar_contador_quadros_sujos();
};

$(document).ready(function(){
	inicializar();

	$("#btn-parado").on("click", function(){
		contador_movimentos++;
		atualizar_contador_movimentos();
	});

	$("#btn-mover-acima").on("click", function(){
		mover("acima");
	});
	$("#btn-mover-esquerda").on("click", function(){
		mover("esquerda");
	});
	$("#btn-mover-direita").on("click", function(){
		mover("direita");
	});
	$("#btn-mover-abaixo").on("click", function(){
		mover("abaixo");
	});
	$("#btn-limpar").on("click", function(){
		aspirar();
	});
});
