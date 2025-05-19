import ApplicationState from "./save-application-state";

const initialState: ApplicationState = {
    saveApplicationReducer: null,
    saveDeclarationReducer:null
};

const saveApplicationReducer = (state = initialState, action: {type:any, payload:any}) => {
    switch(action.type){
        case "QUESTIONNARIE":
            return {
                ...state,
                saveApplicationReducer: action.payload,
            };
            case "REMOVE_QUESTIONNARIE":
            return {
                ...state,
                saveApplicationReducer: action.payload,
            };
        case "DECLARATION":
            return {
                ...state,
                saveDeclarationReducer: action.payload,
            }
            case "REMOVE_DECLARATION":
                return {
                    ...state,
                    saveDeclarationReducer: action.payload,
                }
        default:
            return state;
    }
}
export default saveApplicationReducer;