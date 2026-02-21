import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

async function paginar(req, res, next) {
    try {
        let { limite = 5, pagina = 1, ordenacao = "_id:-1" } = req.query; //Obtém os parâmetros de consulta da requisição, definindo valores padrão para limite, pagina e ordenacao caso não sejam fornecidos na requisição
        
              let [campoOrdenacao, ordem] = ordenacao.split(":"); //Divide a string de ordenação em campo de ordenação e ordem (ascendente ou descendente)
        
              limite = parseInt(limite); //Converte o valor de limite para inteiro
              pagina = parseInt(pagina); //Converte o valor de pagina para inteiro
              ordem = parseInt(ordem); //Converte o valor de ordem para inteiro

              const resultado = req.resultado; //Obtém o resultado da consulta anterior, que foi armazenado no objeto req pelo middleware anterior (listarLivros)
        
              if (limite > 0 && pagina > 0) { //Verifica se os valores de limite e pagina são válidos (maiores que 0)
                const resultadoPaginado = await resultado 
                  .find()
                  .sort({ [campoOrdenacao]: ordem }) //Ordena os livros pelo campo especificado na ordem especificada
                  .skip((pagina - 1) * limite) //Pula os documentos anteriores com base na página atual e no limite
                  .limit(limite) //Limita o número de documentos retornados com base no valor de limite
                  .exec(); //Executa a consulta e retorna os resultados
        
                res.status(200).json(resultadoPaginado); //Envia a resposta com status 200 (OK) e os livros encontrados no formato JSON
              } else {
                next(new RequisicaoIncorreta()) //Se os valores de limite ou pagina forem inválidos, lança um erro de requisição incorreta
              }
    } catch (erro) {
        next(erro); //Em caso de erro durante a execução da consulta, passa o erro para o próximo middleware de tratamento de erros
    }
}

export default paginar; //Exporta a função paginar para que possa ser utilizada em outros arquivos, como no arquivo de rotas para aplicar a paginação aos resultados da consulta de livros