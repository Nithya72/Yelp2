
export function alert(state = [], action) {
    const { payload } = action;
    switch (action.type) {
        case "SET_ALERT":
            return [...state, payload];
        case "REMOVE_ALERT":
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}