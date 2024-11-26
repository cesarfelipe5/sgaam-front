export const maskCPF = ({ value }) => {
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return value;
};

export const maskPhone = ({ value }) => {
  // Remove qualquer caractere que não seja número
  value = value.replace(/\D/g, "");

  if (value.length <= 2) {
    // Adiciona os parênteses ao redor dos dois primeiros dígitos
    value = value.replace(/^(\d{0,2})/, "($1");
  } else if (value.length <= 6) {
    // Adiciona parênteses e espaço após os dois primeiros dígitos
    value = value.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  } else if (value.length <= 10) {
    // Formato para números sem o nono dígito: (XX) XXXX-XXXX
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  } else if (value.length <= 11) {
    // Formato para números com o nono dígito: (XX) 9 XXXX-XXXX
    value = value.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})$/, "($1) $2 $3-$4");
  }

  return value;
};

export const maskCEP = ({ value }) => {
  value = value.replace(/\D/g, "");

  if (value.length <= 8) {
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  }

  return value;
};

export const formatCurrency = (value) => {
  if (!value) {
    return 0;
  }

  const numericValue = value.replace(/[^\d]/g, ""); // Remove não numéricos

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue / 100); // Divide por 100 para representar centavos
};
