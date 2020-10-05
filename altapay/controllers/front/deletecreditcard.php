<?php
/**
 * Altapay module for Prestashop
 *
 * Copyright © 2020 Altapay. All rights reserved.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

class ALTAPAYdeletecreditcardModuleFrontController extends ModuleFrontController
{

    /**
     * Method to follow when saved credit card is being deleted from user account page
     */
    public function postProcess()
    {
        $customerID=Tools::getValue('customerID', false);
        $cardMask=Tools::getValue('creditCardNumber', false);
        $sql = "DELETE FROM `" . _DB_PREFIX_ . 'altapay_saved_credit_card` WHERE creditcardNumber ="'.$cardMask.'" AND userID="'.$customerID.'"';
        Db::getInstance()->executeS($sql);
        Tools::redirect('index.php?fc=module&module=altapay&controller=showsavedcreditcards');
    }
}