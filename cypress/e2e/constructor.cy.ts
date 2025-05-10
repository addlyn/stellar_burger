const SELECTORS = {
  INGREDIENT_ITEM: '[data-cy="ingredient-item"]',
  BUN_ITEM: '[data-cy="ingredient-item"][data-type="bun"]',
  MAIN_ITEM: '[data-cy="ingredient-item"][data-type="main"]',
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE: '[data-cy="modal-close"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  ORDER_BUTTON: '[data-cy="order-btn"]',
  USER_NAME: '[data-cy="user-name"]'
};

describe('Тест: конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
  });

  it('добавляет булку и ингредиент и проверяет Redux state конструктора', () => {
    cy.wait('@getIngredients');

    cy.get(SELECTORS.BUN_ITEM).first().find('button').click();

    cy.get(SELECTORS.MAIN_ITEM).first().find('button').click();

    cy.window().then((win) => {
      const state = win.store.getState();

      expect(state.burgerConstructor.bun).to.have.property(
        'name',
        'Краторная булка N-200i'
      );

      expect(state.burgerConstructor.ingredients).to.have.length(1);
      expect(state.burgerConstructor.ingredients[0]).to.have.property(
        'name',
        'Биокотлета из марсианской Магнолии'
      );

      cy.log('Конструктор:', JSON.stringify(state.burgerConstructor, null, 2));
    });
  });

  it('открывает и закрывает модальное окно ингредиента на крестик', () => {
    cy.get(SELECTORS.INGREDIENT_ITEM).first().click();
    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('открывает и закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.get(SELECTORS.INGREDIENT_ITEM).first().click();
    cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
    cy.get(SELECTORS.MODAL).should('not.exist');
  });
});

describe('Тест: моковый пользователь, cоздание заказа', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Бургер с беконом',
        order: {
          _id: '12345',
          number: 12345,
          ingredients: ['ingredient1', 'ingredient2']
        }
      }
    }).as('createOrder');
    cy.visit('/');
  });

  it('Авторизация пользователя, cбор заказа в конструкторе, создание заказа', () => {
    const mockUser = {
      email: 'daria123@test.com',
      name: 'Дарья',
      password: 'test123'
    };

    const mockAccessToken = 'mock-access-token';
    cy.setCookie('accessToken', mockAccessToken);

    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: mockUser
      }
    }).as('fetchUser');

    cy.wait(500);

    cy.wait('@fetchUser', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get(SELECTORS.BUN_ITEM).first().find('button').click();

    cy.get(SELECTORS.MAIN_ITEM).first().find('button').click();

    cy.wait('@fetchUser').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.success).to.be.true;
      expect(interception.response.body.user).to.deep.equal(mockUser);
    });

    cy.window().then((win) => {
      const state = win.store.getState();

      expect(state.burgerConstructor.bun).to.have.property(
        'name',
        'Краторная булка N-200i'
      );

      expect(state.burgerConstructor.ingredients).to.have.length(1);
      expect(state.burgerConstructor.ingredients[0]).to.have.property(
        'name',
        'Биокотлета из марсианской Магнолии'
      );

      cy.log('Конструктор:', JSON.stringify(state.burgerConstructor, null, 2));
    });

    cy.window()
      .its('store')
      .invoke('getState')
      .then((state) => {
        const user = state.user.user;
        expect(user).to.deep.equal(mockUser);
        cy.get(SELECTORS.USER_NAME).should('contain', mockUser.name);
      });

    cy.get(SELECTORS.ORDER_BUTTON).click();

    cy.get(SELECTORS.MODAL).should('exist');
    cy.get(SELECTORS.MODAL).should('contain', '12345');

    cy.get(SELECTORS.MODAL_CLOSE).click();

    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.window().then((win) => {
      const state = win.store.getState();
      expect(state.burgerConstructor.bun).to.be.null;
      expect(state.burgerConstructor.ingredients).to.have.length(0);
    });
  });
});
