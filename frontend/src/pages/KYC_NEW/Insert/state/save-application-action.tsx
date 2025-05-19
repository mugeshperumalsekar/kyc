export const saveQuestionnaire = (questionData:any) => {
    return {
        type: 'QUESTIONNARIE',
        payload: questionData
    }
}

export const removeQuestionnaire = () => {
    return {
        type: 'REMOVE_QUESTIONNARIE',
        payload: null
    }
}

export const saveDeclaration = (declarationData:any) => {
    return {
        type: 'DECLARATION',
        payload: declarationData
    }
}
export const removeDeclaration = () => {
    return {
        type: 'REMOVE_DECLARATION',
        payload: null
    }
}

export const saveListofBoardDirectors = (data:any) => {
    return {
        type: 'LIST_OF_BOARD_DIRECTORS',
        payload: data
    }
}