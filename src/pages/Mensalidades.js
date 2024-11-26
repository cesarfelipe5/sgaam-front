import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Row, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { AlunosService } from "../services/alunos/AlunosService";
import { formatCurrency } from "../utils/mask";

const Mensalidades = () => {
  const [loading, setLoading] = useState(false);
  const [dataAlunos, setDataAlunos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const showModal = async (record) => {
    setLoading(true);

    const { data } = await AlunosService.getById({ id: record.id });

    setSelectedAluno(data);

    setIsModalVisible(true);

    setLoading(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);

    setSelectedAluno(null);
  };

  const columns = [
    {
      title: "Nome do Aluno",
      dataIndex: "nome",
      key: "nome",
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar por nome"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
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
      onFilter: (value, record) =>
        record.nome.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Ativo" : "Inativo"}
        </Tag>
      ),
    },
    {
      title: "Ações",
      key: "action",
      render: (text, record) => (
        <Button
          onClick={() => showModal(record)}
          style={{
            backgroundColor: "black",
            color: "white",
            borderColor: "#000",
          }}
        >
          Ver mensalidades
        </Button>
      ),
    },
  ];

  const mensalidadesColumns = [
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      render: (valor) => (
        <div style={{ justifyContent: "flex-end", display: "flex" }}>
          {formatCurrency(valor)}
        </div>
      ),
    },
    {
      title: "Data",
      dataIndex: "dataPagamento",
      key: "dataPagamento",
      render: (dataPagamento) => moment(dataPagamento).format("DD/MM/YYYY"),
    },
    {
      title: "Recebido por",
      dataIndex: ["usuarios", "nome"],
      key: "receivedBy",
    },
  ];

  const getData = async () => {
    setLoading(true);
    const { data } = await AlunosService.getData({ perPage: 10000 });

    setDataAlunos(data);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <DrawerMenu />

      <Row
        style={{ marginBottom: "10px", marginTop: "20px", padding: "0 20px" }}
        justify="start"
      ></Row>

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataAlunos}
        rowKey="key"
        style={{ padding: "0 20px" }}
        pagination={false}
      />

      <Modal
        title={`Mensalidades de ${selectedAluno?.nome}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedAluno && (
          <>
            <p>
              <strong>Plano de Pagamento:</strong>
              {selectedAluno.planos[0].nome}
            </p>
            <p>
              <strong>Valor do Plano:</strong>
              {formatCurrency(selectedAluno.planos[0].precoPadrao)}
            </p>

            <Table
              columns={mensalidadesColumns}
              dataSource={selectedAluno.planoAlunos[0].pagamentos}
              pagination={false}
              rowKey="key"
            />
          </>
        )}
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
        title="Ajuda"
        open={helpModalVisible}
        onCancel={() => setHelpModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHelpModalVisible(false)}>
            Fechar
          </Button>,
        ]}
      >
        <p>Bem-vindo à página de mensalidades!</p>
        <ul>
          <li>Utilize a busca para encontrar alunos pelo nome.</li>
          <li>
            Clique em "Ver Mensalidades" para acessar o histórico de pagamentos
            de um aluno.
          </li>
          <li>
            No modal de mensalidades, você pode visualizar os detalhes do plano
            e os pagamentos realizados.
          </li>
          <li>Ordene os pagamentos por data para facilitar a consulta.</li>
        </ul>
        <p>Para mais dúvidas, entre em contato com o suporte.</p>
      </Modal>
    </>
  );
};

export default Mensalidades;
