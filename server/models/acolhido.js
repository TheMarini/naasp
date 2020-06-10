'use strict';
const util = require("../util")
const modelName = "Acolhido"


module.exports = (sequelize, DataTypes) => {

  const Acolhido = sequelize.define('Acolhido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alcoolismoFamilia: {
      type: DataTypes.STRING
    },
    atividadeFisica: {
      type: DataTypes.STRING
    },
    atividadesReligiosas: {
      type: DataTypes.STRING
    },
    bebidaQuantidade: {
      type: DataTypes.STRING
    },
    cigarroQuantidade: {
      type: DataTypes.INTEGER
    },
    condicoesMoradia:{
      type: DataTypes.STRING
    },
    demanda: {
      type: DataTypes.STRING
    },
    encaminhamento: {
      type: DataTypes.STRING
    },
    medicamentosFamilia: {
      type: DataTypes.STRING
    },
    observacao: {
      type: DataTypes.STRING
    },
    observacaoBeneficioGoverno: {
      type: DataTypes.STRING
    },
    paroquia: {
      type: DataTypes.STRING
    },
    preferenciaAtendimento: {
      allowNull: false,
      type: DataTypes.STRING
    },
    prioridade: {
      type: DataTypes.INTEGER
    },
    tipoBeneficioGoverno: {
      type: DataTypes.STRING
    },
    valorBeneficioGoverno:{
      type: DataTypes.DOUBLE
    },
    PessoaId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    ReligiaoId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    StatusId: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    freezeTableName: true
  })

  Acolhido.associate = function (models) {
    Acolhido.belongsTo(models.Pessoa, {
      foreignKey: 'PessoaId'
    })
    Acolhido.belongsTo(models.Religiao, {
      foreignKey: 'ReligiaoId'
    });
    Acolhido.hasMany(models.Familiar)
    Acolhido.hasMany(models.DoencaFamilia)
    Acolhido.hasMany(models.MedicamentoContinuo)
    Acolhido.hasMany(models.TentativaContato)
    // Acolhido.hasMany(models.Sessao)
  };

  Acolhido.adiciona = async function (models, param) {
    let { 
      acolhidoParam,
      religiaoParam,
      familiaresParam = []
    } = param
    
    valida(acolhidoParam)

    try {
      let t = await sequelize.transaction({ autocommit: false })
      let queryOptions = {transaction: t}
      
      let acolhidoInstance = await Acolhido.create({
        atividade_fisica: acolhidoParam.atividade_fisica,
        atividades_religiosas: acolhidoParam.atividades_religiosas,
        bebida_quantidade: acolhidoParam.bebida_quantidade,
        bebida_periodicidade: acolhidoParam.bebida_periodicidade,
        demanda: acolhidoParam.demanda,
        encaminhamento: acolhidoParam.encaminhamento,
        numero_cigarros_por_dia: acolhidoParam.numero_cigarros_por_dia,
        observacao: acolhidoParam.observacao,
        paroquia: acolhidoParam.paroquia,
        preferenciaAtendimento: acolhidoParam.preferenciaAtendimento,
        prioridade: acolhidoParam.prioridade,
        StatusId: (param.pessoaParam.cpf != "")? 2 : 1
      }, queryOptions)

      await Acolhido.atualizaPessoa(models, param, acolhidoInstance, t)
      await Acolhido.atualizaReligiao(models.Religiao, religiaoParam, acolhidoInstance, t)
      await Acolhido.atualizaFamiliares(models.Familiar, familiaresParam, acolhidoInstance, t)

    } catch (error) {
      await t.rollback();
      console.log("\n", error, "\n")
      throw util.checkError(error, modelName)
    }
  }

  Acolhido.edita = async function (models, param) {
    let {
      acolhidoParam = {},
      enderecoParam = {},
      cidadeParam = {},
      bairroParam = {},
      pessoaParam = {},
      religiaoParam = {},
      familiaresParam = [],
      medicamentosParam = "",
      doencaFamiliaParam = []
    } = param
    
    let religiaoInstance = null
    let pessoaInstance = null
    let medicamentoContinuoInstance = null
    let familiaresInstance = null

    let queryOptions = {
      where: {
        id: acolhido.id
      }
    }
    
    let t = await sequelize.transaction({ autocommit: false })

    try {

      if(modelStatus.pesquisa(idStatus) == null)
        throw util.defineError(404, "Status não econtrado.")

      religiaoInstance = await models.Religiao.pesquisaOuAdiciona(religiaoParam, t)
      pessoaInstance = await models.Pessoa.edita(models, t, {
        pessoaParam,
        enderecoParam,
        cidadeParam,
        bairroParam
      })

      if (transaction)
        queryOptions.transaction = t
        
      if (!religiaoInstance ) {
          // transaction.rollback();
        return util.defineError(412, "Erro em religião")
      }
      
      if (!pessoaInstance ) {
        return util.defineError(412, "Erro em pessoa")
      }

      let data = {
        atividade_fisica: acolhidoParam.atividade_fisica,
        bebida_quantidade: acolhidoParam.bebida_quantidade,
        bebida_periodicidade: acolhidoParam.bebida_periodicidade,
        paroquia: acolhidoParam.paroquia,
        atividades_religiosas: acolhidoParam.atividades_religiosas,
        demanda: acolhidoParam.demanda,
        encaminhamento: acolhidoParam.encaminhamento,
        observacao: acolhidoParam.observacao,
        prioridade: acolhidoParam.prioridade,
        ReligiaoId: religiaoInstance[0].dataValues.id,
        StatusId: acolhidoParam.StatusId
      }
      
      if(pessoa.cpf && !data.StatusId)
        data.StatusId = 2
      
      let acolhidoInstance = await Acolhido.update({ data }, queryOptions)
      
      familiares.forEach(async familiar => {
        await models.Familiar.edita(familiar)
      });
      
      // await models.DoencaFamilia.adicionaVarios(doencaFamilia, AcolhidoId)
      await transaction.commit()
      return acolhidoInstance
    } catch (error) {
      await transaction.rollback();
      console.log("\n", error, "\n")
      throw util.checkError(error, modelName)
    }

  }

  Acolhido.pesquisa = async function (models, id) {
    let {
      Religiao,
      Pessoa,
      Endereco,
      Cidade,
      Bairro,
      Familiar,
      DoencaFamilia,
      MedicamentoContinuo
    } = models

    try {
      let acolhidoInstance = await Acolhido.findByPk(id, {
        include: [{
          model: Religiao,
          attributes: ['nome'],
          as: 'Religiao'
        },
        {
          model: Pessoa,
          as: 'Pessoa',
          include: [{
            model: Endereco,
            as: 'Endereco',
            include: [{
              model: Cidade,
              attributes: ['nome'],
              as: 'Cidade'
            }, {
              model: Bairro,
              attributes: ['nome'],
              as: 'Bairro'
            }]
          }]
        }, {
          model: Familiar,
          as: 'familiares'
        }, {
          model: DoencaFamilia,
          as: 'doencasFamilia'
        }, {
          model: MedicamentoContinuo,
          as: 'medicamentosContinuos'
        }
        ]
      })
      
      return preparaObj(acolhidoInstance.dataValues)
    } catch (error) {
      console.log("\n catch \n")
      throw util.checkError(error, modelName)
    }
  }

  Acolhido.lista = async function (models) {
    let {
      Religiao,
      Pessoa,
      Endereco,
      Cidade,
      Bairro,
      Familiar,
      DoencaFamilia,
      MedicamentoContinuo
    } = models

    try {
      let acolhidoInstance = await Acolhido.findAll({
        raw:true,
        nest:true,
        include: [{
          model: Religiao,
          attributes: ['nome'],
          as: 'Religiao'
        },
        {
          model: Pessoa,
          as: 'Pessoa',
          include: [{
            model: Endereco,
            as: 'Endereco',
            include: [{
              model: Cidade,
              attributes: ['nome'],
              as: 'Cidade'
            }, {
              model: Bairro,
              attributes: ['nome'],
              as: 'Bairro'
            }]
          }]
        }, {
          model: Familiar,
          as: 'familiares'
        }, {
          model: DoencaFamilia,
          as: 'doencasFamilia'
        }, {
          model: MedicamentoContinuo,
          as: 'medicamentosContinuos'
        }
        ]
      })

      let i = 0
      acolhidoInstance.map((e)=>{
        e = preparaObj(e, i)
        i++
      })
      return acolhidoInstance
  
    } catch (error) {
      console.log("\n catch \n")
      throw util.checkError(error, modelName)
    }
  }

  Acolhido.deleta = async function (idParam, transaction) {
    let queryOptions = {
      where: {
        id: idParam
      }
    }

    if (transaction)
      queryOptions.transaction = transaction

    try {
      let acolhido = await Acolhido.destroy(queryOptions)
      return acolhido
    } catch (error) {
      console.log("\n catch \n")
      throw util.checkError(error, modelName)
    }
  }

  Acolhido.listaFilaPorStatus = async function (idStatus, modelStatus) {

    let queryOptions = {
      where: {
        StatusId: idStatus
      }
    }

    try {

      if(modelStatus.pesquisa(idStatus) == null)
        throw util.defineError(404, "Status não econtrado.")

      let acolhidoInstance = await Acolhido.findAll({
        include: [{
          model: models.Pessoa,
          as: 'Pessoa'
        }]
      }, queryOptions)
      return acolhidoInstance
    } catch (error) {
      console.log("\n catch \n")
      throw util.checkError(error, modelName)
    }
  }

  Acolhido.atualizaPessoa = async function (models, param, acolhidoInstance, t) {
    let queryOptions = {
      transaction: t
    }

    let pessoaInstance = null

    //param já com id
    if (Object.keys(pessoaParam).find(key => key == "id") != false)
      pessoaInstance = await Pessoa.edita(models, param, t)
    else
      pessoaInstance = await Pessoa.adiciona(models, param, t)

    acolhidoInstance.setPessoa(pessoaInstance, queryOptions)
  }

  Acolhido.atualizaReligiao = async function (Religiao, religiaoParam, acolhidoInstance, t) {
    let queryOptions = {
      transaction: t
    }
    let religiaoInstance = Religiao.pesquisaOuAdiciona(religiaoParam, t)

    acolhidoInstance.setReligiao(religiaoInstance, queryOptions)
  }

  Acolhido.atualizaFamiliares = async function (Familiar, familiaresParam, acolhidoInstance, t){
    if (familiaresParam.length > 0) {
      familiaresInstance = await Familiar.adicionaVarios(familiaresParam, t)
      await acolhidoInstance.setFamiliares(familiaresInstance, { transaction: t })
    }
  }

  function valida(acolhidoParam) {
    let {
      preferenciaAtendimento
    } = acolhidoParam
    if (preferenciaAtendimento != null)
      return true

    throw util.defineError(412, "Erro em Acolhido")
  }

  function preparaObj(acolhidoRaw, i) {   
    acolhidoRaw.acolhido = {
      id: acolhidoRaw.id,
      atividade_fisica: acolhidoRaw.atividade_fisica,
      atividades_religiosas: acolhidoRaw.atividades_religiosas,
      bebida_quantidade: acolhidoRaw.bebida_quantidade,
      bebida_periodicidade: acolhidoRaw.bebida_periodicidade,
      demanda: acolhidoRaw.demanda,
      encaminhamento: acolhidoRaw.encaminhamento,
      numero_cigarros_por_dia: acolhidoRaw.numero_cigarros_por_dia,
      observacao: acolhidoRaw.observacao,
      paroquia: acolhidoRaw.paroquia,
      preferenciaAtendimento: acolhidoRaw.preferenciaAtendimento,
      prioridade: acolhidoRaw.prioridade,
      PessoaId: acolhidoRaw.PessoaId,
      ReligiaoId: acolhidoRaw.ReligiaoId,
      StatusId: acolhidoRaw.StatusId,
      updatedAt: acolhidoRaw.updatedAt,
      createdAt: acolhidoRaw.createdAt,
      Religiao: acolhidoRaw.Religiao,
      familiares: acolhidoRaw.familiares,
      doencasFamilia: acolhidoRaw.doencasFamilia,
      medicamentosContinuos: acolhidoRaw.medicamentosContinuos
    }
    
    delete acolhidoRaw.id
    delete acolhidoRaw.atividade_fisica
    delete acolhidoRaw.atividades_religiosas
    delete acolhidoRaw.bebida_quantidade
    delete acolhidoRaw.bebida_periodicidade
    delete acolhidoRaw.demanda
    delete acolhidoRaw.encaminhamento
    delete acolhidoRaw.numero_cigarros_por_dia
    delete acolhidoRaw.observacao
    delete acolhidoRaw.paroquia
    delete acolhidoRaw.preferenciaAtendimento
    delete acolhidoRaw.prioridade
    delete acolhidoRaw.PessoaId
    delete acolhidoRaw.ReligiaoId
    delete acolhidoRaw.StatusId
    delete acolhidoRaw.updatedAt
    delete acolhidoRaw.createdAt
    delete acolhidoRaw.Religiao
    delete acolhidoRaw.familiares
    delete acolhidoRaw.doencasFamilia
    delete acolhidoRaw.medicamentosContinuos
    
    if(i == 1)
      console.log(acolhidoRaw)
    
      return acolhidoRaw
  }

  return Acolhido;
};
