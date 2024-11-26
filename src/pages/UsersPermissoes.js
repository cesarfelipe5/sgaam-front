import { Button, Form, Input, Modal, notification, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { UsuarioService } from "../services/usuario/UsuarioService";

const UsuariosPermissoes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [dataUser, setDataUser] = useState();
  const [loading, setLoading] = useState(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);

    const { data } = await UsuarioService.getData({ perPage: 1000 });

    setDataUser(data);

    setLoading(false);
  };

  const handleAddUser = () => {
    setEditingUser(null);

    form.resetFields();

    setIsModalVisible(true);
  };

  const handleEditUser = (record) => {
    setIsModalVisible(true);

    setEditingUser(record);

    form.setFieldsValue(record);
  };

  const handleDeleteUser = async () => {
    setLoading(true);

    const { success } = await UsuarioService.removeById({ id: deleteRecord.id });

    if (!success) {
      notification.error({
        message: "Erro ao remover o usuário",
        description:
          "Houve um problema ao remover o usuário. Tente novamente mais tarde.",
      });

      return;
    }

    notification.success({
      message: "Usuário removido!",
      description: "Usuário removido com sucesso.",
    });

    setLoading(false);
    setDeleteRecord(null);
    getData();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (values.senha !== values.senhaConfirmacao) {
        notification.error({
          message: "Senhas não são iguais.",
          description:
            "Senhas não são iguais, verifique as senha informadas e tente novamente.",
        });
      }

      if (editingUser) {
        setLoading(true);

        const { success } = await UsuarioService.updateUsuario({
          usuario: values,
          id: editingUser.id,
        });

        if (!success) {
          notification.error({
            message: "Erro ao atualiar o usuário",
            description:
              "Houve um problema ao atualizar o usuário. Tente novamente mais tarde.",
          });

          return;
        }

        notification.success({
          message: "Usuário atualizado!",
          description: "Usuário atualizado com sucesso.",
        });
      } else {
        setLoading(true);

        const { success } = await UsuarioService.createUsuario({
          usuario: values,
        });

        if (!success) {
          notification.error({
            message: "Erro ao criar usuário",
            description:
              "Houve um problema ao criar o usuário. Tente novamente mais tarde.",
          });

          return;
        }

        notification.success({
          message: "Usuário adicionado!",
          description: "Usuário adicionado com sucesso.",
        });
      }

      setLoading(false);

      await getData();

      form.resetFields();

      setIsModalVisible(false);
    } catch (error) {
      console.error("Erro na validação:", error);
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      key: "acoes",
      render: (_, record) => (
        <>
          <Button
            style={{
              borderColor: "black",
              color: "black",
              marginRight: "15px",
            }}
            type="link"
            onClick={() => handleEditUser(record)}
          >
            Editar
          </Button>

          <Button
            style={{ borderColor: "red", color: "red" }}
            type="link"
            onClick={() => setDeleteRecord(record)}
            danger
          >
            Remover
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <DrawerMenu />

      <div style={{ padding: "20px" }}>
        <Button
          type="primary"
          style={{ backgroundColor: "black", marginBottom: "20px" }}
          onClick={handleAddUser}
        >
          Adicionar usuário
        </Button>

        <Table
          columns={columns}
          dataSource={dataUser}
          loading={loading}
          pagination={false}
        />

        <Modal
          title={editingUser ? "Editar usuário" : "Adicionar usuário"}
          open={isModalVisible}
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
              rules={[
                {
                  required: true,
                  message: "Por favor, insira o nome do usuário",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Por favor, insira um email válido",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="senha"
              rules={[
                !editingUser
                  ? {
                    required: true,
                    message: "A senha é obrigatória",
                  }
                  : null,
                {
                  min: 8,
                  message: "A senha deve ter pelo menos 8 caracteres",
                },
                {
                  pattern: /[A-Z]/,
                  message: "A senha deve conter pelo menos uma letra maiúscula",
                },
                {
                  pattern: /[a-z]/,
                  message: "A senha deve conter pelo menos uma letra minúscula",
                },
                {
                  pattern: /\d/,
                  message: "A senha deve conter pelo menos um número",
                },
                {
                  pattern: /[!@#$%^&*(),.?":{}|<>]/,
                  message:
                    "A senha deve conter pelo menos um caractere especial",
                },
              ]}
            >
              <Input.Password placeholder="********" />
            </Form.Item>

            <Form.Item
              label="Confirme a senha"
              name="senhaConfirmacao"
              rules={[
                !editingUser
                  ? {
                    required: true,
                    message: "A senha é obrigatória",
                  }
                  : null,
                {
                  min: 8,
                  message: "A senha deve ter pelo menos 8 caracteres",
                },
                {
                  pattern: /[A-Z]/,
                  message: "A senha deve conter pelo menos uma letra maiúscula",
                },
                {
                  pattern: /[a-z]/,
                  message: "A senha deve conter pelo menos uma letra minúscula",
                },
                {
                  pattern: /\d/,
                  message: "A senha deve conter pelo menos um número",
                },
                {
                  pattern: /[!@#$%^&*(),.?":{}|<>]/,
                  message:
                    "A senha deve conter pelo menos um caractere especial",
                },
              ]}
            >
              <Input.Password placeholder="********" />
            </Form.Item>
          </Form>
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
          <p>Bem-vindo à página de gestão de usuários!</p>
          <ul>
            <li>Use o botão "Adicionar usuário" para registrar novos usuários.</li>
            <li>Clique em "Editar" para modificar as informações de um usuário.</li>
            <li>Clique em "Remover" para remover um usuário.</li>
          </ul>
          <p>Para mais dúvidas, entre em contato com o suporte.</p>
        </Modal>
        <Modal
          title="Confirmar Exclusão?"
          open={!!deleteRecord}
          onCancel={() => setDeleteRecord(null)}
          onOk={() => handleDeleteUser()}
          okText="Excluir"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
        >
          <p>
            Tem certeza de que deseja excluir o usuario {deleteRecord?.nome}?
          </p>
        </Modal>
      </div>
    </>
  );
};

export default UsuariosPermissoes;
