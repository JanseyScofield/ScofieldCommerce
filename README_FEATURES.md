# Funcionalidades - Scofield Commerce v1.0 🌟

Este documento descreve detalhadamente as funcionalidades disponíveis na **versão 1.0** da plataforma **Scofield Commerce**. O sistema foi concebido para fornecer uma experiência de uso premium, moderna e altamente interativa para a gestão de vendas e análise inteligente de clientes.

---

## 📊 1. Painel de Controle (Dashboard)
O painel inicial consolida os principais indicadores de desempenho (KPIs) e gráficos analíticos de vendas do dia e do período.

* **Indicadores em Tempo Real (KPIs)**:
  * **Valor Total Vendido (Hoje)**: Soma exata do faturamento de todas as vendas do dia corrente.
  * **Qtd. Produtos Vendidos (Hoje)**: Quantidade física total de itens faturados no dia.
  * **Total de Comissão (Hoje)**: Soma acumulada das comissões geradas para os vendedores nas vendas de hoje.
* **Gráficos Analíticos**:
  * **Evolução Diária**: Gráfico de linha interativo exibindo a tendência de vendas ao longo dos últimos dias da semana.
  * **Comparativo Mensal**: Gráfico de barras ilustrando o volume financeiro vendido em cada mês do ano vigente.

---

## 🛒 2. Lançamento de Vendas (Nova Venda)
Fluxo simplificado e otimizado para o registro de transações comerciais.

* **Formulário Dinâmico**:
  * Associação rápida do cliente comprador e seleção dinâmica de produtos.
  * Adição múltipla de itens em formato de tabela com cálculo em tempo real do subtotal e total geral.
* **Regras de Negócio e Validação**:
  * Definição flexível do prazo de pagamento (em dias).
  * Checkbox para indicar se a venda possui nota fiscal associada.
  * **Cálculo de Comissão Automatizado**: O sistema calcula na gravação a comissão exata com base na estratégia correspondente a cada produto.

---

## 📜 3. Histórico de Vendas
Central de auditoria e monitoramento de transações comerciais realizadas.

* **Filtros Avançados**: Busca instantânea de vendas por **Produto**, **Cliente** e **Data de Venda**.
* **Visualização Expandível (Master-Detail)**:
  * A listagem de vendas exibe informações resumidas (cliente, valor total, comissão gerada, prazo de pagamento, nota fiscal).
  * É possível expandir cada linha para detalhar exatamente quais produtos e quantidades compuseram aquela venda específica.

---

## 👥 4. Inteligência de Clientes (Relatório Avançado)
Módulo inteligente focado em fornecer insights estratégicos sobre a base de clientes cadastrados.

* **Top Clientes**: Ranking dos clientes mais valiosos com base no volume financeiro total comprado e na quantidade de vendas concretizadas.
* **Preferência de Compra (Valor por Produto)**: Gráfico de rosca (*donut chart*) interativo exibindo a distribuição do faturamento total por produto, permitindo identificar quais produtos têm maior saída na base de clientes.
* **Clientes em Risco (Inatividade)**:
  * Filtro configurável de dias de inatividade (**15, 30, 60 ou 90 dias**).
  * Exibição das colunas: **Razão Social do Cliente**, **Nome do Comprador**, **Data da Última Compra** e **Dias de Inatividade**.
  * **Coluna de Contato Rápido**: O telefone do comprador é exibido como um botão clicável (`tel:`), permitindo que o setor de pós-venda entre em contato diretamente com o cliente em risco com um único clique.

---

## ⚙️ 5. Módulo de Cadastros (Clientes e Produtos)

### Cadastro de Clientes
* **Integração Automática ViaCEP**: Ao digitar um CEP válido (8 dígitos), o sistema faz uma requisição em segundo plano via Axios para a API do ViaCEP e autopreenche os campos de Logradouro, Bairro, Cidade e Estado.
* **Validação Estrita de Estado (UF)**: Normalização e validação contra os 27 estados da federação brasileira no back-end.
* **Placeholders Inteligentes**: Indicação visual de padrões de inserção para campos como CNPJ, Telefone e CEP.
* **Limitação de Texto (`maxLength`)**: Todos os campos do front-end são limitados ao tamanho exato de armazenamento da coluna correspondente no banco de dados, prevenindo erros de persistência.
* **Inscrição Estadual Opcional**: Removida a obrigatoriedade deste campo nas validações de front e back-end para agilizar o processo de novos cadastros.

### Cadastro de Produtos
* **Cadastro Simples**: Definição rápida do nome e valor unitário do produto.
* **Estratégia Fuzzy de Comissão**: Na criação de um produto, o sistema utiliza busca de similaridade textual para associá-lo inteligentemente a estratégias pré-definidas de comissão (ex: produtos contendo "estrela" ganham regras diferenciadas de margem de comissão).
