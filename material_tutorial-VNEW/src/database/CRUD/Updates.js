import React from "react";
import { db } from "../firebase";

/**
 * Update an account
 * @param {object containing account details} values
 */
export const UpdateAccount = async (values, idToWorkOn) => {
  await db
    .collection("accounts")
    .doc(idToWorkOn)
    .update({
      owner: values.accountOwnerName,
      accountnr: values.accountNr,
      bank: values.accountBankName,
      balance: values.accountCurrentBalance,
    })
    .then(() => {
      return;
    })
    .catch((err) => {
      return alert(err);
    });
};
