describe('Button Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });

  describe('Normal Button', () => {
    it('should display the button', () => {
      cy.contains('Danger Button').should('exist');
    });

    it('should respond to click', () => {
      cy.contains('Danger Button').click();
      cy.contains('Loading Button').should('exist');
      cy.get('.button-result').should('contain', 'Clicked');
    });
  });

  describe('Float Button is exist', () => {
    it('should display the Float button', () => {
      const floatButton = cy.contains('FloatBtn');
      floatButton.should('exist');
      floatButton.should('contain', 'FloatBtn');
    });

    it('Float button should respond to hover', () => {
      const floatButton = cy.contains('FloatBtn');
      floatButton.trigger('mouseover');
      cy.get('.ant-tooltip-inner', { timeout: 10000 }).should('be.visible');
    });
  });
});





/// <reference types="cypress" />

describe('Descriptions Components', () => {
  beforeEach(() => {
    // 访问你的 React 应用，如果是本地运行的，可以是 'http://localhost:3000'
    cy.visit('http://localhost:4000');
  });


  it('should display Descriptions with default size initially', () => {
    // 检查Descriptions组件
    cy.get('.ant-descriptions')
      .should('be.visible')
      .and('have.class', 'ant-descriptions-bordered'); // 假设默认大小与'bordered'类有关
  
    // 检查radio按钮
    cy.get('label.ant-radio-wrapper-checked')
      .should('have.class', 'ant-radio-wrapper')
      .and('contain', 'default'); // 检查label中包含的文本是否是'default'
  
    // 或者检查具体的input元素
    cy.get('input.ant-radio-input:checked')
      .should('have.value', 'default'); // 检查value是否为'default'
  });
  
  

  it('should change Descriptions size when Radio button is clicked', () => {
    // 点击不同的 Radio 按钮并检查 Descriptions 的大小是否更新
    
    // 点击 'middle' radio 按钮
    cy.get('input[type="radio"]').check('middle', { force: true });
    // 确保 Descriptions 组件在更新后具有正确的类名
    cy.get('.ant-descriptions-bordered')
      .should('be.visible')
      .and('have.class', 'ant-radio ant-wave-target'); // 假设 'middle' 的实际类名
    
    // 点击 'small' radio 按钮
    cy.get('input[type="radio"]').check('small', { force: true });
    // 确保 Descriptions 组件在更新后具有正确的类名
    cy.get('.ant-descriptions-bordered')
      .should('be.visible')
      .and('have.class', 'ant-radio ant-wave-target'); // 假设 'small' 的实际类名
    
    // 点击 'default' radio 按钮
    cy.get('input[type="radio"]').check('default', { force: true });
    // 确保 Descriptions 组件在更新后具有正确的类名
    cy.get('.ant-descriptions-bordered')
      .should('be.visible')
      .and('have.class', 'ant-radio ant-wave-target ant-radio-checked'); // 假设 'default' 的实际类名
  });
  
  

  it('should correctly display items within the Descriptions', () => {
    // 检查每一个 `items` 是否在 Descriptions 中正确显示
    cy.get('.ant-descriptions-bordered')
      .contains('Cloud Database').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('Prepaid').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('18:00:00').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('$80.00').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('$20.00').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('$60.00').should('exist');

    // 检查 Config Info 的显示
    cy.get('.ant-descriptions-bordered')
      .contains('Data disk type: MongoDB').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('Database version: 3.4').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('Storage space: 10 GB').should('exist');
    cy.get('.ant-descriptions-bordered')
      .contains('Region: East China 1').should('exist');
  });
});
