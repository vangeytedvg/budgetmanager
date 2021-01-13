/**
 * Updates.js
 * Contains all functions for updating data
 * in the firestore.
 */
import { db } from "../firebase";

/**
 * Update an account
 * @param {object containing account details} values
 */
export const UpdateAccount = async (values, idToWorkOn) => {
  db.collection("accounts").doc(idToWorkOn).update({
    owner: values.accountOwnerName,
    accountnr: values.accountNr,
    bank: values.accountBankName,
    balance: values.accountCurrentBalance,
  });
};
