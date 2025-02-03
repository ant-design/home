

describe('Checkbox Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
    });
  
    describe('Normal Checkbox', () => {
      it('should display the Checkbox', () => {
        cy.contains('Danger Button').should('exist');
      });
  
      it('should respond to click', () => {
        cy.contains('Danger Button').click();
        cy.contains('Loading Button').should('exist');
        cy.get('.button-result').should('contain', 'Clicked');
      });
    });
  
    describe('Float Checkbox is exist', () => {
      it('should display the Float Checkbox', () => {
        const floatButton = cy.contains('FloatBtn');
        floatButton.should('exist');
        floatButton.should('contain', 'FloatBtn');
      });
  
      it('Float Calendar should respond to hover', () => {
        const floatButton = cy.contains('FloatBtn');
        floatButton.trigger('mouseover');
        cy.get('.ant-tooltip-inner', { timeout: 10000 }).should('be.visible');
      });
    });
  });
  
  