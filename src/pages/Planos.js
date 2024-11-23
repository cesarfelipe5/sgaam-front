import { Button, Card, Form, Input, Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DrawerMenu from "../components/DrawerMenu";
import { ModalidadeService } from "../services/modalidade/ModalidadeService";
import { PlanoService } from "../services/plano/PlanoService";

const { Option } = Select;

const Planos = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [plans, setPlans] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [deleteRecord, setDeleteRecord] = useState(null); // Estado para o modal de confirmação de exclusão
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

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

  // const handleEditPlan = (record) => {
  //   setEditingRecord({
  //     ...record,
  //     modalidades: record.modalidades.map((modalidade) => modalidade.id),
  //   });

  //   form.setFieldsValue(record);

  //   setIsModalVisible(true);
  // };

  const handleEditPlan = async (record) => {
    // Garante que as modalidades estão carregadas
    if (modalidades.length === 0) {
      await getDataModalidades(); // Carrega as modalidades, se necessário
    }

    // // Ajusta o formato das modalidades para selecionar apenas os IDs
    // setEditingRecord({
    //   ...record,
    //   modalidades: record.modalidades.map((modalidade) => modalidade.id),
    // });

    // Configura os valores iniciais do formulário
    form.setFieldsValue({
      ...record,
      modalidades: record.modalidades.map((modalidade) => modalidade.id),
    });

    setIsModalVisible(true);
  };

  const handleDeletePlan = async (id) => {
    setLoading(true);

    const { success } = await PlanoService.removeById({
      id,
    });

    if (!success) {
      toast.error(
        "Houve um problema na remoção do plano. Tente novamente mais tarde."
      );

      setLoading(false);

      return;
    }

    toast.success("Plano removido com sucesso.");

    setLoading(false);

    getData();

    setDeleteRecord(null);
  };

  const confirmDelete = (record) => {
    setDeleteRecord(record);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        setLoading(true);

        const { success } = await PlanoService.updatePlano({
          plano: values,
          id: editingRecord.id,
        });

        if (!success) {
          toast.error(
            "Houve um problema na atualização do plano. Tente novamente mais tarde."
          );

          setLoading(false);

          return;
        }

        toast.success("Plano atualizado com sucesso.");

        setLoading(false);
      } else {
        setLoading(true);

        const { success } = await PlanoService.createPlano({ plano: values });

        if (!success) {
          toast.error(
            "Houve um problema na criação do plano. Tente novamente mais tarde."
          );

          setLoading(false);

          return;
        }

        toast.success("Plano criado com sucesso.");

        setLoading(false);
      }

      getData();

      setIsModalVisible(false);
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  const handleOnCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Nome do plano",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
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
          onCancel={handleOnCancel}
          onOk={handleSave}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nome do plano"
              name="nome"
              rules={[{ required: true, message: "Por favor, insira o nome" }]}
            >
              <Input placeholder="Nome do plano" />
            </Form.Item>

            <Form.Item
              label="Descrição"
              name="descricao"
              rules={[
                { required: true, message: "Por favor, insira uma descrição" },
              ]}
            >
              <Input placeholder="Descrição" />
            </Form.Item>

            <Form.Item
              label="Modalidades"
              name="modalidades"
              rules={[
                {
                  required: true,
                  message: "Por favor, selecione as modalidades",
                },
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
              label="Preço padrão"
              name="precoPadrao"
              rules={[
                { required: true, message: "Por favor, insira o preço padrao" },
              ]}
            >
              <Input prefix="R$" placeholder="Preço padrao do plano" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Confirmar Exclusão"
          open={!!deleteRecord}
          onCancel={() => setDeleteRecord(null)}
          onOk={() => handleDeletePlan(deleteRecord?.id)}
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
