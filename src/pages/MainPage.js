import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DrawerMenu from "../components/DrawerMenu";
import { AlunosService } from "../services/alunos/AlunosService";

const MainPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [viewDetailsVisible, setViewDetailsVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [sortKey, setSortKey] = useState("name");

  const getData = async () => {
    setLoading(true);

    const { data } = await AlunosService.getData();

    setDataSource(data);

    setLoading(false);
  };

  const getAlunoById = async ({ id }) => {
    setLoading(true);

    const { data } = await AlunosService.getById({ id });

    setLoading(false);

    return data;
  };

  const submitAluno = async (values) => {
    setLoading(true);

    const success = await AlunosService.createAluno({ aluno: values });

    if (!success) {
      toast.error(
        "Houve um problema na criação do aluno. Tente novamente mais tarde."
      );

      setLoading(false);

      return;
    }

    toast.success("Aluno cadastrado com sucesso.");

    setLoading(false);

    getData();
  };

  const updateAluno = async (values) => {
    setLoading(true);

    const success = await AlunosService.updateAluno({
      aluno: values,
      id: editingRecord.id,
    });

    if (!success) {
      toast.error(
        "Houve um problema na atualização do aluno. Tente novamente mais tarde."
      );

      setLoading(false);

      return;
    }

    toast.success("Aluno atualizado com sucesso.");

    setLoading(false);

    getData();
  };

  const handleAdd = () => {
    setEditingRecord(null);

    form.resetFields();

    setModalVisible(true);
  };

  const handleEdit = async (id) => {
    const data = await getAlunoById({ id });

    const dataToEdit = {
      ...data,
      tipo: data.telefones[0].tipo,
      numero_telefone: data.telefones[0].numero,
    };

    setEditingRecord(dataToEdit);

    form.setFieldsValue(dataToEdit);

    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const success = await AlunosService.removeById({ id });

    if (!success) {
      toast.error(
        "Houve um problema na remoção do aluno. Tente novamente mais tarde."
      );

      setLoading(false);

      return;
    }

    toast.success("Aluno removido com sucesso.");

    await getData();
  };

  const handleViewDetails = async (id) => {
    const data = await getAlunoById({ id });

    setEditingRecord(data);

    setViewDetailsVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    if (editingRecord) {
      updateAluno(values);
    } else {
      submitAluno(values);
    }

    setModalVisible(false);

    form.resetFields();
  };

  const handleCancel = () => {
    setModalVisible(false);

    setViewDetailsVisible(false);

    form.resetFields();
  };

  const handleSort = (value) => {
    setSortKey(value);
    const sortedData = [...dataSource].sort((a, b) => {
      if (value === "status") {
        const statusOrder = { Ativo: 1, Inativo: 2 };
        return (
          statusOrder[a.status] - statusOrder[b.status] ||
          a?.name?.localeCompare(b.name)
        );
      }
      return a[value]?.localeCompare(b[value]);
    });
    setDataSource(sortedData);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);
    const filteredData = dataSource.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );
    setDataSource(filteredData);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "RG",
      dataIndex: "rg",
      key: "rg",
    },
    {
      title: "cpf",
      dataIndex: "cpf",
      key: "cpf",
    },

    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => handleViewDetails(record.id)}
            style={{ borderColor: "green", color: "green" }}
          >
            Ver Detalhes
          </Button>

          <Button onClick={() => handleEdit(record.id)}>Editar</Button>

          <Button danger onClick={() => handleDelete(record.id)}>
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

      <Spin spinning={loading}>
        <div style={{ padding: "16px" }}>
          <Space style={{ marginBottom: "16px" }}>
            <Button
              style={{ background: "black" }}
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Adicionar Aluno
            </Button>

            <Input
              placeholder="Buscar por nome"
              value={searchText}
              onChange={handleSearch}
              style={{ width: 200 }}
            />

            <Select
              defaultValue="Ordenar por Nome"
              onChange={handleSort}
              style={{ width: 200 }}
            >
              <Select.Option value="name">Ordenar por Nome</Select.Option>

              <Select.Option value="status">Ordenar por Status</Select.Option>
            </Select>
          </Space>

          <Table columns={columns} dataSource={dataSource} pagination={false} />

          <Modal
            title={editingRecord ? "Editar Aluno" : "Adicionar Aluno"}
            open={modalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Salvar"
            cancelText="Cancelar"
          >
            <Form form={form} layout="vertical" name="studentForm">
              <Form.Item
                name="nome"
                label="Nome"
                rules={[{ required: true, message: "Nome é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="cpf"
                label="CPF"
                rules={[
                  { required: true, message: "CPF é obrigatório" },
                  {
                    pattern: /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/,
                    message:
                      "CPF deve ser válido, no formato 123.456.789-00 ou apenas números",
                  },
                ]}
              >
                <Input maxLength={11} />
              </Form.Item>

              <Form.Item
                name="rg"
                label="RG"
                rules={[
                  { required: true, message: "RG é obrigatório" },
                  {
                    pattern: /^[0-9]{7,11}$/,
                    message: "RG deve conter entre 7 a 11 números",
                  },
                ]}
              >
                <Input maxLength={11} minLength={7} />
              </Form.Item>

              <Form.Item
                name="cep"
                label="Cep"
                rules={[{ required: true, message: "CEP é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="logradouro"
                label="Logradouro"
                rules={[
                  { required: true, message: "Logradouro é obrigatório" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="numero"
                label="Número"
                rules={[{ required: true, message: "Número é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="bairro"
                label="Bairro"
                rules={[{ required: true, message: "Bairro é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="cidade"
                label="Cidade"
                rules={[{ required: true, message: "Cidade é obrigatório" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="uf"
                label="UF"
                rules={[{ required: true, message: "UF é obrigatório" }]}
              >
                <Input
                  maxLength={2}
                  onInput={(e) =>
                    (e.target.value = e.target.value.toUpperCase())
                  }
                />
              </Form.Item>

              <Form.Item
                name="tipo"
                label="Tipo de telefone"
                rules={[
                  {
                    required: true,
                    message: "O tipo do telefone é obrigatório",
                  },
                ]}
              >
                <Select defaultValue="Celular">
                  <Select.Option value="Residencial">Residencial</Select.Option>
                  <Select.Option value="Comercial">Comercial</Select.Option>
                  <Select.Option value="Celular">Celular</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="numero_telefone"
                label="Número"
                rules={[{ required: true, message: "Número é obrigatório" }]}
              >
                <Input maxLength={11} />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Detalhes do Aluno"
            open={viewDetailsVisible}
            onCancel={handleCancel}
            footer={null}
          >
            {editingRecord && (
              <div>
                <p>
                  <strong>Nome:</strong> {editingRecord.nome}
                </p>

                <p>
                  <strong>CPF:</strong> {editingRecord.cpf}
                </p>

                <p>
                  <strong>RG:</strong> {editingRecord.rg}
                </p>

                <p>
                  <strong>CEP:</strong> {editingRecord.cep}
                </p>

                <p>
                  <strong>Logradouro:</strong> {editingRecord.logradouro}
                </p>

                <p>
                  <strong>Número: </strong> {editingRecord.numero}
                </p>

                <p>
                  <strong>Bairro:</strong> {editingRecord.bairro}
                </p>

                <p>
                  <strong>Cidade:</strong> {editingRecord.cidade}
                </p>

                <p>
                  <strong>Estado:</strong> {editingRecord.uf}
                </p>

                <p>
                  <strong>Tipo telefone:</strong> {editingRecord.tipo}
                </p>

                <p>
                  <strong>Telefone:</strong> {editingRecord.numero_telefone}
                </p>
              </div>
            )}
          </Modal>
        </div>
      </Spin>
    </div>
  );
};

export default MainPage;
