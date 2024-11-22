import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DrawerMenu from "../components/DrawerMenu";
import { formaPagamentoService } from "../services/formaPagamento/FormaPagamentoService";

const FormaPagamento = () => {
  const [dataFormaPagamento, setDataFormaPagamento] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingRecord(null);

    form.resetFields();

    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);

    form.setFieldsValue({
      ...record,
    });

    setModalVisible(true);
  };

  const handleDelete = (id) => async () => {
    const success = await formaPagamentoService.removeById({
      id,
    });

    if (!success) {
      toast.error(
        "Houve um problema na atualição da forma de pagamento. Tente novamente mais tarde."
      );

      setLoading(false);

      return;
    }

    toast.success("Forma de pagamento removida com sucesso.");

    getData();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        const success = await formaPagamentoService.updateFormaPagamento({
          formaPagamento: values,
          id: editingRecord.id,
        });

        if (!success) {
          toast.error(
            "Houve um problema na atualição da forma de pagamento. Tente novamente mais tarde."
          );

          setLoading(false);

          return;
        }

        toast.success("Forma de pagamento atualizada com sucesso.");
      } else {
        const success = await formaPagamentoService.createFormaPagamento({
          formaPagamento: values,
        });

        if (!success) {
          toast.error(
            "Houve um problema na criação na forma de pagamento. Tente novamente mais tarde."
          );

          setLoading(false);

          return;
        }

        toast.success("Forma de pagamento criada com sucesso.");
      }

      getData();

      setModalVisible(false);

      form.resetFields();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Editar</Button>
          <Button danger onClick={handleDelete(record.id)}>
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  const getData = async () => {
    setLoading(true);

    const { data } = await formaPagamentoService.getData({ perPage: 1000 });

    setDataFormaPagamento(data);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <DrawerMenu />

      <div style={{ padding: "16px" }}>
        <Space style={{ marginBottom: "16px" }}>
          <Button
            style={{ background: "black", color: "white" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Adicionar forma de pagamento
          </Button>
        </Space>

        <Table
          loading={loading}
          columns={columns}
          dataSource={dataFormaPagamento}
          pagination={false}
        />
        <Modal
          title={
            editingRecord
              ? "Editar forma de pagamento"
              : "Adicionar forma de pagamento"
          }
          open={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical" name="paymentForm">
            <Form.Item
              name="nome"
              label="Nome da forma de pagamento"
              rules={[
                {
                  required: true,
                  message: "Nome da forma de pagamento é obrigatório",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default FormaPagamento;
