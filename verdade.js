"use strict";
//var _ = require('lodash');
var OPERADORES = [
	{
		op: '&&', // operador E
		eq: ['ˆ','^','˄']
	},{
		op: '||', // Operador Ou
		eq: ['˅','v']
	},{
		op: '!', // Negação
		eq: ['~', '˜', '¬', '∼', '¬']
	},{
		op: '===false||', // Implicação
		eq: ['→']
	},{
		op: '===', // Equivalência
		eq: ['↔']
	},{
		op: '===false&&false===', // Nor
		eq: ['↓']
	},{
		op: '===false||false===', // Nand
		eq: ['↑']
	},{
		op: '!==', // Disjunção Exclusiva
		eq: ['⊻']
	},{
		op: '(',
		eq: ['[']
	},{
		op: ')',
		eq: [']']
	}
];

document.getElementById('expressao').addEventListener('keypress', gerarTabela);

function gerarTabela(e) {
	if (e.keyCode === 13) {
		var expressao = this.value;
		var variaveis = extrairVariaveis(expressao);
		var combinacoes = criarCombinacoes(variaveis);
		var resolucao = resolver(expressao, combinacoes);
		var rows = '<thead><tr>';
		_.forEach(resolucao[0].variaveis, function(v) {
			rows += '<td>';
			rows += v.variavel;
			rows += '</td>';
		});
		rows+= '<td>'+ expressao +'</td></tr></thead>';
		_.forEach(resolucao, function(r) {
			rows += '<tr>';
			_.forEach(r.variaveis, function(v) {
				rows += '<td>';
				rows += v.valor;
				rows += '</td>';
			});
			rows += '<td>';
			rows += r.resultado;
			rows += '</td>';
			rows += '</tr>';
		});
		console.log(resolucao);
		document.getElementById('verdade').innerHTML = rows;
	}
}

function extrairVariaveis(expressao) {
	var variaveis = expressao.split('');
	variaveis = _.uniq(variaveis);
	variaveis = _.filter(variaveis, function(n) {
	  return n.match(/[a-zA-Z]/i);
	});
	return variaveis;
}


function criarCombinacoes(variaveis) {
	var combinacoes = [];
	for (var i = 0 ; i < Math.pow(2,variaveis.length); i++) {
		var binario = _.padLeft((i >>> 0).toString(2), variaveis.length, 0);

		var combinacao = {
			variaveis: []
		};

		_.map(binario, function(v, k) {
			var variavel = {
				variavel: variaveis[k],
				valor: !!eval(v) 
			};
			combinacao.variaveis.push(variavel)
		});

		combinacoes.push(combinacao);
	}
	return combinacoes;
}

function resolver(expressao, combinacoes) {
	var resultado = _.map(combinacoes, function(c) {
		c.expressao = expressao.split('');

		c.expressao = _.map(c.expressao, function (v){
		
			var i = _.find(c.variaveis, {variavel: v}, 'valor');

			var o = _.find(OPERADORES, {eq: [v]}, 'op');

			return (i)?!!eval(i.valor):((o)?o.op:v);
		
		});

		c.expressao = c.expressao.join('');
		c.resultado = eval(c.expressao);
		
		return c;
	})
	return resultado;
}
