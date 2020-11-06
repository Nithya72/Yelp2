import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer }  from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage: storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = applyMiddleware(thunkMiddleware, logger);
let store = createStore( persistedReducer, composeWithDevTools( middleware ));
let persistor = persistStore(store);

export {persistor, store};
