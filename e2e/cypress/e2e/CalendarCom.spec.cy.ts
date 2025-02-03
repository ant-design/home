

  describe('Calendar Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
    });
  
    describe('Normal Calendar', () => {
      it('should display the Calendar', () => {
        cy.contains('Danger Button').should('exist');
      });
  
      it('should respond to click', () => {
        cy.contains('Danger Button').click();
        cy.contains('Loading Button').should('exist');
        cy.get('.button-result').should('contain', 'Clicked');
      });
    });
  
    describe('Float Calendar is exist', () => {
      it('should display the Float Calendar', () => {
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
  
  