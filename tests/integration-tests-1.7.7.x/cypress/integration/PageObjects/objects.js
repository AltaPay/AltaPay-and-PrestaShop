require('cypress-xpath')

class Order

{
    visit(){
        cy.fixture('config').then((url)=>{
        cy.visit(url.shopURL) 
        })    
    }
  
    addproduct(){
        cy.fixture('config').then((url)=>{
            cy.visit(url.shopURL + '/7-mug-the-adventure-begins.html')
            }) 
        cy.get('.add > .btn').click()
        cy.get('.cart-content-btn > .btn-primary').click()
        cy.get('.text-sm-center > .btn').click()
        cy.get('#field-id_gender-1').click()
        cy.get(':nth-child(4) > .col-md-6 > #field-email').type('demo1@example.com')
        cy.get('#field-firstname').type('Testperson-dk')
        cy.get('#field-lastname').type('Testperson-dk')
        cy.get(':nth-child(11) > .col-md-6 > .custom-checkbox > label').click()
        cy.get(':nth-child(9) > .col-md-6 > .custom-checkbox > label').click()
        cy.get(':nth-child(8) > .col-md-6 > .custom-checkbox > label').click()
        cy.get(':nth-child(10) > .col-md-6 > .custom-checkbox > label').click()
        cy.get('#customer-form > .form-footer > .continue').click()
        cy.get('#field-address1').type('Sæffleberggate 56,1 mf')
        cy.get('#field-postcode').type('6800')
        cy.get('#field-city').type('Varde')
        cy.get('#field-id_country').select('Denmark')
        cy.get('.js-address-form > .form-footer > .continue').click()
        cy.get('#js-delivery > .continue').click()
    }

    cc_payment(CC_TERMINAL_NAME){        
        cy.contains('Pay with ' +CC_TERMINAL_NAME).click({force: true})
        cy.get('.condition-label > .js-terms').click()
        cy.get('.ps-shown-by-js > .btn').click()
        cy.get('[id=creditCardNumberInput]').type('4111111111111111')
        cy.get('#emonth').type('01')
        cy.get('#eyear').type('2023')
        cy.get('#cvcInput').type('123')
        cy.get('#cardholderNameInput').type('testname')
        cy.get('#pensioCreditCardPaymentSubmitButton').click().wait(4000)
    }

    klarna_payment(KLARNA_DKK_TERMINAL_NAME){
        cy.contains('Pay with '+KLARNA_DKK_TERMINAL_NAME).click({force: true})
        cy.get('.condition-label > .js-terms').click()
        cy.get('.ps-shown-by-js > .btn').click().wait(2000)
        cy.get('[id=submitbutton]').click().wait(3000)
        cy.get('[id=klarna-pay-later-fullscreen]').wait(8000).then(function($iFrame){
            const mobileNum = $iFrame.contents().find('[id=invoice_kp-purchase-approval-form-phone-number]')
            cy.wrap(mobileNum).type('(452) 012-3456')
            const personalNum = $iFrame.contents().find('[id=invoice_kp-purchase-approval-form-national-identification-number]')
            cy.wrap(personalNum).type('1012201234')
            const submit = $iFrame.contents().find('[id=invoice_kp-purchase-approval-form-continue-button]')
            cy.wrap(submit).click().wait(4000)
        })    
    }

    admin(){
            cy.clearCookies()
            cy.fixture('config').then((admin)=>{
            cy.visit(admin.adminURL)
            cy.get('#email').type(admin.adminUsername)
            cy.get('#passwd').type(admin.adminPass).wait(2000)
            cy.get('.ladda-label').click().wait(3000)
            cy.get('body').then(($p) => {
                if ($p.find('.onboarding-welcome > .onboarding-button-shut-down').length) {
                    cy.get('.onboarding-welcome > .onboarding-button-shut-down').click()
                }
            })
            })
    }

    capture(){

        // 1.7.X
        cy.get('.mi-shopping_basket').click()
        cy.get('#subtab-AdminOrders > .link').click()
        cy.get(':nth-child(1) > .action-type > .btn-group-action > .btn-group > .grid-view-row-link > .material-icons').click()
        cy.get('#btn-capture').click()
        cy.get('#popup_ok').click()
        cy.get('#popup_ok').click()
        cy.get('#altapay > div > div > div.card-body > div:nth-child(4) > div:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').should('have.text', 'captured')
    }

    refund(){
        //Refund
        cy.get(':nth-child(2) > :nth-child(10) > .form-control').clear().type('1').click()
        cy.get('#btn-refund').click()
        cy.get('#popup_ok').click()
        cy.get('#popup_ok').click()
        cy.get('#altapay > div > div > div.card-body > div:nth-child(4) > div:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').should('have.text', 'refunded')
    }   

    
    release_payment(){
        cy.get('.mi-shopping_basket').click()
        cy.get('#subtab-AdminOrders > .link').click()
        cy.get(':nth-child(1) > .action-type > .btn-group-action > .btn-group > .grid-view-row-link > .material-icons').click()
        cy.get('#btn-release').click()
        cy.get('#popup_ok').click()
        cy.get('#popup_ok').click()
        cy.get('#altapay > div > div > div.card-body > div:nth-child(4) > div:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').should('have.text', 'released')
    }

    change_currency_to_EUR_for_iDEAL(){
        cy.get('.mi-language').click()
        cy.get('#subtab-AdminParentLocalization > .link').click()
        cy.get('#subtab-AdminCurrencies').click()
        cy.get('body').then(($body) => {
            if ($body.text().includes('€')) {
                cy.get('body').then(($p) => {
                })
            }
            else {
                cy.get('#page-header-desc-configuration-add').click()
                cy.get('.select2-selection').type('Euro (EUR){enter}').wait(2000)
                cy.get('#save-button').click()
                cy.get('#page-header-desc-configuration-add').click()
                cy.get('.select2-selection').type('Euro (EUR){enter}')
                cy.get('#save-button').click()
            }
        })
    }

