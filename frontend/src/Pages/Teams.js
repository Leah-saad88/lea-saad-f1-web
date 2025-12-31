
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Assets } from "../Assets/assets";
import "../Assets/main.css";
const Teams =()=>{
return(
 <table class="table table-dark">
<thead className="Table">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Team</th>
      <th scope="col">Team car</th>
      <th scope="col">Driver 1</th>
      <th scope="col">Driver 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mercedes</td>
      <td><img src={Assets.mc} alt="Mercedes" width="111"/></td>
      <td><img src={Assets.george} alt="g.russel"width="44"/></td>
      <td><img src={Assets.Kimi} alt="k.antonelli"width="44" /></td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Ferrari</td>
      <td><img src={Assets.FE} alt="ferrari" width="128"/></td>
      <td><img src={Assets.Charles} alt="charles"width="41" height="47"/></td>
      <td><img src={Assets.lewis} alt="Lewis"width="44" /></td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Maclaren</td>
        <td><img src={Assets.macy} alt="mclaren" width="128"/></td>
      <td><img src={Assets.Lando} alt="lando noreis"width="44"/></td>
      <td><img src={Assets.Oscar} alt="Oscar"width="44" /></td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>Redbull</td>
      <td><img src={Assets.red} alt="redbull" width="128"/></td>
      <td><img src={Assets.Maxverstappen} alt="max"width="44" /></td>
      <td><img src={Assets.yuki} alt="yuki"width="44" /></td>
    </tr>
    <tr>
      <th scope="row">5</th>
      <td>racingbulls</td>
      <td><img src={Assets.racingbulls} alt="recingbulls" width="128"/></td>
      <td><img src={Assets.liam} alt="liam "width="44" /></td>
      <td><img src={Assets.isack} alt="isack"width="44" /></td>
      
    </tr>
    <tr>
      <th scope="row">6</th>
      <td>willaims</td>
       <td><img src={Assets.willi} alt="willaims" width="128"/></td>
      <td><img src={Assets.Carlos} alt="carlose sainze" width="45" height="44"/></td>
      <td><img src={Assets.alex} alt="alex albon" width="44" /></td>
    </tr>
    <tr>
      <th scope="row">7</th>
      <td>alpine</td>
       <td><img src={Assets.alpine} alt="alpine" width="128"/></td>
      <td><img src={Assets.pierre} alt="max"width="44" /></td>
      <td><img src={Assets.isack} alt=""width="44" /></td>
    </tr>
    <tr>
      <th scope="row">8</th>
      <td>Haas</td>
       <td><img src={Assets.haasy} alt="haas moneygram" width="128"/></td>
      <td><img src={Assets.Olly} alt="olly bearman"width="44" /></td>
      <td><img src={Assets.ocon} alt="Ocon"width="44" /></td>
    </tr>
    <tr>
      <th scope="row">9</th>
      <td>Astonmartin</td>
       <td><img src={Assets.astonmartin} alt="aston martin" width="128"/></td>
      <td><img src={Assets.alonzo} alt="max"width="44" /></td>
      <td><img src={Assets.stroll} alt="lance stroll"width="44" /></td>
    </tr>
    <tr>
       <th scope="row">10</th>
        <td>Sauber</td>
       <td><img src={Assets.sauber} alt="sauber" width="128"/></td>
      <td><img src={Assets.nick} alt="max"width="44" /></td>
      <td><img src={Assets.gab} alt="gany"width="44" /></td>
    </tr>
    

  </tbody>

  </table>
);
}
export default Teams;