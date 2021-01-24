import _auth from './auth';
import _public from './public';
import _private from './private';

const routes = {
  all: [..._auth, ..._public, ..._private],
  auth: _auth,
  public: _public,
  private: _private,
};

export default routes;