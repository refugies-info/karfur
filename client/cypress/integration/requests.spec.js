describe('Requests', () => {
  it('gets languages from API', () => {
    cy.request('POST', 'https://www.refugies.info/langues/get_langues')
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response).to.have.property('headers')
        expect(response).to.have.property('duration')
        expect(response.body.data).to.have.length(13)
      })
  })
})