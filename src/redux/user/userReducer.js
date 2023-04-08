const initialState = {
    user: {}
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "APISUCCESS":
            return {
                ...state, user: action.payload
            };
        case "APIERROR": {
            return initialState;
        }
        case "LOGOUT": {
            return initialState;
        }
        default:
            return initialState;
    }
}