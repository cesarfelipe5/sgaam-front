import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import DrawerMenu from "../components/DrawerMenu";
import { ModalidadeService } from "../services/modalidade/ModalidadeService";
import { PlanoService } from "../services/plano/PlanoService";
import { formatCurrency } from "../utils/mask";

const { Option } = Select;

const Planos = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [plans, setPlans] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);


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

  const handleEditPlan = async (record) => {
    // Garante que as modalidades estão carregadas
    if (modalidades.length === 0) {
      await getDataModalidades(); // Carrega as modalidades, se necessário
    }

    // Configura os valores iniciais do formulário
    form.setFieldsValue({
      ...record,
      modalidades: record.modalidades.map((modalidade) => modalidade.id),
      precoPadrao: formatCurrency(record.precoPadrao)
    });

    setEditingRecord(record);

    setIsModalVisible(true);
  };

  const handleDeletePlan = async (id) => {
    setLoading(true);

    const { success } = await PlanoService.removeById({
      id,
    });

    if (!success) {
      notification.error({
        message: "Erro na remoção do plano",
        description:
          "Houve um problema na remoção do plano. Tente novamente mais tarde.",
      });

      setLoading(false);

      return;
    }

    notification.success({
      message: "Plano removido!",
      description: "Plano removido com sucesso.",
    });

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

      if (editingRecord?.id) {
        setLoading(true);

        const { success } = await PlanoService.updatePlano({
          plano: values,
          id: editingRecord.id,
        });

        if (!success) {
          notification.error({
            message: "Erro na atualização do plano.",
            description:
              "Houve um problema na atualização do plano. Tente novamente mais tarde.",
          });

          setLoading(false);

          return;
        }

        notification.success({
          message: "Plano atualizado",
          description: "Plano atualizado com sucesso.",
        });

        setLoading(false);
      } else {
        setLoading(true);

        const { success } = await PlanoService.createPlano({ plano: values });

        if (!success) {
          notification.error({
            message: "Erro na criação do plano.",
            description:
              "Houve um problema na criação do plano. Tente novamente mais tarde.",
          });

          setLoading(false);

          return;
        }

        notification.success({
          message: "Plano criado",
          description: "Plano criado com sucesso.",
        });

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
      render: (_, record) => <div style={{ justifyContent: 'flex-end', display: 'flex' }}>{formatCurrency(record.precoPadrao)}</div>,
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
              <Input
                onChange={(e) => {
                  const maskedValue = formatCurrency(e.target.value);
                  form.setFieldsValue({ precoPadrao: maskedValue });
                }}
                placeholder="Preço padrão do plano" />
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
            fontSize: "24px"
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
            </Button>
          ]}
        >
          <p>Bem-vindo à página de gestão de planos!</p>
          <ul>
            <li>Use o botão "Novo plano" para adicionar um novo plano à lista.</li>
            <li>Clique em "Editar" para atualizar as informações de um plano existente.</li>
            <li>Clique em "Excluir" para remover um plano permanentemente.</li>
            <li>Confira detalhes como duração, modalidades e preço padrão diretamente na tabela.</li>
          </ul>
          <p>Para mais dúvidas, entre em contato com o suporte.</p>
        </Modal>

      </div>
    </>
  );
};

export default Planos;
