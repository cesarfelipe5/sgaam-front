import {
  Button,
  DatePicker,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import locale from "antd/es/date-picker/locale/pt_BR";
import "moment/locale/pt-br";
import React, { useEffect, useState } from "react";
import DrawerMenu from "../components/DrawerMenu";
import { RelatorioService } from "../services/relatorio/RelatorioService";

const { Title } = Typography;

const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("lastMonth");
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [dataToShow, setDataToShow] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handler para alterar o período selecionado
  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  // Handler para intervalo de datas personalizado
  const handleDateRangeChange = async (dates) => {
    setSelectedPeriod("custom");

    if (!!dates?.[0] && !!dates?.[1]) {
      await getData(dates);
    }
  };

  // Definição das colunas da tabela
  const columns = [
    {
      title: "Alunos Matriculados no Período",
      dataIndex: "enrolledStudents",
      key: "enrolledStudents",
    },
    {
      title: "Faturamento do Período",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (totalRevenue) => {
        return `R$ ${totalRevenue}`;
      },
    },
    {
      title: "Aulas Experimentais Realizadas",
      dataIndex: "experimentalClasses",
      key: "experimentalClasses",
    },
  ];

  const getData = async (dates) => {
    setLoading(true);

    const { data } = await RelatorioService.getData(
      !!dates?.[0] && !!dates?.[1]
        ? {
            startDate: new Date(dates?.[0]).toISOString(),
            endDate: new Date(dates?.[1]).toISOString(),
          }
        : { periodo: selectedPeriod }
    );

    setDataToShow([data]);

    setLoading(false);
  };

  useEffect(() => {
    if (selectedPeriod !== "custom") {
      getData();
    }
  }, [selectedPeriod]);

  return (
    <>
      <DrawerMenu />

      <div style={{ padding: "16px" }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4}>
            Matrículas Ativas: {dataToShow?.[0]?.activeEnrollments}
          </Title>

          <Space direction="horizontal" align="center">
            <span>Dados por período:</span>

            <Select
              defaultValue="lastMonth"
              onChange={handlePeriodChange}
              style={{ width: 220 }}
            >
              <Select.Option value="allTime">Desde Sempre</Select.Option>
              <Select.Option value="lastYear">Último Ano</Select.Option>
              <Select.Option value="lastMonth">Último Mês</Select.Option>
              <Select.Option value="custom">
                Intervalo Personalizado
              </Select.Option>
            </Select>
          </Space>

          {selectedPeriod === "custom" && (
            <DatePicker.RangePicker
              oncha
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              // defaultValue={[moment().startOf("month"), moment()]}
              style={{ marginBottom: 16 }}
              locale={locale}
            />
          )}

          <Table
            loading={loading}
            columns={columns}
            dataSource={dataToShow}
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
          <p>Bem-vindo à página de relatórios!</p>
          <ul>
            <li>Selecione o período desejado para a apresentação dos dados.</li>
            <li>
              As quantidades de alunos matriculados, faturamento e aulas
              experimentais no período escolhido são apresentadas.
            </li>
          </ul>
          <p>Para mais dúvidas, entre em contato com o suporte.</p>
        </Modal>
      </div>
    </>
  );
};

export default Relatorios;
