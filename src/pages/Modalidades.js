import { Button, Checkbox, Form, Input, Modal, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DrawerMenu from "../components/DrawerMenu";
import { ModalidadeService } from "../services/modalidade/ModalidadeService";

const EditableTable = () => {
  const [modalidades, setModalidades] = useState([]);
  const [editing, setEditing] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const isEditing = (record) => record.id === editing?.id;

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);

    form.resetFields();
  };

  const handleAddUpdate = async (values) => {
    setLoading(true);

    if (editing?.id) {
      const success = await ModalidadeService.updateModalidade({
        modalidade: {
          ...values,
          isActive: values.isActive ? "Ativo" : "Inativo",
        },
        id: editing.id,
      });

      if (!success) {
        toast.error(
          "Houve um problema na atualização da modalidade. Tente novamente mais tarde."
        );
        setLoading(false);
        return;
      }

      toast.success("Modalidade atualizada com sucesso.");
    } else {
      const success = await ModalidadeService.createModalidade({
        modalidade: {
          ...values,
          isActive: values.isActive ? "Ativo" : "Inativo",
        },
      });

      if (!success) {
        toast.error(
          "Houve um problema na criação da modalidade. Tente novamente mais tarde."
        );

        setLoading(false);

        return;
      }

      toast.success("Modalidade criada com sucesso.");
    }

    getData();

    setIsModalVisible(false);

    form.resetFields();

    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    const success = await ModalidadeService.removeById({ id: deleteRecord.id });

    if (!success) {
      toast.error(
        "Houve um problema na remoção da modalidade. Tente novamente mais tarde."
      );

      setLoading(false);

      return;
    }

    toast.success("Modalidade removida com sucesso.");
    setDeleteRecord(null);
    getData();

    setLoading(false);
  };

  const edit = (record) => () => {
    form.setFieldsValue({
      nome: "",
      descricao: "",
      ...record,
      isActive: record.isActive === "Ativo",
    });

    setEditing(record);

    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive === "Ativo" ? "green" : "red"}>
          {isActive === "Ativo" ? "Ativo" : "Inativo"}
        </Tag>
      ),
    },
    {
      title: "Ações",
      key: "acoes",
      render: (text, record) => (
        <>
          <Button onClick={edit(record)} style={{ marginRight: 8 }}>
            Editar
          </Button>

          <Button type="danger" onClick={() => setDeleteRecord(record)}>
            Remover
          </Button>
        </>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const getData = async () => {
    setLoading(true);

    const { data } = await ModalidadeService.getData({showAll: true});

    const newData = data.map((item) => ({
      ...item,
      isActive: item.isActive ? "Ativo" : "Inativo",
    }));

    setModalidades(newData);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <DrawerMenu />
      <div style={{ padding: "20px" }}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            backgroundColor: "#FFD700",
            borderColor: "#FFD700",
            color: "#000",
          }}
        >
          Adicionar modalidade
        </Button>

        <Form form={form} component={false}>
          <Table
            loading={loading}
            columns={mergedColumns}
            dataSource={modalidades}
            style={{ marginTop: "20px" }}
            pagination={false}
          />
        </Form>

        <Modal
          title=" Adicionar modalidade"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddUpdate}>
            <Form.Item
              name="nome"
              label="Nome"
              rules={[{ required: true, message: "Por favor, insira o nome" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[
                { required: true, message: "Por favor, insira a descrição" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="isActive" label="Status" valuePropName="checked">
              <Checkbox>Ativo</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#FFD700",
                  borderColor: "#FFD700",
                  color: "#000",
                }}
              >
                {editing?.id ? "Atualizar" : "Adicionar"}
              </Button>
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
          title="Confirmar Exclusão?"
          open={!!deleteRecord}
          onCancel={() => setDeleteRecord(null)}
          onOk={() => handleRemove()}
          okText="Excluir"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
        >
          <p>
            Tem certeza de que deseja excluir a modalidade "{deleteRecord?.nome}"?
          </p>
        </Modal>
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
          <p>Bem-vindo à página de gestão de modalidades!</p>
          <ul>
            <li>
              Use o botão "Adicionar modalidade" para registrar novas
              modalidades.
            </li>
            <li>
              Clique em "Editar" para modificar as informações de uma
              modalidade.
            </li>
            <li>Clique em "Excluir" para remover uma modalidade.</li>
          </ul>
          <p>Para mais dúvidas, entre em contato com o suporte.</p>
        </Modal>
      </div>
    </>
  );
};

export default EditableTable;
