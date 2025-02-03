


describe('Badge Ribbon Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
    });
  
    it('should display all Badge Ribbons with correct texts', () => {
      cy.get('.ant-ribbon').each((ribbon) => {
        expect(ribbon).to.contain.text('Hippies');
      });
    });
  
    it('should display Badge Ribbons with correct colors', () => {
      const colors = ['', 'pink', 'red', 'cyan', 'green', 'purple', 'volcano', 'magenta'];
      colors.forEach((color, index) => {
        cy.get('.ant-ribbon').eq(index).should('be.visible');
        if (color === '') {
          cy.get('.ant-ribbon').eq(index).should('have.class', `ant-ribbon ant-ribbon-placement-end css-dev-only-do-not-override-3rel02`);
        } else {
          cy.get('.ant-ribbon').eq(index).should('have.class', `ant-ribbon-color-${color}`);
        }
      });
  });
  
    it('should display the Card titles correctly', () => {
      cy.get('.ant-card-small .ant-card-head-title').each((title) => {
        expect(title).to.contain.text('Pushes open the window');
      });
    });
  });