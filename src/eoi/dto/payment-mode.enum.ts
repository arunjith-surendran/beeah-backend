// Matches Salesforce's Mode_of_Payment__c.Type__c restricted picklist exactly -
// confirmed via the object's describe metadata, not guessed. Values not used
// here but also valid on that picklist: 'Direct', 'Deposit', 'POS', 'Transfer',
// 'Payment Link'.
export enum PaymentMode {
  BankTransfer = 'Bank Transfer',
  Cheque = 'Cheque',
  Cash = 'Cash',
  CreditCard = 'Credit Card',
}
