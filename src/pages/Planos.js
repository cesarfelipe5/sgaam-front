import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import DrawerMenu from "../components/DrawerMenu";

const { Option } = Select;
const { Search } = Input;

const Planos = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState(""); // Estado para o campo de busca
  const [plans, setPlans] = useState([]);

  const [form] = Form.useForm();

  const handleAddPlan = () => {
    setIsModalVisible(true);

    setEditingRecord(null);

    form.resetFields();
  };

  const handleEditPlan = (record) => {
    setIsModalVisible(true);

    setEditingRecord(record);

    form.setFieldsValue({
      ...record,
      dataPagamento: moment(record.dataPagamento, "DD/MM/YYYY"),
    });
  };

  const handleDeletePlan = (key) => {
    setPlans(plans.filter((item) => item.key !== key));
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = [...plans];
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
        // Adicionando um novo pagamento
        newData.push({
          key: `${newData.length + 1}`,
          ...values,
          dataPagamento: values.dataPagamento.format("DD/MM/YYYY"),
        });
      }
      setPlans(newData);
      setIsModalVisible(false);
    });
  };

  // Filtragem dos dados com base na pesquisa
  const filteredData = plans.filter((aluno) =>
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
            onClick={() => handleEditPlan(record)}
          >
            Editar
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeletePlan(record.key)}
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
          onClick={handleAddPlan}
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
          title={editingRecord ? "Editar plano" : "Novo plano"}
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
                <Option value="João Silva">João Silva</Option>
                <Option value="Maria Souza">Maria Souza</Option>
                <Option value="Carlos Pereira">Carlos Pereira</Option>
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

export default Planos;
