interface SaveLoginDetailsAction {
  type: 'SAVE_LOGIN_DETAILS';
  payload: {
    username:string;
    email: string;
    password: string;
    accessLevel:string;
    id: string;
  };
}

export type LoginActionTypes = SaveLoginDetailsAction;

export const saveLoginDetailsAction = (username:string,email: string, password: string, id: string,accessLevel:string): SaveLoginDetailsAction => {
  const loginDetails = { username,email, password, id,accessLevel };
  localStorage.setItem('loginDetails', JSON.stringify(loginDetails));

  return {
    type: 'SAVE_LOGIN_DETAILS',
    payload: loginDetails,
  };
};




