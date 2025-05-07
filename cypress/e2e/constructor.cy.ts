describe('Тест: конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
  });
  it('добавляет булку и ингредиент и проверяет Redux state конструктора', () => {
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-item"][data-type="bun"]')
      .first()
      .find('button')
      .click();

    cy.get('[data-cy="ingredient-item"][data-type="main"]')
      .first()
      .find('button')
      .click();

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
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('открывает и закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('Тест: моковый пользователь, cоздание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'daria123@test.com',
          name: 'Дарья',
          password: 'test123'
        }
      }
    }).as('fetchUser');

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
    cy.stub(window, 'fetch').callsFake((url, options) => {
      if (url.includes('/auth/user')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              user: mockUser
            })
        });
      }

      return fetch(url, options);
    });

    cy.get('[data-cy="ingredient-item"][data-type="bun"]')
      .first()
      .find('button')
      .click();

    cy.get('[data-cy="ingredient-item"][data-type="main"]')
      .first()
      .find('button')
      .click();
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
        cy.get('[data-cy="user-name"]').should('contain', mockUser.name);
      });

    cy.get('[data-cy="order-btn"]').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal"]').should('contain', '12345');

    cy.get('[data-cy="modal-close"]').click();

    cy.get('[data-cy="modal"]').should('not.exist');

    cy.window().then((win) => {
      const state = win.store.getState();
      expect(state.burgerConstructor.bun).to.be.null;
      expect(state.burgerConstructor.ingredients).to.have.length(0);
    });
  });
});
