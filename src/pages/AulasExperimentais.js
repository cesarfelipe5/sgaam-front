import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DrawerMenu from '../components/DrawerMenu';

// Dados simulados
const initialData = [
  {
    key: '1',
    studentName: 'John Doe',
    cpf: '123.456.789-00',
    modality: 'Kung Fu',
    date: '2024-09-07',
    time: '14:00',
  },
  {
    key: '2',
    studentName: 'Jane Smith',
    cpf: '987.654.321-00',
    modality: 'Xadrez',
    date: '2024-09-08',
    time: '16:00',
  },
];

const AulasExperimentais = () => {
  const [dataSource, setDataSource] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newValues = {
          ...values,
        };
        if (editingRecord) {
          // Editar o registro existente
          setDataSource(dataSource.map((item) => (item.key === editingRecord.key ? { ...newValues, key: editingRecord.key } : item)));
        } else {
          // Adicionar novo registro
          setDataSource([...dataSource, { ...newValues, key: Date.now().toString() }]);
        }
        setModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Nome do Aluno',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
    },
    {
      title: 'Modalidade',
      dataIndex: 'modality',
      key: 'modality',
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Horário',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Editar</Button>
          <Button danger onClick={() => handleDelete(record.key)}>Excluir</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <DrawerMenu />
      <div style={{ padding: '16px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Button
            style={{ background: 'black', color: 'white' }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Registrar Aula
          </Button>
        </Space>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
        <Modal
          title={editingRecord ? 'Editar Aula' : 'Registrar Aula'}
          visible={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Salvar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical" name="lessonForm">
            <Form.Item
              name="studentName"
              label="Nome do Aluno"
              rules={[{ required: true, message: 'Nome do aluno é obrigatório' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[{ required: true, message: 'CPF é obrigatório' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="modality"
              label="Modalidade"
              rules={[{ required: true, message: 'Modalidade é obrigatória' }]}
            >
              <Select>
                <Select.Option value="Hapkido">Hapkido</Select.Option>
                <Select.Option value="Kung Fu">Kung Fu</Select.Option>
                <Select.Option value="Xadrez">Xadrez</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Data"
              rules={[{ required: true, message: 'Data é obrigatória' }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="time"
              label="Horário"
              rules={[{ required: true, message: 'Horário é obrigatório' }]}
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
