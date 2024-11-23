import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import DrawerMenu from "../components/DrawerMenu";
import { AulaExperimentalService } from "../services/aulaExperimental/AulaExperimentalService";
import { ModalidadeService } from "../services/modalidade/ModalidadeService";

const AulasExperimentais = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const { Option } = Select;

  const getData = async () => {
    setLoading(true);

    const { data } = await AulaExperimentalService.getData({});

    setDataSource(data);

    setLoading(false);
  };

  const getDataModalidades = async () => {
    setLoading(true);

    const { data } = await ModalidadeService.getData({ perPage: 1000 });

    setModalidades(data);

    setLoading(false);
  };

  const handleAdd = async () => {
    await getDataModalidades();

    setEditingRecord(null);

    form.resetFields();

    setModalVisible(true);
  };

  const handleEdit = async (record) => {
    if (modalidades.length === 0) {
      await getDataModalidades(); // Carrega as modalidades, se necessário
    }

    form.setFieldsValue({
      ...record,
      modalidade: record.modalidade.id, // Preenche com o ID da modalidade
      // date: moment(record.date).format("YYYY-MM-DD"), // Formata a data corretamente
      // time: record.hour, // Garante que o horário seja preenchido corretamente
    });

    setEditingRecord(record);

    setModalVisible(true);
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        const { success } =
          await AulaExperimentalService.updateAulaExperimental({
            aulaExperimental: values,
            id: editingRecord.id,
          });

        if (!success) {
          notification.error({
            message: "Erro ao atualizar aula experimental",
            description:
              "Houve um problema ao atualizar a aula experimental. Tente novamente mais tarde.",
          });

          setLoading(false);

          return;
        }

        notification.success({
          message: "Aula experimental!",
          description: "Aula experimental atualizada com sucesso.",
        });
      } else {
        const { success } =
          await AulaExperimentalService.createAulaExperimental({
            aulaExperimental: values,
          });

        if (!success) {
          notification.error({
            message: "Erro ao criar a aula experimental",
            description:
              "Houve um problema ao criar a aula experimental. Tente novamente mais tarde.",
          });

          setLoading(false);

          return;
        }

        notification.success({
          message: "Aula experimental!",
          description: "Aula experimental atualizada com sucesso.",
        });
      }

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
      title: "Nome do Aluno",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
    },
    {
      title: "Modalidade",
      dataIndex: "modalidade",
      key: "modalidade",
      render: (_, record) => record.modalidade.nome,
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (_, record) => moment(record.date).format("DD/MM/YYYY"),
    },
    {
      title: "Horário",
      dataIndex: "hour",
      key: "hour",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Editar</Button>

          <Button danger onClick={() => handleDelete(record.key)}>
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

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
            Registrar aula
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={loading}
        />

        <Modal
          title={editingRecord ? "Editar aula" : "Registrar aula"}
          open={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical" name="lessonForm">
            <Form.Item
              name="nome"
              label="Nome do Aluno"
              rules={[
                { required: true, message: "Nome do aluno é obrigatório" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="cpf"
              label="CPF"
              rules={[
                { required: true, message: "CPF é obrigatório" },
                {
                  pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: "CPF deve estar no formato 123.456.789-00",
                },
              ]}
            >

              <Input
                maxLength={14}
                onChange={(e) => {
                  const maskedValue = maskCPF({ value: e.target.value });
                  form.setFieldsValue({ cpf: maskedValue });
                }}
                placeholder="123.456.789-00"
              />
            </Form.Item>
            <Form.Item
              name="modalidade"
              label="Modalidade"
              rules={[{ required: true, message: "Modalidade é obrigatória" }]}
            >
              <Select>
                {modalidades.map((mod) => (
                  <Option key={mod.id} value={mod.id}>
                    {mod.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Data"
              rules={[{ required: true, message: "Data é obrigatória" }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="hour"
              label="Horário"
              rules={[{ required: true, message: "Horário é obrigatório" }]}
            >
              <Input type="time" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AulasExperimentais;
