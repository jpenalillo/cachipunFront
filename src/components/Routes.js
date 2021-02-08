import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Juego from "./Juego";
import Fin from "./Fin";
import Cookies from 'universal-cookie';
import sha256 from 'crypto-js/sha256';
import axios from 'axios';
// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

// You can think of these components as "pages"
// in your app.
const cookies = new Cookies();
class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {jugador1: '',jugador2: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  _crearUsuario(varJson){
    axios
    .post('http://localhost:3001/api/stats/player/crear/',varJson)
    .then(res => {
      return 1;
    })
    .catch(err => {
      return 0;
    });
  }
  handleSubmit(event) {
    let created = new Date();
    let md5Hash = sha256(created).toString();
    let idUser1,idUser2;
    event.preventDefault();
    if(this.state.jugador1 == "" || this.state.jugador2 == ""){
      alert('Debe escribir los nombres');
      return;
    }
    this.state.count = parseInt(this.state.count)+1;
    cookies.set('jugador1',this.state.jugador1,{path:"/"});
    cookies.set('jugador2',this.state.jugador2,{path:"/"});
    idUser1 = sha256(this.state.jugador1 + created).toString();;
    idUser2 = sha256(this.state.jugador2 + created).toString();
    cookies.set('idUser1',idUser1,{path:"/"});
    cookies.set('idUser2',idUser2,{path:"/"});
    const usuario1 = {
      "idUser": idUser1,
      "nombre": this.state.jugador1,
      "playerNum":1,
      "idEncuesta":md5Hash
    };
    const usuario2 = {
      "idUser": idUser2,
      "nombre": this.state.jugador2,
      "playerNum":2,
      "idEncuesta":md5Hash
    };
    cookies.set('idEncuesta',idUser2,{path:"/"});
    this._crearUsuario(usuario1);
    this._crearUsuario(usuario2);
    window.location.href = "/juego";
  }
  render() { 
    return (
      <Router>
          <Switch>
                <Route path="/fin">
                  <Fin />
              </Route>
              <Route path="/juego">
                <Juego />
              </Route>
              <Route path="/">
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                      <div className="col-sm">
                          <div className="row">
                              <div>
                                  <h3 className="display-4 text-center text-light bg-dark">Ingresa el nombre los jugadores</h3>
                              </div>
                          </div>
                          <div className="row">
                              
                              <div className="form-group">  
                                  <label>Jugador 1</label>
                                  <input
                                      name="jugador1"
                                      type="text"
                                      value={ this.state.jugador1 || "" }
                                      onChange={this.handleChange} 
                                      className="form-control"/>
                              </div>
                          </div>
                          <div className="row">
                              <div className="form-group">  
                                  <label>Jugador 2</label>
                                  <input
                                      type="text"
                                      name="jugador2"
                                      value={ this.state.jugador2 || "" }
                                      onChange={this.handleChange} 
                                      className="form-control" />
                              </div>
                          </div>
                          <input
                              type="submit"
                              value="Enviar"
                              className="btn btn-dark"/>
                      </div>
                    </form>
                </div>
              </Route>
          </Switch>
      </Router>  );
  }
  
  handleChange(event) {  
    this.setState({ 
    [event.target.name] : event.target.value 
    }) 
  }
}
export default Routes;