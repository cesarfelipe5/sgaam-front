import React, { useState } from 'react';
import { Table, Modal, Button, Tag, Select, Input, Row, Col } from 'antd';
import DrawerMenu from '../components/DrawerMenu';

const { Option } = Select;
const { Search } = Input;

// Dados da tabela de alunos com status
const data = [
  {
    key: '1',
    name: 'João Silva',
    status: 'ativo',
    paymentPlan: 'Mensal',
    planValue: 'R$150',
    planStart: '01/06/2023'
  },
  {
    key: '2',
    name: 'Maria Souza',
    status: 'inativo',
    paymentPlan: 'Semestral',
    planValue: 'R$900',
    planStart: '01/01/2023'
  },
  // Adicione mais alunos aqui
];

const mensalidadesData = {
  '1': [
    { key: '1', value: 'R$150', date: '01/08/2023', receivedBy: 'Fulano' },
    { key: '2', value: 'R$150', date: '01/07/2023', receivedBy: 'Beltrano' },
  ],
  '2': [
    { key: '1', value: 'R$200', date: '01/08/2023', receivedBy: 'Ciclano' },
    { key: '2', value: 'R$200', date: '01/07/2023', receivedBy: 'Fulano' },
  ],
  // Adicione mais mensalidades por aluno aqui
};

const Mensalidades = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [sortOrder, setSortOrder] = useState('descend');
  const [searchText, setSearchText] = useState('');

  const showModal = (record) => {
    setSelectedAluno(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAluno(null);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const sortedMensalidades = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return sortOrder === 'descend' ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredData = data.filter((aluno) =>
    aluno.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Nome do Aluno',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ativo' ? 'green' : 'red'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'action',
      render: (text, record) => (
        <Button
          onClick={() => showModal(record)}
          style={{ backgroundColor: 'black', color: 'white', borderColor: '#000' }}
        >
          Ver Mensalidades
        </Button>
      ),
    },
  ];

  const mensalidadesColumns = [
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Recebido por',
      dataIndex: 'receivedBy',
      key: 'receivedBy',
    },
  ];

  return (
    <>
      <DrawerMenu />

      {/* Campo de busca e tabela */}
      <Row style={{ marginBottom: '10px', marginTop: '20px', padding: '0 20px' }} justify="start">
        <Col span={8}>
          <Search
            placeholder="Buscar por nome do aluno"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        style={{ padding: '0 20px' }}
      />

      <Modal
        title={`Mensalidades de ${selectedAluno?.name}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedAluno && (
          <>
            <p><strong>Plano de Pagamento:</strong> {selectedAluno.paymentPlan}</p>
            <p><strong>Valor do Plano:</strong> {selectedAluno.planValue}</p>
            <p><strong>Início do Plano:</strong> {selectedAluno.planStart}</p>
            <Select
              defaultValue="descend"
              style={{ width: 200, marginBottom: '10px' }}
              onChange={handleSortChange}
            >
              <Option value="descend">Mais recentes primeiro</Option>
              <Option value="ascend">Mais antigos primeiro</Option>
            </Select>
            <Table
              columns={mensalidadesColumns}
              dataSource={sortedMensalidades(mensalidadesData[selectedAluno?.key] || [])}
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
