import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import SectionTitle from "../../UI_Utils/SectionTitle";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { CurrentISODate } from "../../../utils";
import InputMask from "react-input-mask";
import TextError from "../../UI_Utils/TextError";

const ListAccounts = (props) => {
  // Array to hold the list of todos from firebase
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accountOwner, setAccountOwner] = useState("");
  const [accountNr, setAccountNr] = useState("");
  const [bank, setBank] = useState("");
  const [balance, setBalance] = useState(0);

  const { currentUser, logout } = useAuth();

  /**
   * Delete a todo based on it's id
   * @param {*} id
   */
  const deleteAccount = () => {
    setShowMessageToDelete(false)
    // const id = e.id
    db.collection("accounts")
      .doc(idToDelete)
      .delete()
      .then(() => {
        return toast("Record deleted", {
          position: toast.POSITION.BOTTOM_CENTER,
          type: "info",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        return toast("Error", {
          position: toast.POSITION.BOTTOM_CENTER,
          type: "warning",
          autoClose: 3000,
        });
      });
    setShowMessage(false);
  };

  /**
   * Update the record given by id
   * @param {U} id
   */
  const editItem = (id, state) => {
    db.collection("accounts")
      .doc(id)
      .update({ done: !state })
      .then(() => {
        return toast("Todo updated", {
          position: toast.POSITION.BOTTOM_RIGHT,
          type: "info",
          autoClose: 1000,
        });
      })
      .catch((err) => {
        return toast("Error", {
          position: toast.POSITION.BOTTOM_RIGHT,
          type: "warning",
          autoClose: 1000,
        });
      });
  };

  /**
   * Get the accounts collection on a per user base
   */
  const getAccounts = async () => {
    setIsLoading(true);
    db.collection("accounts")
      .where("userid", "==", currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setAccounts(docs);
        setIsLoading(false);
      });
  };

  /**
   * useEffect hook
   */
  useEffect(() => {
    // On page load get the todos
    getAccounts();
  }, []);

  return (
    <>
      <MessageBox
        show={showMessageToDelete}
        message="Are you sure to delete the selected account?"
        handleCancel={handleCancelDelete}
        handleYes={deleteAccount}
      />
      <div className="todo-app">
        <div className="spinner">
          {/* Show progress indicator while loading data from Firestore */}
          {isLoading && <Loader type="ThreeDots" color="#2500ee" />}
        </div>
        <div className="btn-add-container">
          <span className="todo-title-header">Available accounts</span>
          <Button className="btn btn-primary" onClick={handleShowModal}>
            New Account
            <FontAwesomeIcon
              icon={faPlusSquare}
              className="ml-2"
            ></FontAwesomeIcon>
          </Button>
        </div>
        <Table responsive striped hover variant="dark">
          <thead>
            <tr>
              <th>Account Owner</th>
              <th>Account Nr</th>
              <th>Bank</th>
              <th>Created</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* Display a message when there are no todos */}
            {accounts.length === 0 && (
              <tr key={0}>
                <td colSpan="5">No Accounts</td>
              </tr>
            )}
            {/* Display the todos if there are any */}
            {accounts.map((account, key) => {
              return (
                <tr key={key}>
                  <td>{account.owner}</td>
                  <td>{account.accountnr}</td>
                  <td>{account.bank}</td>
                  <td>{account.date_created}</td>
                  <td>€{account.balance}</td>
                  <Button
                    onClick={() => onAskToDelete(account.id)}
                    variant="primary"
                  >
                    <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
                  </Button>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <AccountsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleCancelModal={handleCancelModal}
        handleCloseModal={handleCloseModal}
        existingData = {null}
      />
    </>
  );
};

export default ListAccounts;
