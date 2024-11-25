import { Button, Col, Input, Modal, Row, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { AlunosService } from "../services/alunos/AlunosService";

const { Option } = Select;
const { Search } = Input;

const Mensalidades = () => {
  const [loading, setLoading] = useState(false);
  const [dataAlunos, setDataAlunos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [sortOrder, setSortOrder] = useState("descend");
  const [searchText, setSearchText] = useState("");

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

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const columns = [
    {
      title: "Nome do Aluno",
      dataIndex: "nome",
      key: "nome",
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
    },
    {
      title: "Data",
      dataIndex: "dataPagamento",
      key: "dataPagamento",
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
      >
        <Col span={8}>
          <Search
            placeholder="Buscar por nome do aluno"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

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
              {selectedAluno.planos[0].precoPadrao}
            </p>

            <Select
              defaultValue="descend"
              style={{ width: 200, marginBottom: "10px" }}
              onChange={handleSortChange}
            >
              <Option value="descend">Mais recentes primeiro</Option>
              <Option value="ascend">Mais antigos primeiro</Option>
            </Select>

            {console.log(selectedAluno)}
            <Table
              columns={mensalidadesColumns}
              dataSource={selectedAluno.planoAlunos[0].pagamentos}
              pagination={false}
              rowKey="key"
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default Mensalidades;
