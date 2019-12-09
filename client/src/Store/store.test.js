import * as actions from './actions'
import * as types from './actions/actionTypes'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { expect, assert } from 'chai'
import moxios from 'moxios'

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares)

describe('synchronous actions', () => {
  it('should toggle tts', () => {
    const expectedAction = { type: types.TOGGLE_TTS }
    expect(actions.toggleTTS()).to.deep.equal(expectedAction)
  })

  it('should toggle audio spinner', () => {
    const expectedAction = { type: types.TOGGLE_SPINNER, value: true }
    expect(actions.toggleSpinner(true)).to.eql(expectedAction)
  })

  it('should update user', () => {
    const value = {_id: "test", username:"test"}
    const expectedAction = {
      type: types.UPDATE_USER,
      value
    }
    expect(actions.update_user(value)).to.deep.equal(expectedAction)
  })

  it('should toggle languages modal', () => {
    const expectedAction = { type: types.TOGGLE_LANG_MODAL }
    expect(actions.toggle_lang_modal()).to.deep.equal(expectedAction)
  })

  it('should toggle language', () => {
    const value = {_id: "test", langueFr:"test"}
    const expectedAction = {
      type: types.TOGGLE_LANGUE,
      value
    }
    expect(actions.toggle_langue(value)).to.deep.equal(expectedAction)
  })
})

describe('async actions', () => {
  it('should fetch languages data', () => {    
    const store = mockStore({})
    return store.dispatch(actions.fetch_langues())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type');
        expect(actions[0].type).to.deep.equal(types.SET_LANGUES);
        expect(actions[0]).to.have.property('value');
        expect(actions[0].value).to.be.an('array').that.is.not.empty;
        expect(actions[0]).to.have.nested.property('value[0]._id');
        expect(actions[0]).to.have.nested.property('value[0].langueFr');
        expect(actions[0].value).to.have.lengthOf.above(10);
      })
  })

  it('should fetch user data', () => { //Pas testé le cas où l'utilisateur n'est pas connecté, à voir
    const store = mockStore({})
    return store.dispatch(actions.fetch_user())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type');
        expect(actions[0].type).to.deep.equal(types.SET_USER);
        expect(actions[0]).to.have.property('value');
        assert.include(actions[0].value, {status: "Actif"}, "User is not connected. try logging in your browser and relaunch the test");
        expect(actions[0].value.roles).to.be.an('array').that.is.not.empty;
        expect(actions[0]).to.have.nested.property('value._id');
        expect(actions[0]).to.have.nested.property('value.username');
        expect(actions[0]).to.have.nested.property('value.status');
      })
  })

  it('should fetch dispositifs', () => {    
    const store = mockStore({})
    return store.dispatch(actions.fetch_dispositifs())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type');
        expect(actions[0].type).to.deep.equal(types.SET_DISPOSITIFS);
        expect(actions[0]).to.have.property('value');
        expect(actions[0].value).to.be.an('array').that.is.not.empty;
        expect(actions[0]).to.have.nested.property('value[0]._id');
        expect(actions[0]).to.have.nested.property('value[0].titreInformatif');
        expect(actions[0].value).to.have.lengthOf.above(10);
      })
  })

  it('should fetch structures', () => {    
    const store = mockStore({})
    return store.dispatch(actions.fetch_structures())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type');
        expect(actions[0].type).to.deep.equal(types.SET_STRUCTURES);
        expect(actions[0]).to.have.property('value');
        expect(actions[0].value).to.be.an('array').that.is.not.empty;
        expect(actions[0]).to.have.nested.property('value[0]._id');
        expect(actions[0]).to.have.nested.property('value[0].status');
        expect(actions[0].value).to.have.lengthOf.above(1);
      })
  })
})

describe('mock async actions', () => {
  beforeEach(function () {
    moxios.install()
  })

  afterEach(function () {
    moxios.uninstall()
  })

  it('should mock languages data', () => {    
    const store = mockStore({})
    const fakeData = [ { _id: "test", langueFr: "test" } ];
    const expectedAction = { type: types.SET_LANGUES, value: fakeData };

    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: { data: fakeData }
      })
    })

    return store.dispatch(actions.fetch_langues())
      .then(() => expect(store.getActions()[0]).to.deep.equal(expectedAction) )
  })

  it('should mock user data', () => { //Pas testé le cas où l'utilisateur n'est pas connecté, à voir
    const store = mockStore({})
    const fakeData = { _id: "test", username: "test" };
    const expectedAction = { type: types.SET_USER, value: fakeData };

    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: { data: fakeData }
      })
    })

    return store.dispatch(actions.fetch_user())
      .then(() => expect(store.getActions()[0]).to.deep.equal(expectedAction) )
  })

  it('should mock dispositifs', () => {    
    const store = mockStore({})
    const fakeData = [ { _id: "test", titreInformatif: "test" } ];
    const expectedAction = { type: types.SET_DISPOSITIFS, value: fakeData };

    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      console.log(request.config.url)
      expect(moxios.requests.mostRecent().config.url).to.contain("/dispositifs/get_dispositif")
      request.respondWith({
        status: 200,
        response: { data: fakeData }
      })
    })

    return store.dispatch(actions.fetch_dispositifs())
      .then(() => expect(store.getActions()[0]).to.deep.equal(expectedAction) )
  })

  it('should mock structures', () => {    
    const store = mockStore({})
    const fakeData = [ { _id: "test", status: "test" } ];
    const expectedAction = { type: types.SET_STRUCTURES, value: fakeData };

    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: { data: fakeData }
      })
    })
    
    return store.dispatch(actions.fetch_structures())
      .then(() => expect(store.getActions()[0]).to.deep.equal(expectedAction) )
  })
})