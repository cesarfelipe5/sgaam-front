import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { AlunosService } from "../services/alunos/AlunosService";
import { formaPagamentoService } from "../services/formaPagamento/FormaPagamentoService";
import { pagamentoService } from "../services/pagamento/PagamentoService";

const { Option } = Select;
const { Search } = Input;

const Pagamentos = () => {
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState(""); // Estado para o campo de busca
  const [paymentData, setPaymenteData] = useState([]);

  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);

    const { data } = await pagamentoService.getData({ perPage: 1000 });

    setPaymenteData(data);

    setLoading(false);
  };

  const handleAddPayment = async () => {
    const { data } = await AlunosService.getData({ perPage: 10000 });

    const { data: dataFormaPagamento } = await formaPagamentoService.getData({
      perPage: 10000,
    });

    setAlunos(data);

    setFormaPagamento(dataFormaPagamento);

    setIsModalVisible(true);

    setEditingRecord(null);

    form.resetFields();

    form.setFieldsValue({ dataPagamento: moment() });
  };

  const handleEditPayment = async (record) => {
    setLoading(true);

    const { data: dataAlunos } = await AlunosService.getData({
      perPage: 10000,
    });

    const { data: dataFormaPagamento } = await formaPagamentoService.getData({
      perPage: 10000,
    });

    setAlunos(dataAlunos);

    setFormaPagamento(dataFormaPagamento);

    const { data } = await pagamentoService.getById({ id: record.id });

    setEditingRecord(data);

    form.setFieldsValue({
      nome: data.planoAlunos.idAluno, // ID do aluno
      formaPagamento: data.formaPagamentos.id, // Aqui deve ser o ID da forma de pagamento
      observacao: data.observacao, // Se houver observação
      dataPagamento: moment(data.dataPagamento),
    });

    setIsModalVisible(true);

    setLoading(false);
  };

  const handleDeletePayment = async (record) => {
    const success = await pagamentoService.removeById({
      id: record.id,
    });

    if (!success) {
      notification.error({
        message: "Erro na remoção do pagamento",
        description:
          "Houve um problema na remoção do pagamento. Tente novamente mais tarde.",
      });

      setLoading(false);

      return;
    }

    await getData();

    notification.success({
      message: "Pagamento removido",
      description: "Pagamento removido com sucesso.",
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        const success = await pagamentoService.updatePagamento({
          pagamento: {
            ...values,
            idPlanoAluno: alunos.find((aluno) => aluno.id === values.nome)
              .planos[0].PlanoAluno.id,
          },
          id: editingRecord.id,
        });

        if (!success) {
          notification.error({
            message: "Erro na atualização do pagamento",
            description:
              "Houve um problema na atualização do pagamento. Tente novamente mais tarde.",
          });

          setLoading(false);

          return;
        }

        notification.success({
          message: "Pagamento atualizado",
          description: "Pagamento atualizado com sucesso.",
        });
      } else {
        const success = await pagamentoService.createPagamento({
          pagamento: {
            ...values,
            idPlanoAluno: alunos.find((aluno) => aluno.id === values.nome)
              .planos[0].PlanoAluno.id,
          },
        });

        if (!success) {
          notification.error({
            message: "Erro na criação do pagamento",
            description:
              "Houve um problema na criação do pagamento. Tente novamente mais tarde.",
          });

          setLoading(false);

          return;
        }

        notification.success({
          message: "Pagamento criado!",
          description: "Pagamento criado com sucesso.",
        });
      }

      await getData();

      setIsModalVisible(false);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Nome do Aluno",
      dataIndex: ["planoAlunos", "aluno", "nome"],
      key: "nome",
    },
    {
      title: "Data do Pagamento",
      dataIndex: "dataPagamento",
      key: "dataPagamento",
    },
    {
      title: "Valor Pago",
      dataIndex: "valor",
      key: "valor",
    },
    {
      title: "Valor do Plano",
      dataIndex: ["planoAlunos", "plano", "precoPadrao"],
      key: "valorPlano",
    },
    {
      title: "Recebedor",
      // dataIndex: "recebedor",
      key: "recebedor",
      dataIndex: ["usuarios", "nome"],
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <>
          <Button
            style={{ marginRight: 10 }}
            type="link"
            onClick={() => handleEditPayment(record)}
          >
            Editar
          </Button>

          <Button
            type="link"
            danger
            onClick={() => handleDeletePayment(record)}
          >
            Excluir
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <DrawerMenu />

      <div style={{ padding: "20px" }}>
        <Button
          type="primary"
          style={{ backgroundColor: "black", marginBottom: "10px" }}
          onClick={handleAddPayment}
        >
          Novo pagamento
        </Button>

        {/* Campo de pesquisa */}
        <Search
          placeholder="Buscar por nome do aluno"
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: 300,
            marginBottom: "1px",
            marginTop: "10px",
            display: "block",
          }}
        />

        <Table columns={columns} dataSource={paymentData} loading={loading} />

        <Modal
          title={editingRecord ? "Editar Pagamento" : "Novo Pagamento"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleSave}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nome do Aluno"
              name="nome"
              rules={[
                { required: true, message: "Por favor, selecione o aluno" },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecione um aluno"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {alunos.map((aluno) => (
                  <Option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Forma de pagamento"
              name="formaPagamento"
              rules={[
                {
                  required: true,
                  message: "Por favor, selecione a forma de pagamento.",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecione a forma de pagamento"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {formaPagamento.map((forma) => (
                  <Option key={forma.id} value={forma.id}>
                    {forma.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Valor Pago"
              name="valor"
              rules={[
                { required: true, message: "Por favor, insira o valor pago" },
              ]}
            >
              <Input prefix="R$" placeholder="Valor em BRL" />
            </Form.Item>

            <Form.Item
              label="Data do Pagamento"
              name="dataPagamento"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira a data do pagamento",
                },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item label="Alguma observação?" name="observacao">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Pagamentos;
