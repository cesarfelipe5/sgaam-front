import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import DrawerMenu from '../components/DrawerMenu';

const { Option } = Select;

const EditableTable = () => {
  const [modalidades, setModalidades] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const isEditing = (record) => record.key === editingKey;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAdd = (values) => {
    setModalidades([...modalidades, { ...values, key: modalidades.length }]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleRemove = (key) => {
    const updatedModalidades = modalidades.filter((item) => item.key !== key);
    setModalidades(updatedModalidades);
  };

  const edit = (record) => {
    form.setFieldsValue({ nome: '', descricao: '', status: '', valor: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...modalidades];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setModalidades(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      editable: true,
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      editable: true,
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      editable: true,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Salvar
            </Button>
            <Button onClick={cancel}>Cancelar</Button>
          </span>
        ) : (
          <>
            <Button disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8 }}>
              Editar
            </Button>
            <Button type="danger" onClick={() => handleRemove(record.key)}>
              Remover
            </Button>
          </>
        );
      },
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
        inputType: col.dataIndex === 'valor' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      {/* Componente de Cabeçalho */}
      <DrawerMenu />

      {/* Botão para adicionar nova modalidade */}
      <div style={{ padding: '20px' }}>
        <Button
          type="primary"
          onClick={showModal}
          style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', color: '#000' }}
        >
          Adicionar Modalidade
        </Button>

        {/* Tabela de modalidades */}
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={modalidades}
            style={{ marginTop: '20px' }}
            pagination={{ pageSize: 5 }}
          />
        </Form>

        {/* Modal para adicionar nova modalidade */}
        <Modal title="Adicionar Modalidade" visible={isModalVisible} onCancel={handleCancel} footer={null}>
          <Form form={form} layout="vertical" onFinish={handleAdd}>
            <Form.Item
              name="nome"
              label="Nome"
              rules={[{ required: true, message: 'Por favor, insira o nome da modalidade' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[{ required: true, message: 'Por favor, insira a descrição' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Por favor, selecione o status' }]}
            >
              <Select>
                <Option value="Ativo">Ativo</Option>
                <Option value="Inativo">Inativo</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="valor"
              label="Valor"
              rules={[{ required: true, message: 'Por favor, insira o valor' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', color: '#000' }}
              >
                Adicionar
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <Input type="number" /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Por favor, insira ${title}` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableTable;
