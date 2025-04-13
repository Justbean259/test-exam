import App from './app'
import { TokenRoute as TokenRoute } from './routes/token.route'
import { IndexRoute } from './routes/index.route'
// -------------

const app = new App([new IndexRoute(), new TokenRoute()])

app.listen()
