import { SearchOutlined } from "@ant-design/icons";
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
import { formatCurrency } from "../utils/mask";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const Pagamentos = () => {
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [paymentData, setPaymenteData] = useState([]);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

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
      nome: data.planoAlunos.idAluno,
      formaPagamento: data.formaPagamentos.id,
      observacao: data.observacao,
      dataPagamento: moment(data.dataPagamento),
      valor: formatCurrency(data.valor),
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
        const { success } = await pagamentoService.updatePagamento({
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
        const { success } = await pagamentoService.createPagamento({
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
      sorter: (a, b) =>
        a.planoAlunos.aluno.nome.localeCompare(b.planoAlunos.aluno.nome),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar por nome"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()} // Confirma ao pressionar Enter
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90, marginTop: 8 }}
          >
            Limpar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.planoAlunos.aluno.nome
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Data do Pagamento",
      dataIndex: "dataPagamento",
      key: "dataPagamento",
      render: (dataPagamento) =>
        moment(dataPagamento).format("DD/MM/YYYY"),
      sorter: (a, b) => a.dataPagamento.localeCompare(b.dataPagamento),
    },
    {
      title: "Valor Pago",
      dataIndex: "valor",
      key: "valor",
      render: (valor) => (
        <div style={{ justifyContent: "flex-end", display: "flex" }}>
          {formatCurrency(valor)}
        </div>
      ),
    },
    {
      title: "Valor do Plano",
      dataIndex: ["planoAlunos", "planos", "precoPadrao"],
      key: "precoPadrao",
      render: (_, record) => (
        <div style={{ justifyContent: "flex-end", display: "flex" }}>
          {formatCurrency(record.planoAlunos.plano.precoPadrao)}
        </div>
      ),
    },
    {
      title: "Recebedor",
      // dataIndex: "recebedor",
      key: "recebedor",
      dataIndex: ["usuarios", "nome"],
    },
    {
      title: "Observação",
      dataIndex: "observacao",
      key: "observacao",
      render: (observacao) => observacao ?? "---",
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
              label="Valor pago"
              name="valor"
              rules={[
                { required: true, message: "Por favor, insira o valor pago" },
              ]}
            >
              <Input
                onChange={(e) => {
                  const maskedValue = formatCurrency(e.target.value);
                  form.setFieldsValue({ valor: maskedValue });
                }}
              />
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
        <Button
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
          onClick={() => setHelpModalVisible(true)}
        >
          ?
        </Button>
        <Modal
          title="Ajuda"
          open={helpModalVisible}
          onCancel={() => setHelpModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setHelpModalVisible(false)}>
              Fechar
            </Button>,
          ]}
        >
          <p>Bem-vindo à página de gestão de pagamentos!</p>
          <ul>
            <li>
              Use o botão "Novo pagamento" para registrar novos pagamentos.
            </li>
            <li>Utilize a busca para encontrar alunos pelo nome.</li>
            <li>
              Você pode ordenar a tabela por nome do aluno e data de pagamento,
              basta clicar no topo da coluna correspondente.
            </li>
            <li>
              Clique em "Editar" para modificar as informações de um pagamento.
            </li>
            <li>Clique em "Excluir" para remover um pagamento.</li>
          </ul>
          <p>Para mais dúvidas, entre em contato com o suporte.</p>
        </Modal>
      </div>
    </>
  );
};

export default Pagamentos;
