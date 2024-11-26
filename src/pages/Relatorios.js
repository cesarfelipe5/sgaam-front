import React, { useState } from 'react';
import { Button, Modal, Table, Select, DatePicker, Space, Typography } from 'antd';
import DrawerMenu from '../components/DrawerMenu';
import moment from 'moment';
import 'moment/locale/pt-br';
import locale from 'antd/es/date-picker/locale/pt_BR';

const { Title } = Typography;

const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('lastMonth'); // Período 'Último mês' por padrão
  const [customRange, setCustomRange] = useState(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);


  // Handler para alterar o período selecionado
  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    setCustomRange(null); // Resetar o intervalo personalizado ao escolher outro período
  };

  // Handler para intervalo de datas personalizado
  const handleDateRangeChange = (dates) => {
    setSelectedPeriod('custom');
    setCustomRange(dates);
  };

  // Dados mock para a tabela
  const reportData = [
    {
      key: '1',
      enrolledStudents: 120,
      totalRevenue: 'R$ 15.000,00',
      experimentalClasses: 35,
    },
  ];

  // Quantidade de matrículas ativas (mock)
  const activeEnrollments = 120;

  // Definição das colunas da tabela
  const columns = [
    {
      title: 'Alunos Matriculados no Período',
      dataIndex: 'enrolledStudents',
      key: 'enrolledStudents',
    },
    {
      title: 'Faturamento do Período',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
    },
    {
      title: 'Aulas Experimentais Realizadas',
      dataIndex: 'experimentalClasses',
      key: 'experimentalClasses',
    },
  ];

  return (
    <>
      <DrawerMenu />
      <div style={{ padding: '16px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>

          {/* Título da página e exibição das matrículas ativas */}
          <Title level={4}>Matrículas Ativas: {activeEnrollments}</Title>

          {/* Texto "Dados por período" e Select para escolha do período */}
          <Space direction="horizontal" align="center" >
            <span>Dados por período:</span>
            <Select
              defaultValue="lastMonth"
              onChange={handlePeriodChange}
              style={{ width: 220 }}
            >
              <Select.Option value="allTime">Desde Sempre</Select.Option>
              <Select.Option value="lastYear">Último Ano</Select.Option>
              <Select.Option value="lastMonth">Último Mês</Select.Option>
              <Select.Option value="custom">Intervalo Personalizado</Select.Option>
            </Select>
          </Space>

          {/* Exibe o seletor de intervalo de datas quando 'Intervalo Personalizado' for selecionado */}
          {selectedPeriod === 'custom' && (
            <DatePicker.RangePicker
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY" // Formato em "DD/MM/YYYY"
              defaultValue={[moment().startOf('month'), moment()]}
              style={{ marginBottom: 16 }}
              locale={locale} // Define o calendário e texto em português
            />
          )}

          {/* Tabela com os dados do relatório */}
          <Table
            columns={columns}
            dataSource={reportData}
            pagination={false}
            bordered
          />
        </Space>
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
          <p>Bem-vindo à página de relatórios!</p>
          <ul>
            <li>Selecione o período desejado para a apresentação dos dados.</li>
            <li>As quantidades de alunos matriculados, faturamento e aulas experimentais no período escolhido são apresentadas.</li>
          </ul>
          <p>Para mais dúvidas, entre em contato com o suporte.</p>
        </Modal>

      </div>
    </>
  );
};

export default Relatorios;
