<?php
/**
 * Altapay module for Prestashop
 *
 * Copyright © 2020 Altapay. All rights reserved.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

class ALTAPAYshowsavedcreditcardsModuleFrontController extends ModuleFrontController
{
    /**
     * Method for displaying saved credit cards in user account page
     */
    public function initContent()
    {
        $this->display_column_left = false;
        parent::initContent();

        $savedCreditCard = array();

        if ($this->context->customer->isLogged()) {
            $customerID = $this->context->customer->id;
            $sql = 'SELECT * FROM `' . _DB_PREFIX_ . 'altapay_saved_credit_card` WHERE userID ='.$customerID ;
            $results = Db::getInstance()->executeS($sql);
            if(!empty($results)){
                foreach($results as $result) {
                    $savedCreditCard[] = array (
                        'userID'=>$result['userID'],
                        'creditCard' => $result['creditCardNumber'],
                        'cardName'=> $result['cardName'],
                        'cardBrand'=> $result['cardBrand'],
                        'cardExpiryDate'=> $result['cardExpiryDate']);
                }
                $this->context->smarty->assign('savedCreditCard', $savedCreditCard);
            }
        }

        $this->setTemplate('module:altapay/views/templates/front/showCreditCards.tpl');
    }
}
