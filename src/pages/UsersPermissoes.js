import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import DrawerMenu from '../components/DrawerMenu';

const { Option } = Select;

const UsuariosPermissoes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [data, setData] = useState([
    {
      key: '1',
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      nivelAcesso: 'Administrador',
      dataPermissao: '2023-01-10',
    },
    {
      key: '2',
      nome: 'Maria Souza',
      email: 'maria@exemplo.com',
      nivelAcesso: 'Professor',
      dataPermissao: '2023-03-15',
    },
  ]);

  const [form] = Form.useForm();

  const handleAddUser = () => {
    setIsModalVisible(true);
    setEditingUser(null);
    form.resetFields();
  };

  const handleEditUser = (record) => {
    setIsModalVisible(true);
    setEditingUser(record);
    form.setFieldsValue(record);
  };

  const handleDeleteUser = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = [...data];
      if (editingUser) {
        // Editando um usuário existente
        const index = newData.findIndex((item) => item.key === editingUser.key);
        newData[index] = { ...editingUser, ...values };
      } else {
        // Adicionando um novo usuário
        newData.push({
          key: `${newData.length + 1}`,
          ...values,
        });
      }
      setData(newData);
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nível de Acesso',
      dataIndex: 'nivelAcesso',
      key: 'nivelAcesso',
    },

    {
      title: 'Ações',
      key: 'acoes',
      render: (text, record) => (
        <>
          <Button style={{ borderColor: 'black', color: 'black', marginRight: '15px' }} type="link" onClick={() => handleEditUser(record)}>
            Editar
          </Button>
          <Button style={{ borderColor: 'red', color: 'red' }} type="link" onClick={() => handleDeleteUser(record.key)} danger>
            Remover
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <DrawerMenu />
      <div style={{ padding: '20px' }}>
        <Button type="primary" style={{ backgroundColor: 'black', marginBottom: '20px' }} onClick={handleAddUser}>
          Adicionar Usuário
        </Button>
        <Table columns={columns} dataSource={data} />

        <Modal
          title={editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={handleSave}>
              Salvar
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nome"
              name="nome"
              rules={[{ required: true, message: 'Por favor, insira o nome do usuário' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Por favor, insira um email válido' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nível de Acesso"
              name="nivelAcesso"
              rules={[{ required: true, message: 'Por favor, selecione o nível de acesso' }]}
            >
              <Select>
                <Option value="Administrador">Administrador</Option>
                <Option value="Professor">Professor</Option>
                <Option value="Recepção">Recepção</Option>
              </Select>
          
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default UsuariosPermissoes;
