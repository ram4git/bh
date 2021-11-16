/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('Sleep Score Widget', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Inital State - displays the drop down options and submit button disabled', () => {
    cy.get('[data-cy=select-duration-in-bed] > option').should(
      'have.length',
      48
    );
    cy.get('[data-cy=select-duration-asleep] > option').should(
      'have.length',
      48
    );
    cy.get('[data-cy=submit-btn]').should('be.disabled');
    cy.get('[data-cy=submit-btn').should('have.text', 'Calculate');
  });

  it('Submit button is enabled only after dropdowns are selected', () => {
    cy.get('[data-cy=select-duration-in-bed]').select('2:30');
    cy.get('[data-cy=select-duration-asleep]').select('4:30');
    cy.get('[data-cy=submit-btn]').should('be.enabled');

    cy.get('[data-cy=sleep-score').should('not.exist');
    cy.get('[data-cy=sleep-score-error').should('not.exist');

    cy.get('[data-cy=submit-btn]').click();
    cy.get('[data-cy=submit-btn]').should('be.disabled');
    cy.get('[data-cy=submit-btn').should('have.text', 'Loading');

    cy.get('[data-cy=sleep-score').should('be.visible');
  });

  it('Succesful network request shows sleep score', () => {
    cy.intercept('POST', '/api/score/sleep', { sleepScore: 92 });

    cy.get('[data-cy=select-duration-in-bed]').select('2:30');
    cy.get('[data-cy=select-duration-asleep]').select('4:30');
    cy.get('[data-cy=submit-btn]').should('be.enabled');

    cy.get('[data-cy=sleep-score').should('not.exist');
    cy.get('[data-cy=sleep-score-error').should('not.exist');

    cy.get('[data-cy=submit-btn]').click();
    cy.get('[data-cy=sleep-score').should('be.visible');
    cy.get('[data-cy=sleep-score-val]').should('be.visible');
    cy.get('[data-cy=sleep-score-val]').should('have.text', 92);
  });

  it('Failed network request shows error message', () => {
    cy.intercept('POST', '/api/score/sleep', {
      error: 'Invalid Route',
      errorMsg: 'simulated error message',
    });

    cy.get('[data-cy=select-duration-in-bed]').select('2:30');
    cy.get('[data-cy=select-duration-asleep]').select('4:30');
    cy.get('[data-cy=submit-btn]').should('be.enabled');

    cy.get('[data-cy=sleep-score').should('not.exist');
    cy.get('[data-cy=sleep-score-error').should('not.exist');

    cy.get('[data-cy=submit-btn]').click();

    cy.get('[data-cy=sleep-score-error]').should('be.visible');
    cy.get('[data-cy=error-msg]').should('be.visible');
    cy.get('[data-cy=error-msg]').should(
      'have.text',
      'simulated error message'
    );
  });
});
