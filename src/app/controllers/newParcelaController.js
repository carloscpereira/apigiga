import queryStringConverter from 'sequelize-querystring-converter';
import Parcela from '../models/Sequelize/Parcela';
import LotePagamento from '../models/Sequelize/LotePagamento';
import ParcelaAcrescimoDesconto from '../models/Sequelize/ParcelaAcrescimoDesconto';
import FormaPagamento from '../models/Sequelize/FormaPagamento';
import Titulo from '../models/Sequelize/Titulo';
import Contrato from '../models/Sequelize/Contrato';

class NewParcela {
  async index(req, res) {
    const { with: withColumn, filter = {}, limit = 20 } = req.query;

    const columns = withColumn ? withColumn.split(',') : [];
    const {
      parcela = {},
      lote = {},
      // ocorrencia = {},
      contrato = {},
      pagamento = {},
      desconto = {},
    } = filter;

    const filterParcela = queryStringConverter.convert({ query: parcela });
    const filterPagamento = queryStringConverter.convert({ query: pagamento });
    const filterLote = queryStringConverter.convert({ query: lote });
    const filterDesconto = queryStringConverter.convert({ query: desconto });
    const filterContrato = queryStringConverter.convert({ query: contrato });
    // const filterOcorrencia = queryStringConverter.convert({
    //   query: ocorrencia,
    // });

    console.log(filterParcela);

    const parcelas = await Parcela.findAndCountAll({
      ...filterParcela,
      limit,
      include: [
        ...(columns.includes('lotes')
          ? [{ model: LotePagamento, as: 'lotes', ...filterLote }]
          : []),
        ...(columns.includes('descontos')
          ? [
              {
                model: ParcelaAcrescimoDesconto,
                as: 'descontos',
                ...filterDesconto,
              },
            ]
          : []),
        ...(columns.includes('pagamentos')
          ? [
              {
                model: FormaPagamento,
                as: 'pagamentos',
                ...filterPagamento,
              },
            ]
          : []),
        ...(columns.includes('titulos')
          ? [
              {
                model: Titulo,
                as: 'titulo',
                include: [
                  {
                    model: Contrato,
                    as: 'contrato',
                    ...filterContrato,
                    required: true,
                  },
                ],
                required: true,
              },
            ]
          : []),
      ],
    });

    console.log(filterParcela);

    return res.json(parcelas);
  }
}

export default new NewParcela();
