import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Spin,
  Table,
  Tag
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DrawerMenu from "../components/DrawerMenu";
import { AlunosService } from "../services/alunos/AlunosService";
import { PlanoService } from "../services/plano/PlanoService";
import { maskCEP, maskCPF, maskPhone } from "../utils/mask";
import { SearchOutlined } from "@ant-design/icons";

const MainPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [dataPlanos, setDataPlanos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [viewDetailsVisible, setViewDetailsVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false); // Modal de confirmação
  const [recordToDelete, setRecordToDelete] = useState(null); // Registro a ser excluído
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [sortKey, setSortKey] = useState("name");
  const [helpModalVisible, setHelpModalVisible] = useState(false);


  const getData = async () => {
    setLoading(true);

    const { data } = await AlunosService.getData({ showAll: true });

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

    const { success } = await AlunosService.createAluno({ aluno: values });

    if (!success) {
      notification.error({
        message: "Falha em registrar",
        description: "Ocorreu uma falha em registrar, tente novamente.",
      });

      setLoading(false);

      return;
    }

    notification.success({
      message: "Aluno registrado!",
      description: "Aluno registrado com sucesso.",
    });

    setLoading(false);

    getData();
  };

  const updateAluno = async (values) => {
    setLoading(true);

    const { success } = await AlunosService.updateAluno({
      aluno: values,
      id: editingRecord.id,
    });

    if (!success) {
      notification.error({
        message: "Falha ao atualizar aluno",
        description: "Aluno não atualizado.",
      });

      setLoading(false);

      return;
    }

    notification.success({
      message: "Aluno atualizado!",
      description: "Aluno atualizado com sucesso.",
    });

    setLoading(false);

    getData();
  };

  const handleAdd = async () => {
    setLoading(true);

    const { data } = await PlanoService.getData({ perpage: 10000 });

    setDataPlanos(data);

    setEditingRecord(null);

    form.resetFields();

    setLoading(false);

    setModalVisible(true);
  };

  const handleEdit = async (id) => {
    const data = await getAlunoById({ id });
    const { data: dataPlans } = await PlanoService.getData({ perPage: 10000 });

    setDataPlanos(dataPlans);

    const dataToEdit = {
      ...data,
      tipo: data.telefones[0].tipo,
      numero_telefone: maskPhone({ value: data.telefones[0].numero }),
      cpf: maskCPF({ value: data.cpf }),
      cep: maskCEP({ value: data.cep }),
      plano: data.planos[0]?.id,
    };

    setEditingRecord(dataToEdit);

    form.setFieldsValue(dataToEdit);

    setModalVisible(true);
  };

  const confirmDelete = (record) => () => {
    setRecordToDelete(record);

    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    const { success } = await AlunosService.removeById({
      id: recordToDelete.id,
    });

    if (!success) {
      toast.error(
        "Houve um problema na remoção do aluno. Tente novamente mais tarde."
      );

      setLoading(false);

      return;
    }

    toast.success("Aluno removido com sucesso.");

    setDeleteConfirmVisible(false); // Fechar o modal de confirmação

    setRecordToDelete(null);

    await getData();
  };

  const handleViewDetails = async (id) => {
    const data = await getAlunoById({ id });

    const dataToView = {
      ...data,
      tipo: data.telefones[0].tipo,
      numero_telefone: data.telefones[0].numero,
    };

    setEditingRecord(dataToView);

    setViewDetailsVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        updateAluno(values);
      } else {
        submitAluno(values);
      }

      setModalVisible(false);

      form.resetFields();
    } catch (error) {
      console.error("Erro na validação:", error);
    }
  };
  const handleCancel = () => {
    setModalVisible(false);

    setViewDetailsVisible(false);
    setDeleteConfirmVisible(false); // Fechar modal de exclusão
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
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      sorter: (a, b) => a.isActive.toString().localeCompare(b.isActive.toString()),
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Ativo" : "Inativo"}
        </Tag>
      ),
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
      title: "Plano",
      dataIndex: "plano",
      key: "plano",
      render: (_, record) => record.planos[0]?.nome,
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
            Ver detalhes
          </Button>

          <Button onClick={() => handleEdit(record.id)}>Editar</Button>

          <Button danger onClick={confirmDelete(record)}>
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


          </Space>

          <Table columns={columns} dataSource={dataSource} pagination={false} />

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
            title={editingRecord ? "Editar Aluno" : "Adicionar Aluno"}
            open={modalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Salvar"
            cancelText="Cancelar"
          >
            <Form form={form} layout="vertical" name="studentForm">
              <Form.Item
                name="plano"
                label="Plano"
                rules={[{ required: true, message: "Plano é obrigatório" }]}
              >
                <Select>
                  {dataPlanos.map((plano) => (
                    <Select.Option key={plano.id} value={plano.id}>
                      {plano.nome}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
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
                name="rg"
                label="RG"
                rules={[{ required: true, message: "RG é obrigatório" }]}
              >
                <Input maxLength={14} />
              </Form.Item>

              <Form.Item
                name="cep"
                label="CEP"
                rules={[
                  { required: true, message: "CEP é obrigatório" },
                  {
                    pattern: /^\d{5}-\d{3}$/,
                    message: "CEP deve estar no formato 12345-678",
                  },
                ]}
              >
                <Input
                  maxLength={9}
                  onChange={(e) => {
                    const maskedValue = maskCEP({ value: e.target.value });
                    form.setFieldsValue({ cep: maskedValue });
                  }}
                  placeholder="00000-000"
                />
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
                <Select>
                  <Select.Option value="Residencial">Residencial</Select.Option>
                  <Select.Option value="Comercial">Comercial</Select.Option>
                  <Select.Option value="Celular">Celular</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="numero_telefone"
                label="Número"
                rules={[
                  { required: true, message: "Número é obrigatório" },
                  {
                    pattern: /^\(\d{2}\) \d \d{4}-\d{4}$/,
                    message: "O número deve estar com DDD",
                  },
                ]}
              >
                <Input
                  maxLength={16}
                  onChange={(e) => {
                    const maskedTelefone = maskPhone({ value: e.target.value });
                    form.setFieldsValue({ numero_telefone: maskedTelefone });
                  }}
                />
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
                  <strong>Plano:</strong> {editingRecord.planos[0]?.nome}
                </p>

                <p>
                  <strong>Nome:</strong> {editingRecord.nome}
                </p>

                <p>
                  <strong>CPF:</strong> {maskCPF({ value: editingRecord.cpf })}
                </p>

                <p>
                  <strong>RG:</strong> {editingRecord.rg}
                </p>

                <p>
                  <strong>CEP:</strong> {maskCEP({ value: editingRecord.cep })}
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
                  <strong>Telefone:</strong>
                  {maskPhone({ value: editingRecord.numero_telefone })}
                </p>
              </div>
            )}
          </Modal>
        </div>
      </Spin>
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
  <p>Bem-vindo à página de gestão de alunos!</p>
  <ul>
    <li>Use o botão "Adicionar Aluno" para registrar novos alunos.</li>
    <li>Utilize a busca para encontrar alunos pelo nome.</li>
    <li>Para ordenar a tabela por nome ou status clique no topo de suas respectivas colunas.</li>
    <li>Clique em "Ver detalhes" para ver as informações de um aluno.</li>
    <li>Clique em "Editar" para modificar as informações de um aluno.</li>
    <li>Clique em "Excluir" para remover um aluno.</li>
  </ul>
  <p>Para mais dúvidas, entre em contato com o suporte.</p>
</Modal>

    </div>
  );
};

export default MainPage;
