describe('DatePicker Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
    });
  
    describe('Normal DatePicker', () => {
      it('should display the DatePicker', () => {
        cy.contains('Danger Button').should('exist');
      });
  
      it('should respond to click', () => {
        cy.contains('Danger Button').click();
        cy.contains('Loading Button').should('exist');
        cy.contains('Loading Button Float').should('exist');
        cy.get('.button-result').should('contain', 'Clicked');
      });
    });
  
    describe('Float DatePicker is exist', () => {
      it('should display the Float DatePicker', () => {
        const floatButton = cy.contains('FloatBtn');
        floatButton.should('exist');
        floatButton.contains('Loading Button Float').should('exist');
        floatButton.should('contain', 'FloatBtn');
      });
  
      it('Float Calendar should respond to hover', () => {
        const floatButton = cy.contains('FloatBtn');
        floatButton.trigger('mouseover');
        cy.get('.ant-tooltip-inner', { timeout: 10000 }).should('be.visible');
      });
    });
  });
  
  