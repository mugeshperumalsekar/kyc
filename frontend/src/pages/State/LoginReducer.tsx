const storedLoginDetails = localStorage.getItem('loginDetails');

const initialState = {
  userData: {},
  loginDetails: storedLoginDetails ? JSON.parse(storedLoginDetails) : {},
};

const loginReducer = (
  state = initialState,
  action: { type: string; payload: { email: string; password: string; id: number ,username:string,accessLevel:string} }
) => {
  switch (action.type) {
    case 'SAVE_USER_DETAILS':
      return {
        ...state,
        userData: action.payload,
      };
    case 'SAVE_LOGIN_DETAILS':
      localStorage.setItem('loginDetails', JSON.stringify(action.payload));
      return {
        ...state,
        loginDetails: action.payload,
      };
    default:
      return state;
  }
};

export default loginReducer;



