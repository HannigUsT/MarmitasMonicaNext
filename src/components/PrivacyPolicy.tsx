"use client";

const UserAgreement: React.FC = () => {
  return (
    <div className="container flex flex-col space-y-6">
      <div className="flex flex-col">
        <div className="max-w-xs mx-auto text-sm font-bold" id="privacy-policy">
          <p className="text-center mb-2 text-base">
            Contrato de Usuário para o Site Marmitas da Mônica:
          </p>
          <ol className="list-decimal ml-4 mb-2">
            1. Aceitação dos Termos
            <p className="ml-4">
              1.1 - Ao acessar e usar o site Marmitas da Mônica, você concorda
              com os termos e condições estabelecidos neste contrato.
            </p>
          </ol>
          <ol className="list-decimal ml-4 mb-2">
            2. Uso do Site
            <p className="ml-4">
              2.1 -Você concorda em usar o site apenas para fins legais e de
              acordo com todas as leis e regulamentos aplicáveis.
            </p>
            <p className="ml-4">
              2.2 - Não é permitido realizar atividades que possam prejudicar a
              segurança ou a integridade do site.
            </p>
          </ol>
          <ol className="list-decimal ml-4 mb-2">
            3. Conteúdo do Usuário
            <p className="ml-4">
              3.1 - Ao enviar conteúdo para o site, você concede ao Marmitas da
              Mônica uma licença mundial, não exclusiva, para usar, reproduzir,
              modificar e distribuir esse conteúdo.
            </p>
            <p className="ml-4">
              3.2 - Você é responsável por garantir que o conteúdo que você
              envia esteja em conformidade com as leis aplicáveis e não infrinja
              os direitos de terceiros.
            </p>
          </ol>
          <ol className="list-decimal ml-4 mb-2">
            4. Limitação de Responsabilidade
            <p className="ml-4">
              4.1 - O Marmitas da Mônica não será responsável por quaisquer
              danos diretos, indiretos, incidentais, especiais ou consequenciais
              resultantes do uso ou incapacidade de usar o site.
            </p>
          </ol>
          <p className="text-center mb-2 text-base">
            Política de Privacidade do Site Marmitas da Mônica:
          </p>
          <ol className="list-decimal ml-4 mb-2">
            1. Informações Coletadas
            <p className="ml-4">
              1.1 - O Marmitas da Mônica pode coletar informações pessoais, como
              nome, endereço de e-mail e informações de contato, para fornecer
              serviços personalizados.
            </p>
          </ol>
          <ol className="list-decimal ml-4 mb-2">
            2. Uso de Informações
            <p className="ml-4">
              2.1 - As informações coletadas serão usadas apenas para os fins
              para os quais foram fornecidas, como personalização de conteúdo,
              comunicação e melhorias nos serviços.
            </p>
          </ol>
          <ol className="list-decimal ml-4 mb-2">
            3. Compartilhamento de Informações
            <p className="ml-4">
              3.1 - O Marmitas da Mônica não compartilhará suas informações
              pessoais com terceiros sem o seu consentimento, exceto quando
              exigido por lei.
            </p>
          </ol>
          <ol className="list-decimal ml-4 mb-2">
            4. Segurança
            <p className="ml-4">
              4.1 - O Marmitas da Mônica tomará medidas razoáveis para proteger
              suas informações pessoais contra acesso não autorizado ou
              divulgação.
            </p>
          </ol>
        </div>
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="container flex flex-col space-y-6">
      <UserAgreement />
    </div>
  );
};

export default PrivacyPolicy;
