describe('Bredcrumb Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
    });
  
    describe('Normal Bredcrumb', () => {
      it('should display the Bredcrumb', () => {
        cy.contains('Danger Button').should('exist');
      });
  
      it('should respond to click', () => {
        cy.contains('Danger Button').click();
        cy.contains('Loading Button').should('exist');
        cy.get('.button-result').should('contain', 'Clicked');
      });
    });
  
    describe('Float Bredcrumb is exist', () => {
      it('should display the Float Bredcrumb', () => {
        const floatButton = cy.contains('FloatBtn');
        floatButton.should('exist');
        floatButton.should('contain', 'FloatBtn');
      });
  
      it('Float Bredcrumb should respond to hover', () => {
        const floatButton = cy.contains('FloatBtn');
        floatButton.trigger('mouseover');
        cy.get('.ant-tooltip-inner', { timeout: 10000 }).should('be.visible');
      });
    });
  });
  