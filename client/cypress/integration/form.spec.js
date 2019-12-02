describe('Form', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('it has langueModal', () => {
    cy.focused().should('have.class', 'modal')
    cy.focused().should('have.class', 'show')
  })

  it('displays list of languages', () => {
    cy.get('.modal-body .list-group li')  
      .should('have.length', 6 + 1) //6 langues + ajout d'une langue
  })

  it('selects french', () => {
    cy.get('.active.list-group-item-action.list-group-item')
      .click()
  })
})