    set_default_currency_EUR(){
        cy.get('#subtab-AdminLocalization').click()
        cy.get('#select2-form_default_currency-container').click().get('#form_default_currency').select('Euro (EUR)',{force: true})
        cy.get('#form-configuration-save-button').click().wait(1000)
        cy.get('#subtab-AdminCurrencies').click()
        cy.get('#input-false-admin_currencies_toggle_status-1')
            .invoke('val')
            .then(somevalue => {
                if (somevalue == "0") {
                    cy.get('#input-false-admin_currencies_toggle_status-1').click()
                }
            })
    }

    // Re-save EUR Terminal Config
    re_save_EUR_currency_config(){
        cy.get('.mi-extension').click()
        cy.get('#subtab-AdminModulesSf > .link').click()
        cy.get('.pstaggerAddTagInput').type('Altapay').wait(1000)
        cy.get('#module-search-button').click()
        cy.get('.btn-group > .btn-primary-reverse').click().wait(2000)
        cy.fixture('config').then((admin) => {
            cy.contains(admin.iDEAL_EUR_TERMINAL).click().wait(1000)
        })
        cy.get('#altapay_terminals_form_submit_btn').click()
    }

    ideal_payment(iDEAL_EUR_TERMINAL){        
        cy.contains('Pay with ' +iDEAL_EUR_TERMINAL).click({force: true})
        cy.get('#idealIssuer').select('AltaPay test issuer 1')
        cy.get('#pensioPaymentIdealSubmitButton').click()
        cy.get('[type="text"]').type('shahbaz.anjum123-facilitator@gmail.com')
        cy.get('[type="password"]').type('Altapay@12345')
        cy.get('#SignInButton').click()
        cy.get(':nth-child(3) > #successSubmit').click().wait(1000)
    }
    ideal_refund(){
        cy.get('#maintab-AdminParentOrders > .title').click()
        cy.get('tbody > :nth-child(1) > .fixed-width-xs').click().wait(1000)
         cy.get('[id=transactionOptions]').then(function($iFrame){
            const capture = $iFrame.contents().find('[id=btn-refund]')
            cy.wrap(capture).click({force: true})
            cy.get(':nth-child(2) > :nth-child(10) > .form-control').type('3').click()
            
        })
            
        cy.get('[id=transactionOptions]').then(function($iFrame){
            const capture = $iFrame.contents().find('[id=btn-refund]')
            cy.wrap(capture).click({force: true})
            cy.get('#popup_ok').click()
            cy.get('#popup_ok').click()
        })
        cy.get('#altapay > div > div > div.row.panel-body > div:nth-child(4) > div:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').should('have.text', 'bank_payment_refunded')
    }

    change_currency_to_DKK(){
        cy.get('#subtab-AdminCurrencies').click()
        cy.get('body').then(($body) => {
            if ($body.text().includes('Euro')) {
                cy.get(':nth-child(2) > .action-type > .btn-group-action > .btn-group > .btn-link').click()
                cy.get(':nth-child(2) > .action-type > .btn-group-action > .btn-group > .dropdown-menu > .btn').click()
                cy.get('.btn-danger').click()
            }
        })
    }

    set_default_currency_DKK(){
        cy.get('.mi-language').click()
        cy.get('#subtab-AdminParentLocalization > .link').click()
        cy.get('#select2-form_default_currency-container').click().get('#form_default_currency').select('Danish Krone (DKK)',{force: true})
        cy.get('#form-configuration-save-button').click().wait(2000)
    }

    re_save_DKK_currency_config(){
        cy.get('.mi-extension').click()
        cy.get('#subtab-AdminModulesSf > .link').click()
        cy.get('.pstaggerAddTagInput').type('Altapay').wait(1000)
        cy.get('#module-search-button').click()
        cy.get('.btn-group > .btn-primary-reverse').click().wait(2000)
        cy.fixture('config').then((admin) => {
            cy.contains(admin.CC_TERMINAL_NAME).click().wait(1000)
        })
        cy.get('#altapay_terminals_form_submit_btn').click()
    }

    addpartial_product(){
        cy.fixture('config').then((url)=>{
            cy.visit(url.shopURL + '/6-mug-the-best-is-yet-to-come.html')
            cy.get('.add > .btn').click()
            cy.get('.cart-content-btn > .btn-primary').click()
        })
    }
    
    partial_capture(){
        cy.get('.mi-shopping_basket').click()
        cy.get('#subtab-AdminOrders > .link').click()
        cy.get(':nth-child(1) > .action-type > .btn-group-action > .btn-group > .grid-view-row-link > .material-icons').click()
        cy.get(':nth-child(2) > :nth-child(10) > .form-control').clear().type('1').click()
        cy.get('#btn-capture').click()
        cy.get('#popup_ok').click()
        cy.get('#popup_ok').click()
        cy.get('#altapay > div > div > div.card-body > div:nth-child(4) > div:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').should('have.text', 'captured')
    }

    partial_refund(){
        cy.get('.mi-shopping_basket').click()
        cy.get('#subtab-AdminOrders > .link').click()
        cy.get(':nth-child(1) > .action-type > .btn-group-action > .btn-group > .grid-view-row-link > .material-icons').click()
        cy.get(':nth-child(2) > :nth-child(10) > .form-control').clear().type('1').click()
        cy.get('#btn-refund').click()
        cy.get('#popup_ok').click()
        cy.get('#popup_ok').click()
        cy.get('#altapay > div > div > div.card-body > div:nth-child(4) > div:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').should('have.text', 'refunded')
    }
}
export default Order