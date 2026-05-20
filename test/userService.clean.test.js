const { UserService } = require("../src/userService");

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  describe("createUser", () => {
    test("deve retornar um objeto com id definido ao criar um usuário", () => {
      const nome = "Fulano de Tal";
      const email = "fulano@teste.com";
      const idade = 25;

      const usuarioCriado = userService.createUser(nome, email, idade);

      expect(usuarioCriado.id).toBeDefined();
    });

    test('deve criar o usuário com status "ativo" por padrão', () => {
      const nome = "Fulano de Tal";
      const email = "fulano@teste.com";
      const idade = 25;

      const usuarioCriado = userService.createUser(nome, email, idade);

      expect(usuarioCriado.status).toBe("ativo");
    });

    test("deve lançar um erro ao tentar criar um usuário menor de idade", () => {
      const nomeMenor = "Menor";
      const emailMenor = "menor@email.com";
      const idadeMenor = 17;

      expect(() => {
        userService.createUser(nomeMenor, emailMenor, idadeMenor);
      }).toThrow("O usuário deve ser maior de idade.");
    });
  });

  describe("getUserById", () => {
    test("deve retornar o usuário correto a partir do id gerado na criação", () => {
      const nomeEsperado = "Fulano de Tal";
      const usuarioCriado = userService.createUser(
        nomeEsperado,
        "fulano@teste.com",
        25
      );

      const usuarioEncontrado = userService.getUserById(usuarioCriado.id);

      expect(usuarioEncontrado.nome).toBe(nomeEsperado);
    });

    test('deve retornar o usuário com status "ativo" logo após a criação', () => {
      const usuarioCriado = userService.createUser(
        "Fulano de Tal",
        "fulano@teste.com",
        25
      );

      const usuarioEncontrado = userService.getUserById(usuarioCriado.id);

      expect(usuarioEncontrado.status).toBe("ativo");
    });
  });

  // TESTE REFATORADO
  describe("deactivateUser", () => {
    test("deve desativar um usuário comum e retornar true", () => {
      const usuarioComum = userService.createUser(
        "Comum",
        "comum@teste.com",
        30
      );

      const resultado = userService.deactivateUser(usuarioComum.id);

      expect(resultado).toBe(true);
    });

    test('deve alterar o status do usuário comum para "inativo" após desativação', () => {
      const usuarioComum = userService.createUser(
        "Comum",
        "comum@teste.com",
        30
      );

      userService.deactivateUser(usuarioComum.id);
      const usuarioAtualizado = userService.getUserById(usuarioComum.id);

      expect(usuarioAtualizado.status).toBe("inativo");
    });

    test("não deve desativar um usuário administrador e deve retornar false", () => {
      const usuarioAdmin = userService.createUser(
        "Admin",
        "admin@teste.com",
        40,
        true
      );

      const resultado = userService.deactivateUser(usuarioAdmin.id);

      expect(resultado).toBe(false);
    });

    test('deve manter o status "ativo" do administrador após tentativa de desativação', () => {
      const usuarioAdmin = userService.createUser(
        "Admin",
        "admin@teste.com",
        40,
        true
      );

      userService.deactivateUser(usuarioAdmin.id);
      const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

      expect(usuarioAtualizado.status).toBe("ativo");
    });
  });

  describe("generateUserReport", () => {
    test("deve incluir o nome de cada usuário cadastrado no relatório", () => {
      userService.createUser("Alice", "alice@email.com", 28);
      userService.createUser("Bob", "bob@email.com", 32);

      const relatorio = userService.generateUserReport();

      expect(relatorio).toContain("Alice");
      expect(relatorio).toContain("Bob");
    });

    test("deve incluir o status de cada usuário no relatório", () => {
      userService.createUser("Alice", "alice@email.com", 28);

      const relatorio = userService.generateUserReport();

      expect(relatorio).toContain("ativo");
    });

    test("não deve conter dados de usuário quando nenhum foi cadastrado", () => {
      const relatorio = userService.generateUserReport();

      expect(relatorio).not.toContain("Nome:");
    });
  });

  describe("generateUserReport - estado vazio", () => {
    test("deve informar que não há usuários cadastrados quando o banco está vazio", () => {
      const relatorio = userService.generateUserReport();

      expect(relatorio).toContain("Nenhum usuário cadastrado");
    });
  });
});
