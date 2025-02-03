describe('Button Component', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });

  describe('Paragraph Typography', () => {
    it('should display the Paragraph', () => {
      const typography: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('.ant-typography');
      typography.should('exist');
      typography.contains('Paragraph Testing');
    });
  });

  describe('Paragraph Typography Hover', () => {
    it('should display the Paragraph on hover', () => {
      const typography: Cypress.Chainable<JQuery<HTMLElement>> = cy.get('.ant-typography-edit');
      typography.trigger('mouseover');
      cy.get('.ant-tooltip-inner', { timeout: 10000 }).should('be.visible');
    });
  });


  describe('Divider Display', () => {
    it('should display the Divider Text', () => {
      cy.get('.ant-divider').should('exist');
      cy.get('.ant-divider-inner-text').contains('Divider Text');
    });
  });
});
