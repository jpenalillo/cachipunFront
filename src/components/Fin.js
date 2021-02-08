import React from "react";
import Cookies from 'universal-cookie';
const cookies = new Cookies();
class Fin extends React.Component {
    constructor(props) {
      super(props);
      this.state={};
    }
    
    render() {
        return (
            
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className="display-3 text-center">GANASTE!!! {cookies.get('Ganador')}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-center">
                        <a className="btn btn-dark" href="http://localhost:3000/">Volver a Jugar</a>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default Fin;