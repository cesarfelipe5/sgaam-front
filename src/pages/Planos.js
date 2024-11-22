import React, { useState } from "react";
import { Button, Card, Form, Input, Modal, Select, Table } from "antd";
import DrawerMenu from "../components/DrawerMenu";

const { Option } = Select;

const Planos = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [plans, setPlans] = useState([
    {
      key: "1",
      nome: "Plano Básico",
      modalidades: ["Karatê", "Judô"],
      valor: "R$ 100,00",
    },
    {
      key: "2",
      nome: "Plano Avançado",
      modalidades: ["Jiu-Jitsu", "Boxe"],
      valor: "R$ 200,00",
    },
  ]);
  const [deleteRecord, setDeleteRecord] = useState(null); // Estado para o modal de confirmação de exclusão

  const [form] = Form.useForm();

  const handleAddPlan = () => {
    setIsModalVisible(true);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleEditPlan = (record) => {
    setIsModalVisible(true);
    setEditingRecord(record);
    form.setFieldsValue(record);
  };

  const handleDeletePlan = (key) => {
    setPlans(plans.filter((item) => item.key !== key));
    setDeleteRecord(null);
  };

  const confirmDelete = (record) => {
    setDeleteRecord(record);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = [...plans];
      if (editingRecord) {
        // Editando um plano existente
        const index = newData.findIndex(
          (item) => item.key === editingRecord.key
        );
        newData[index] = { ...editingRecord, ...values };
      } else {
        // Adicionando um novo plano
        newData.push({
          key: `${newData.length + 1}`,
          ...values,
        });
      }
      setPlans(newData);
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: "Nome do Plano",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Modalidades",
      dataIndex: "modalidades",
      key: "modalidades",
      render: (modalidades) =>
        modalidades.map((mod) => (
          <Card
            key={mod}
            style={{
              display: "inline-block",
              marginRight: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "4px 8px",
            }}
          >
            {mod}
          </Card>
        )),
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => handleEditPlan(record)}
            style={{ marginRight: 8 }}
          >
            Editar
          </Button>
          <Button type="link" danger onClick={() => confirmDelete(record)}>
            Excluir
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <DrawerMenu />
      <div style={{ padding: 20 }}>
        <Button
          type="primary"
          icon="+"
          style={{
            marginBottom: 20,
            backgroundColor: "black",
            color: "white",
            border: "none",
          }}
          onClick={handleAddPlan}
        >
          Novo Plano
        </Button>
        <Table columns={columns} dataSource={plans} />

        <Modal
          title={editingRecord ? "Editar Plano" : "Novo Plano"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleSave}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nome do Plano"
              name="nome"
              rules={[{ required: true, message: "Por favor, insira o nome" }]}
            >
              <Input placeholder="Nome do plano" />
            </Form.Item>
            <Form.Item
              label="Modalidades"
              name="modalidades"
              rules={[
                { required: true, message: "Por favor, selecione as modalidades" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Selecione as modalidades"
                style={{ width: "100%" }}
              >
                <Option value="Karatê">Karatê</Option>
                <Option value="Judô">Judô</Option>
                <Option value="Jiu-Jitsu">Jiu-Jitsu</Option>
                <Option value="Boxe">Boxe</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Valor"
              name="valor"
              rules={[{ required: true, message: "Por favor, insira o valor" }]}
            >
              <Input prefix="R$" placeholder="Valor do plano" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Confirmar Exclusão"
          open={!!deleteRecord}
          onCancel={() => setDeleteRecord(null)}
          onOk={() => handleDeletePlan(deleteRecord?.key)}
          okText="Excluir"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
        >
          <p>Tem certeza de que deseja excluir o plano "{deleteRecord?.nome}"?</p>
        </Modal>
      </div>
    </>
  );
};

export default Planos;
