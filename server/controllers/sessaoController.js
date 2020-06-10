const models = require('../models')

var successStatus = 200

exports.post = async function (req) {
	let response = null
	try {
		response = await models.Sessao.adiciona(models, {
			dataInicioSessao: req.dataSessao,
			horaInicioSessao: req.horaSessao,
			dataTerminoSessao: req.dataSessao,
			horaTerminoSessao: req.horaSessao,
			AcolhidoId: req.AcolhidoId,
			VoluntarioId: req.VoluntarioId,
			presenca: req.presenca,
			observacao: req.observacao
		})
		// res.status(successStatus).json(response)
	} catch (error) {
		console.log("\n", error, "\n")
		// res.status(error.code).json(error.message)
	}

}
exports.get = async function (req) {
	let response = null
	try {
		response = await models.Sessao.lista()
		return response;
		// res.status(successStatus).json(response)
	} catch (error) {
		console.log("\n", error, "\n")
		// res.status(error.code).json(error.message)
	}
}