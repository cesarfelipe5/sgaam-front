import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { AlunosService } from "../services/alunos/AlunosService";
import { formaPagamentoService } from "../services/formaPagamento/FormaPagamentoService";

const { Option } = Select;
const { Search } = Input;

const Pagamentos = () => {
  const [alunos, setAlunos] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState(""); // Estado para o campo de busca
  const [data, setData] = useState([
    {
      key: "1",
      nome: "João Silva",
      dataPagamento: "06/09/2024",
      valorPago: "150,00",
      valorPlano: "200,00", // Valor do plano adicionado
      recebedor: "Ana Souza",
    },
    {
      key: "2",
      nome: "Maria Souza",
      dataPagamento: "05/09/2024",
      valorPago: "200,00",
      valorPlano: "300,00", // Valor do plano adicionado
      recebedor: "Carlos Pereira",
    },
  ]);

  const [form] = Form.useForm();

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

    form.setFieldsValue({ dataPagamento: moment() }); // Padrão para data atual
  };

  const handleEditPayment = (record) => {
    setIsModalVisible(true);

    setEditingRecord(record);

    form.setFieldsValue({
      ...record,
      dataPagamento: moment(record.dataPagamento, "DD/MM/YYYY"),
    });
  };

  const handleDeletePayment = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const newData = [...data];

      if (editingRecord) {
        // Editando um pagamento existente
        const index = newData.findIndex(
          (item) => item.key === editingRecord.key
        );

        newData[index] = {
          ...editingRecord,

          ...values,

          dataPagamento: values.dataPagamento.format("DD/MM/YYYY"),
        };
      } else {
        newData.push({
          key: `${newData.length + 1}`,
          ...values,

          dataPagamento: values.dataPagamento.format("DD/MM/YYYY"),
        });
      }

      setData(newData);

      setIsModalVisible(false);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // Filtragem dos dados com base na pesquisa
  const filteredData = data.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Nome do Aluno",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Data do Pagamento",
      dataIndex: "dataPagamento",
      key: "dataPagamento",
    },
    {
      title: "Valor Pago",
      dataIndex: "valorPago",
      key: "valorPago",
    },
    {
      title: "Valor do Plano",
      dataIndex: "valorPlano",
      key: "valorPlano",
    },
    {
      title: "Recebedor",
      dataIndex: "recebedor",
      key: "recebedor",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (text, record) => (
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
            onClick={() => handleDeletePayment(record.key)}
          >
            Excluir
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <DrawerMenu />
      <div style={{ padding: "20px" }}>
        <Button
          type="primary"
          style={{ backgroundColor: "black", marginBottom: "10px" }}
          onClick={handleAddPayment}
        >
          Novo Pagamento
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

        <Table columns={columns} dataSource={filteredData} />

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
              name="valorPago"
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
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Pagamentos;
