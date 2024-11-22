import { Button, Card, Form, Input, Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { ModalidadeService } from "../services/modalidade/ModalidadeService";
import { PlanoService } from "../services/plano/PlanoService";

const { Option } = Select;

const Planos = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [plans, setPlans] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const mockDurations = [
    { id: 1, label: "1 mês" },
    { id: 2, label: "3 meses" },
    { id: 3, label: "6 meses" },
    { id: 4, label: "12 meses" },
  ];

  const getData = async () => {
    setLoading(true);
    const { data } = await PlanoService.getData({});
    setPlans(data);
    setLoading(false);
  };

  const getDataModalidades = async () => {
    setLoading(true);
    const { data } = await ModalidadeService.getData({ perPage: 1000 });
    setModalidades(data);
    setLoading(false);
  };

  const handleAddPlan = async () => {
    setLoading(true);
    await getDataModalidades();
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        // Editar registro existente
      } else {
        // Adicionar novo registro
      }
      getData();
      setIsModalVisible(false);
    } catch (info) {
      console.log("Validate Failed:", info);
    }
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
        modalidades.map((modalidade) => (
          <Card
            key={modalidade.id}
            style={{
              display: "inline-block",
              marginRight: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "4px 8px",
            }}
          >
            {modalidade.nome}
          </Card>
        )),
    },
    {
      title: "Duração",
      dataIndex: "duracao",
      key: "duracao",
      render: (duracao) =>
        mockDurations.find((duration) => duration.id === duracao)?.label || "",
    },
    {
      title: "Preço padrão",
      dataIndex: "precoPadrao",
      key: "precoPadrao",
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

  useEffect(() => {
    getData();
  }, []);

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
          Novo plano
        </Button>

        <Table columns={columns} dataSource={plans} loading={loading} />

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
                {modalidades.map((mod) => (
                  <Option key={mod.id} value={mod.id}>
                    {mod.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Duração do Plano"
              name="duracao"
              rules={[
                { required: true, message: "Por favor, selecione a duração" },
              ]}
            >
              <Select placeholder="Selecione a duração">
                {mockDurations.map((duration) => (
                  <Option key={duration.id} value={duration.id}>
                    {duration.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Preço padrão"
              name="precoPadrao"
              rules={[
                { required: true, message: "Por favor, insira o preço padrão" },
              ]}
            >
              <Input prefix="R$" placeholder="Preço padrão do plano" />
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
          <p>
            Tem certeza de que deseja excluir o plano "{deleteRecord?.nome}"?
          </p>
        </Modal>
      </div>
    </>
  );
};

export default Planos;
