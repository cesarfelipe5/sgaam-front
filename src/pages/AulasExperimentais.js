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
import DrawerMenu from "../components/DrawerMenu";
import { AulaExperimentalService } from "../services/aulaExperimental/AulaExperimentalService";
import { ModalidadeService } from "../services/modalidade/ModalidadeService";
import { maskCPF } from "../utils/mask";
import { SearchOutlined } from "@ant-design/icons";

const AulasExperimentais = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);


  const { Option } = Select;

  const modalDelete = (record) => {
    setRecordToDelete(record)
    setDeleteConfirmVisible(true)
  }

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
      modalidade: record.modalidade.id,
      cpf: maskCPF({ value: record.cpf })
    });

    setEditingRecord(record);

    setModalVisible(true);
  };

  const handleDelete = async () => {
    const { success } = await AulaExperimentalService.removeById({
      id: recordToDelete.id,
    });

    if (!success) {
      notification.error({
        message: "Erro ao remover aula experimental",
        description:
          "Houve um problema ao remover a aula experimental. Tente novamente mais tarde.",
      });

      setLoading(false);

      return;
    }

    notification.success({
      message: "Aula experimental!",
      description: "Aula experimental removida com sucesso.",
    });
    setDeleteConfirmVisible(false);

    await getData();
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
      await getData();
      setModalVisible(false);

      form.resetFields();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setDeleteConfirmVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Nome do Aluno",
      dataIndex: "nome",
      key: "nome",
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar por nome"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
      onFilter: (value, record) => record.nome.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
      render: (_, record) => maskCPF({ value: record.cpf })
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

          <Button danger onClick={() => modalDelete(record)}>
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
          title="Confirmar Exclusão"
          open={deleteConfirmVisible}
          onOk={handleDelete}
          onCancel={handleCancel}
          okText="Sim"
          cancelText="Não"
        >
          <p>
            Tem certeza de que deseja excluir o aluno{" "}
            <strong>{recordToDelete?.nome}</strong>?
          </p>
        </Modal>

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
  <p>Bem-vindo à página de Aulas experimentais!</p>
  <ul>
    <li>Use o botão "Registrar aula" para registrar novas aulas.</li>
    <li>Utilize a busca para encontrar alunos pelo nome.</li>
    <li>Clique em "Editar" para modificar as informações da aula.</li>
    <li>Clique em "Excluir" para remover a aula.</li>
  </ul>
  <p>Para mais dúvidas, entre em contato com o suporte.</p>
</Modal>

    </div>
  );
};

export default AulasExperimentais;
