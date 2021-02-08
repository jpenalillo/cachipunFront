import React from "react";
import Cookies from 'universal-cookie';
import axios from 'axios';
const cookies = new Cookies();
class Juego extends React.Component {
    constructor(props) {
      super(props);
      this.state={show:false,
                  count:0,
                  selectValue1:0,
                  selectValue2:0,
                  idUser1:cookies.get('idUser1'),
                  idUser2:cookies.get('idUser2'),
                  contador:1,
                  puntos1:0,
                  puntos2:0,
                  Ganador1:0,
                  Ganador2:0,
                  Ganador3:0,
                  msjFinal:''
                };
      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange = async event => {
      const target = event.target;
      const value = target.value;
      this.setState({
        'selectValue1': value
      });
    }
    selectCombo2 = async event => {
      const target = event.target;
      const value = target.value;
      this.setState({
        'selectValue2': value
      });
    }
    calculo (var1,var2){
      if(var1 == 1 && var2 == 2){
        return 2;
      }else if(var2 == 1 && var1 == 2){
        return 1;
      }else if(var1 == 1 && var2 == 3){
        return 1;
      }else if(var2 == 1 && var1 == 3){
        return 2;
      }else  if(var1 == 2 && var2 == 3){
        return 2;
      }else if(var2 == 2 && var1 == 3){
        return 1;
      }else if(var1 == 4 && var2 == 5){
        return 1;
      }else if(var2 == 4 && var1 == 5){
        return 2;
      }else if(var1 == 5 && var2 == 2){
        return 1;
      }else if(var1 == 2 && var2 == 5){
        return 2;
      }else{
        return 0;
      }
    }
    _actualizarUsuario(id,num){
      console.log(num)
      let dataJson,campoJson;
      dataJson = {
        'ganadorJuego': 1
      };
      axios
      .post('http://localhost:3001/api/stats/player/update/' + id + '/' + num,dataJson)
      .then(res => {
        return 1;
      })
      .catch(err => {
        return 0;
      });
    }
    _asignaGanador(cont,name){
      if(cont == 1){
        this.state.Ganador1 = name;
      }else if(cont == 2){
        this.state.Ganador2 = name;
      }else if(cont == 3){
        this.state.Ganador3 = name;
      }

    }
    _guardaMovimiento(idUser,mov){
      console.log(cookies.get('idEncuesta'));
      const varJson = {
        "idEncuesta": cookies.get('idEncuesta'),
        "idUser": idUser,
        "movimiento":mov
      };
      axios
        .post('http://localhost:3001/api/stats/player/crearMov/',varJson)
        .then(res => {
          return 1;
        })
        .catch(err => {
          return 0;
        });
    }
    handleSubmit= event =>{
      event.preventDefault();
      let ganador;
      this.state.count = parseInt(this.state.count)+1;
      if(this.state.selectValue1 == 0 && this.state.selectValue2 == 0){
        alert('Debe seleccionar valor');
        return;
      }
      if(this.state.count%2 == 0){
        this._guardaMovimiento(this.state.idUser2,this.state.selectValue2);
        ganador = this.calculo(this.state.selectValue1,this.state.selectValue2);
        if(ganador == 1){
          this.state.puntos1 = this.state.puntos1+1;
          this._asignaGanador(this.state.contador,cookies.get('jugador1'));
          this._actualizarUsuario(this.state.idUser1,this.state.contador);
        }else if(ganador == 2){
          this.state.puntos2 = this.state.puntos1+1;
          this._asignaGanador(this.state.contador,cookies.get('jugador2'));
          this._actualizarUsuario(this.state.idUser2,this.state.contador);
        }
        this.setState({
          'selectValue1':0,
          'selectValue2':0
        });
        this.state.contador = this.state.contador+1;
      }else{
        this._guardaMovimiento(this.state.idUser1,this.state.selectValue1);
      }
      if(this.state.count < 6){
        if(this.state.show == true){  
            this.state.nomMostrar = cookies.get('jugador2');
            this.setState({
                'show': false
              });
        }else{
            this.state.nomMostrar = cookies.get('jugador1');
            this.setState({
              'show': true
            });
        }
      }else{
        if(this.state.puntos1 > this.state.puntos2){
          cookies.set('Ganador',cookies.get('jugador1'),{path:"/"});
        }else{
          cookies.set('Ganador',cookies.get('jugador2'),{path:"/"});
        }
        window.location.href = "/fin";
      }
    }
  
    render() {
        return (
            <div className="container">
              <div className="col">
                <h3 className="display-3 text-center text-light bg-dark">CACHIPUN!</h3>
              </div>
                <div className="row">
                    <div className="col-sm">
                      <form onSubmit={this.handleSubmit}>
                      <div className="jugador1">
                              {
                                this.state.show?
                                <h1 className="text-secondary">Juega: {cookies.get('jugador2')}</h1>
                              :
                              <h1  className="text-secondary">Juega: {cookies.get('jugador1')}</h1>
                              }
                              <label>
                              {
                                this.state.show?
                                  <select name="jugador2" className="form-control" value={this.state.selectValue2} onChange={this.selectCombo2}>
                                  <option value="0">Selecciona Opcion</option>
                                  <option value="1">Piedra</option>
                                  <option value="2">Papel</option>
                                  <option value="3">Tijera</option>
                                  <option value="4">cordel</option>
                                  <option value="5">perro</option>
                                  </select>
                                :
                                <select name="jugador1"  className="form-control"  value={this.state.selectValue1} onChange={this.handleChange}>
                                <option value="0">Selecciona Opcion</option>
                                <option value="1">Piedra</option>
                                <option value="2">Papel</option>
                                <option value="3">Tijera</option>
                                <option value="4">cordel</option>
                                <option value="5">perro</option>
                                </select> 
                              }
                              </label>
                      </div>
                      <div>
                        {this.state.msjFinal}
                      </div>
                      <input type="submit" value="Submit" className="btn btn-dark"/>
                      </form>
                    </div>
                    <div className="col-sm">
                    <h3 className="text-secondary">Resultados</h3>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Round</th>
                          <th>Ganador</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>{this.state.Ganador1}</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>{this.state.Ganador2}</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>{this.state.Ganador3}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                 </div>             
            </div>
         );
    }
}
 
export default Juego;